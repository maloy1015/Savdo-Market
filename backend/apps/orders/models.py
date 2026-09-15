from django.conf import settings
from django.db import models
from apps.products.models import Product


class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Savatcha #{self.id} ({self.user})"

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "product")

    @property
    def subtotal(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"


ORDER_STATUS_CHOICES = [
    ("pending", "Yangi"),
    ("processing", "Tayyorlanmoqda"),
    ("shipped", "Yetkazilmoqda"),
    ("delivered", "Yetkazildi"),
    ("cancelled", "Bekor qilingan"),
]

PAYMENT_METHOD_CHOICES = [
    ("card", "Bank kartasi"),
    ("click", "Click"),
    ("payme", "Payme"),
    ("cash", "Naqd to'lov"),
]


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default="pending")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default="cash")
    delivery_address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Buyurtma"
        verbose_name_plural = "Buyurtmalar"

    def __str__(self):
        return f"Buyurtma #{self.id} - {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=12, decimal_places=2, help_text="Buyurtma vaqtidagi narx")

    def __str__(self):
        return f"{self.product} x{self.quantity}"
