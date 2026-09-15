from django.db import models
from django.conf import settings


class Visit(models.Model):
    """Anonim tashrif — faqat session_key saqlanadi, IP/shaxsiy ma'lumot saqlanmaydi (privacy)."""
    session_key = models.CharField(max_length=64, db_index=True)
    path = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["created_at"])]

    def __str__(self):
        return f"{self.path} - {self.created_at}"
