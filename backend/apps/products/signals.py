from django.db.models import Avg, Count
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Review


def _recalculate(product):
    agg = product.reviews.aggregate(avg=Avg("rating"), count=Count("id"))
    product.rating = round(agg["avg"] or 0, 2)
    product.review_count = agg["count"] or 0
    product.save(update_fields=["rating", "review_count"])


@receiver(post_save, sender=Review)
def review_saved(sender, instance, **kwargs):
    _recalculate(instance.product)


@receiver(post_delete, sender=Review)
def review_deleted(sender, instance, **kwargs):
    _recalculate(instance.product)
