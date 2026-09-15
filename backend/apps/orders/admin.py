from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_price", "status", "payment_method", "phone", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("user__username", "phone", "delivery_address")
    inlines = [OrderItemInline]


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    inlines = [CartItemInline]
