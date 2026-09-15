from rest_framework import serializers
from .models import Favorite
from apps.products.serializers import ProductListSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source="product", read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "product", "product_detail", "created_at"]
        read_only_fields = ["user"]

    def validate(self, attrs):
        request = self.context["request"]
        if Favorite.objects.filter(user=request.user, product=attrs["product"]).exists():
            raise serializers.ValidationError("Bu mahsulot allaqachon sevimlilarda.")
        return attrs
