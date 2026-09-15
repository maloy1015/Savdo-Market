from django.contrib import admin
from django.utils.html import format_html
from .models import Product, ProductImage, Review, Banner


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "image_preview", "name", "category", "price", "old_price",
                     "discount", "stock", "rating", "is_active", "is_featured", "created_at")
    list_editable = ("price", "old_price", "stock", "is_active", "is_featured")
    list_filter = ("category", "brand", "is_active", "is_featured", "is_new", "is_deal_of_day")
    search_fields = ("name", "brand", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]

    def image_preview(self, obj):
        if obj.main_image:
            return format_html('<img src="{}" style="height:40px;border-radius:6px;" />', obj.main_image.url)
        return "-"
    image_preview.short_description = "Rasm"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("product__name", "user__username", "comment")


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("id", "image_preview", "title", "active", "order", "created_at")
    list_editable = ("active", "order")

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;border-radius:6px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Rasm"
