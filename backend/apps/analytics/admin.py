from django.contrib import admin
from .models import Visit


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = ("id", "session_key", "path", "user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("path", "session_key")
