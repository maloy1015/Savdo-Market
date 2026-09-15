from django.db import models
from apps.orders.models import Order

PAYMENT_STATUS_CHOICES = [
    ("pending", "Kutilmoqda"),
    ("paid", "To'landi"),
    ("failed", "Xato"),
    ("refunded", "Qaytarildi"),
]


class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    method = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment #{self.id} - {self.order}"
