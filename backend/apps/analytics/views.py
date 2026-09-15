from django.utils import timezone
from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from .models import Visit
from apps.users.models import User
from apps.products.models import Product
from apps.orders.models import Order


class DashboardStatsView(APIView):
    """GET /api/dashboard/stats/ -> admin dashboard uchun statistika"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = timezone.now().date()

        total_users = User.objects.count()
        today_users = User.objects.filter(date_joined__date=today).count()
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        today_orders = Order.objects.filter(created_at__date=today).count()

        total_sales = Order.objects.exclude(status="cancelled").aggregate(s=Sum("total_price"))["s"] or 0
        today_sales = Order.objects.filter(created_at__date=today).exclude(status="cancelled") \
            .aggregate(s=Sum("total_price"))["s"] or 0

        online_users = User.objects.filter(is_online=True).count()

        top_products = list(
            Product.objects.order_by("-review_count")[:5].values("id", "name", "review_count", "rating")
        )
        top_categories = list(
            Product.objects.values("category__name")
            .annotate(count=Count("id")).order_by("-count")[:5]
        )

        order_status_breakdown = list(
            Order.objects.values("status").annotate(count=Count("id"))
        )

        total_visitors = Visit.objects.count()
        unique_visitors = Visit.objects.values("session_key").distinct().count()
        conversion_rate = round((total_orders / unique_visitors * 100), 2) if unique_visitors else 0

        return Response({
            "total_users": total_users,
            "today_users": today_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "today_orders": today_orders,
            "total_sales": total_sales,
            "today_sales": today_sales,
            "online_users": online_users,
            "top_products": top_products,
            "top_categories": top_categories,
            "order_status_breakdown": order_status_breakdown,
            "total_visitors": total_visitors,
            "unique_visitors": unique_visitors,
            "conversion_rate": conversion_rate,
        })
