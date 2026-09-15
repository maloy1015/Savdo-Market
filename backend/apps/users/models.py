from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user: login email yoki telefon orqali bo'lishi mumkin."""
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username or self.email


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    region = models.CharField(max_length=100, verbose_name="Viloyat")
    city = models.CharField(max_length=100, verbose_name="Shahar")
    district = models.CharField(max_length=100, verbose_name="Tuman")
    address = models.CharField(max_length=255, verbose_name="Manzil")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.region}, {self.city}, {self.district}"
