# backend/config/admin.py
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.sessions.models import Session
from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType

# Django'ning keraksiz modellarini admin panelda ko'rsatmaslik
try:
    admin.site.unregister(Group)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(Session)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(LogEntry)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(ContentType)
except admin.sites.NotRegistered:
    pass

# Agar simplejwt token blacklist ishlatilsa:
try:
    from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
    admin.site.unregister(OutstandingToken)
    admin.site.unregister(BlacklistedToken)
except (ImportError, admin.sites.NotRegistered):
    pass


# Admin panel sarlavhalari
admin.site.site_header = "Savdo Market — Boshqaruv paneli"
admin.site.site_title = "Savdo Market Admin"
admin.site.index_title = "Boshqaruv paneliga xush kelibsiz"