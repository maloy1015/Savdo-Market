from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nomi")
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon nomi (masalan: smartphone)")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
