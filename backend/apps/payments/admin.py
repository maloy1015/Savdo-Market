from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "method", "amount", "status", "transaction_id", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "method")
