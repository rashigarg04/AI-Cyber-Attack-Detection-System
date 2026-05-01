import joblib
import numpy as np
import os
import time
import io
import base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from twilio.rest import Client

from .models import ThreatLog, BlockedIP


# ===============================
# 🔹 RATE LIMIT ALERTS
# ===============================
last_alert = 0

def can_send_alert():
    global last_alert
    now = time.time()
    if now - last_alert > 60:
        last_alert = now
        return True
    return False


# ===============================
# 🔹 ALERT SYSTEM
# ===============================
def send_critical_email(ip, confidence):
    try:
        send_mail(
            "🚨 CRITICAL ATTACK DETECTED",
            f"IP: {ip}\nConfidence: {round(confidence,2)}",
            "your_email@gmail.com",
            ["receiver@gmail.com"],
        )
        print("Email Sent")
    except Exception as e:
        print("Email Error:", e)


def send_critical_sms(ip, confidence):
    try:
        client = Client("YOUR_SID", "YOUR_TOKEN")

        client.messages.create(
            body=f"🚨 ATTACK!\nIP: {ip}\nConfidence: {round(confidence,2)}",
            from_="+1234567890",
            to="+91XXXXXXXXXX"
        )
        print("SMS Sent")
    except Exception as e:
        print("SMS Error:", e)


# ===============================
# 🔹 LOAD AI MODEL
# ===============================
MODEL_PATH = os.path.join(settings.BASE_DIR, 'api/ai_module/cyber_model.pkl')
SCALER_PATH = os.path.join(settings.BASE_DIR, 'api/ai_module/scaler.pkl')

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
except Exception as e:
    print("Model Error:", e)


# ===============================
# 🔹 AI DETECTION + AUTO DEFENSE
# ===============================
@api_view(['POST'])
def detect_threat(request):
    try:
        features = request.data.get('features')

        if not isinstance(features, list) or len(features) != 41:
            return Response({"error": "Need 41 features"}, status=400)

        import random
        # Generate a random IP for the attack simulation instead of blocking the local developer
        ip = f"{random.randint(11,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,255)}"

        # 🚫 BLOCKED IP CHECK
        if BlockedIP.objects.filter(ip_address=ip).exists():
            return Response({"error": "IP BLOCKED"}, status=403)

        input_data = np.array(features).reshape(1, -1)
        input_scaled = scaler.transform(input_data)

        prediction = model.predict(input_scaled)
        probability = model.predict_proba(input_scaled)

        is_attack = bool(prediction[0])
        confidence = float(np.max(probability))

        status = "ATTACK" if is_attack else "NORMAL"
        action = "Blocked" if is_attack else "Logged"

        severity = "Low"
        if is_attack:
            severity = "Critical" if confidence > 0.9 else "High"

        # 🔥 AUTO BLOCK + ALERT
        if is_attack and confidence > 0.9:
            BlockedIP.objects.get_or_create(ip_address=ip)

            if can_send_alert():
                send_critical_email(ip, confidence)
                send_critical_sms(ip, confidence)

        # 📝 SAVE LOG
        ThreatLog.objects.create(
            event_type="Intrusion Attempt" if is_attack else "Standard Traffic",
            severity=severity,
            confidence=confidence,
            action_taken=action,
            src_ip=ip
        )

        response_data = {
            "status": status,
            "confidence": round(confidence, 4),
            "action": "BLOCK_IP" if is_attack else "NONE",
            "severity": severity
        }

        # Generate random realistic global coordinates for all traffic
        response_data["lat"] = random.uniform(-60.0, 70.0)
        response_data["lon"] = random.uniform(-130.0, 150.0)
        response_data["ip"] = ip

        return Response(response_data)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ===============================
# 🔹 LOGS
# ===============================
@api_view(['GET'])
def get_logs(request):
    logs = ThreatLog.objects.all().order_by('-timestamp')[:15]

    return Response([
        {
            "id": l.id,
            "time": l.timestamp.strftime("%H:%M:%S"),
            "ip": l.src_ip,
            "event": l.event_type,
            "severity": l.severity,
            "status": l.action_taken,
            "confidence": l.confidence
        } for l in logs
    ])


