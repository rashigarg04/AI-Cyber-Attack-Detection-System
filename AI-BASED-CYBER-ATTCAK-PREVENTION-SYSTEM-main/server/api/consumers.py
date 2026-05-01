import json
import asyncio
import random
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ThreatLog
from .views import model, scaler # reuse ML model

class ThreatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("threat_stream", self.channel_name)
        await self.accept()
        
        # Start background simulator when a dashboard connects!
        self.sim_task = asyncio.create_task(self.simulate_traffic())

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("threat_stream", self.channel_name)
        if hasattr(self, 'sim_task'):
            self.sim_task.cancel()

    async def simulate_traffic(self):
        while True:
            await asyncio.sleep(random.randint(3, 7)) # Ping every 3-7 seconds
            
            # Generate random packet. 41 features.
            packet = [random.random() for _ in range(41)]
            # Bias some packets to trigger attacks
            if random.random() > 0.7:
                packet[4] = 1000 # huge byte count
                packet[22] = 255 # max connections
                
            log_data = await self.process_and_log(packet)
            
            await self.channel_layer.group_send(
                "threat_stream",
                {
                    "type": "threat_message",
                    "data": log_data
                }
            )
            
    async def threat_message(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    @database_sync_to_async
    def process_and_log(self, features):
        import numpy as np
        
        try:
            input_data = np.array(features).reshape(1, -1)
            input_scaled = scaler.transform(input_data)
            
            prediction = model.predict(input_scaled)
            probability = model.predict_proba(input_scaled)
            
            is_attack = bool(prediction[0])
            confidence = float(np.max(probability))
            
            status = "ATTACK" if is_attack else "NORMAL"
            action = "Blocked" if is_attack else "Logged"
            severity = "Low"
            event_type = "Standard Traffic"
            
            if is_attack:
                severity = "Critical" if confidence > 0.8 else "High"
                event_type = random.choice(["Neptune Protocol", "DDoS Attempt", "Port Scan"])
                
            log = ThreatLog.objects.create(
                event_type=event_type,
                severity=severity,
                confidence=confidence,
                action_taken=action,
                src_ip="192.168.1." + str(random.randint(2, 254))
            )
            
            return {
                "id": log.id,
                "time": log.timestamp.strftime("%H:%M:%S"),
                "ip": log.src_ip,
                "event": log.event_type,
                "severity": log.severity,
                "status": log.action_taken,
                "confidence": log.confidence
            }
            
        except Exception as e:
            print("SIMULATION ERROR", e)
            return {"error": str(e)}