from rest_framework import serializers
from django.db import transaction
from .models import Cart, CartItem, Order, OrderItem
from apps.products.serializers import ProductListSerializer
from apps.products.models import Product


class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source="product", read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_detail", "quantity", "subtotal"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "total_price"]


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.ImageField(source="product.main_image", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "product_image", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "user", "total_price", "status", "payment_method",
                  "delivery_address", "phone", "latitude", "longitude", "items", "created_at"]
        read_only_fields = ["user", "total_price", "status"]

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        user = request.user
        cart = getattr(user, "cart", None)
        if not cart or not cart.items.exists():
            raise serializers.ValidationError("Savatcha bo'sh.")

        total = cart.total_price
        order = Order.objects.create(user=user, total_price=total, **validated_data)

        for item in cart.items.select_related("product"):
            OrderItem.objects.create(
                order=order, product=item.product,
                quantity=item.quantity, price=item.product.price,
            )
            item.product.stock = max(item.product.stock - item.quantity, 0)
            item.product.save(update_fields=["stock"])

        cart.items.all().delete()
        return order


class AdminOrderSerializer(OrderSerializer):
    """Admin uchun: status maydonini o'zgartirish mumkin."""
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + ["user_name"]
        read_only_fields = ["user", "total_price"]