# ===============================
# 🔹 BLOCKED IP APIs
# ===============================
@api_view(['GET'])
def get_blocked_ips(request):
    ips = BlockedIP.objects.all().order_by('-blocked_at')

    return Response([
        {
            "ip": i.ip_address,
            "time": i.blocked_at.strftime("%H:%M:%S")
        } for i in ips
    ])


@api_view(['POST'])
def unblock_ip(request):
    ip = request.data.get('ip')
    BlockedIP.objects.filter(ip_address=ip).delete()
    return Response({"message": "Unblocked"})

@api_view(['POST'])
def block_manual(request):
    ip = request.data.get('ip')
    if not ip:
        return Response({"error": "IP required"}, status=400)
    BlockedIP.objects.get_or_create(ip_address=ip, defaults={'reason': 'Manual Admin Block'})
    return Response({"message": "Blocked successfully"})


# ===============================
# 🔐 AUTH SYSTEM
# ===============================
@api_view(['POST'])
def login_view(request):
    user = authenticate(
        username=request.data.get('username'),
        password=request.data.get('password')
    )

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})
    return Response({"error": "Invalid"}, status=400)


@api_view(['POST'])
def register_view(request):
    if User.objects.filter(username=request.data.get('username')).exists():
        return Response({"error": "User exists"}, status=400)

    User.objects.create_user(
        username=request.data.get('username'),
        password=request.data.get('password')
    )
    return Response({"message": "User created"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response({"authenticated": True})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({"message": "Logged out"})


# ===============================
# 📊 STATS
# ===============================
@api_view(['GET'])
def get_stats(request):
    now = timezone.now()
    logs = ThreatLog.objects.filter(timestamp__gte=now - timedelta(hours=24))

    last_attack = logs.filter(action_taken="Blocked").first()

    return Response({
        "active_threats": logs.filter(action_taken="Blocked").count(),
        "packets_scanned": logs.count() + 15000,
        "last_attack": last_attack.timestamp.strftime("%H:%M:%S") if last_attack else "None"
    })


# ===============================
# 📈 GRAPH
# ===============================
@api_view(['GET'])
def get_attack_graph(request):
    now = timezone.now()
    start = now - timedelta(hours=12)

    logs = ThreatLog.objects.filter(timestamp__gte=start)

    hours = []
    counts = []

    for i in range(12):
        h_start = start + timedelta(hours=i)
        h_end = start + timedelta(hours=i+1)

        count = logs.filter(
            timestamp__gte=h_start,
            timestamp__lt=h_end,
            action_taken="Blocked"
        ).count()

        hours.append(h_start.strftime("%H:00"))
        counts.append(count)

    # 🎨 Matplotlib Dark Theme Styling
    plt.figure(figsize=(10, 4), facecolor='none') 
    ax = plt.gca()
    ax.set_facecolor('none')
    
    # Stylish Bars (Emerald with semi-transparency)
    plt.bar(hours, counts, color='#10b981', alpha=0.4, edgecolor='#10b981', linewidth=2)

    # Text and labels styling
    plt.title('Blocked Attacks Over Last 12 Hours', color='#cbd5e1', fontsize=12, fontweight='bold', pad=15)
    plt.xlabel('Time (Hours)', color='#94a3b8', fontsize=10)
    plt.ylabel('Attacks Blocked', color='#94a3b8', fontsize=10)
    plt.xticks(rotation=45, color='#94a3b8')
    plt.yticks(color='#94a3b8')
    
    # Hide top/right borders, color the rest
    ax.spines['bottom'].set_color('#334155')
    ax.spines['left'].set_color('#334155')
    ax.spines['top'].set_visible(False) 
    ax.spines['right'].set_visible(False)
    
    # Subtle grid
    ax.grid(axis='y', color='#334155', linestyle='--', alpha=0.5)

    plt.tight_layout()

    buf = io.BytesIO()
    # Save with transparent background so it blends perfectly into React UI
    plt.savefig(buf, format='png', transparent=True, dpi=120)
    plt.close()

    image = base64.b64encode(buf.getvalue()).decode()

    return Response({"image": "data:image/png;base64," + image})