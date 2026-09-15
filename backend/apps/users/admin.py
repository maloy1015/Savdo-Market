from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("id", "username", "email", "phone", "is_staff", "is_online", "date_joined")
    list_filter = ("is_staff", "is_active", "is_online")
    search_fields = ("username", "email", "phone")
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Qo'shimcha", {"fields": ("phone", "avatar", "is_online", "last_seen")}),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "region", "city", "district", "is_default", "created_at")
    search_fields = ("user__username", "region", "city")
    list_filter = ("region", "is_default")
