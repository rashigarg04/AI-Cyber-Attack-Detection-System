from django.db import models

class ThreatLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    src_ip = models.GenericIPAddressField(default="127.0.0.1")
    event_type = models.CharField(max_length=100) # e.g., Neptune Attack, Normal
    severity = models.CharField(max_length=20)   # e.g., Critical, Low
    confidence = models.FloatField()
    action_taken = models.CharField(max_length=50) # e.g., Blocked, Logged

    def __str__(self):
        return f"{self.event_type} - {self.timestamp}"
from django.db import models

class BlockedIP(models.Model):
    ip_address = models.GenericIPAddressField(unique=True)
    reason = models.CharField(max_length=255, default="Critical Threat")
    blocked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ip_address