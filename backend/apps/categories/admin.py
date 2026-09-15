from django.contrib import admin
from django.utils.html import format_html
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "image_preview", "name", "slug", "order", "is_active", "created_at")
    list_editable = ("order", "is_active")
    search_fields = ("name", "slug")
    list_filter = ("is_active",)
    prepopulated_fields = {"slug": ("name",)}

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;border-radius:6px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Rasm"
