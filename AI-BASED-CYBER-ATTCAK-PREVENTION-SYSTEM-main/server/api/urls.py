from django.urls import path
from .views import (
    detect_threat,
    get_logs,
    login_view,
    logout_view,
    check_auth,
    register_view,
    get_attack_graph,
    get_stats,
    get_blocked_ips,
    unblock_ip,
    block_manual
)

urlpatterns = [
    path('detect/', detect_threat),
    path('logs/', get_logs),
    path('login/', login_view),
    path('register/', register_view),
    path('logout/', logout_view),
    path('check/', check_auth),
    path('graph/', get_attack_graph),
    path('stats/', get_stats),

    # ✅ NEW FIREWALL ROUTES
    path('blocked/', get_blocked_ips),
    path('unblock/', unblock_ip),
    path('block_manual/', block_manual),
]