from django.db import models
from django.utils.text import slugify
from django.conf import settings
from apps.categories.models import Category


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=255, verbose_name="Nomi")
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Tavsif")
    specs = models.JSONField(default=dict, blank=True, help_text='{"Ekran": "6.1 inch", "RAM": "8GB"}')

    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Yangi narx")
    old_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Eski narx")
    discount = models.PositiveIntegerField(default=0, verbose_name="Chegirma %")

    stock = models.PositiveIntegerField(default=0, verbose_name="Qoldiq")
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)

    brand = models.CharField(max_length=100, blank=True)
    main_image = models.ImageField(upload_to="products/", null=True, blank=True)

    is_featured = models.BooleanField(default=False, verbose_name="Mashhur")
    is_new = models.BooleanField(default=False, verbose_name="Yangi")
    is_deal_of_day = models.BooleanField(default=False, verbose_name="Kun mahsuloti")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Mahsulot"
        verbose_name_plural = "Mahsulotlar"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            i = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{i}"
                i += 1
            self.slug = slug
        if self.old_price and self.old_price > 0:
            self.discount = int(round((1 - (self.price / self.old_price)) * 100))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/gallery/")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.name} - rasm {self.id}"


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user} -> {self.product} ({self.rating})"


class Banner(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="banners/")
    link = models.CharField(max_length=255, blank=True)
    active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title
