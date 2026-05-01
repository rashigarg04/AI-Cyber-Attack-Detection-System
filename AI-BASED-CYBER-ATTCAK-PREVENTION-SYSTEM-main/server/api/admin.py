

# Register your models here.
from django.contrib import admin
from .models import ThreatLog

@admin.register(ThreatLog)
class ThreatLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'event_type', 'severity', 'action_taken', 'confidence')
    list_filter = ('severity', 'action_taken')