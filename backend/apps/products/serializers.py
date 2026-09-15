from rest_framework import serializers
from .models import Product, ProductImage, Review, Banner
from apps.categories.serializers import CategorySerializer


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "order"]


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    user_avatar = serializers.ImageField(source="user.avatar", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "user", "user_name", "user_avatar", "product", "rating", "comment", "created_at"]
        read_only_fields = ["user"]


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "category", "category_name", "price", "old_price",
            "discount", "stock", "rating", "review_count", "brand", "main_image",
            "is_featured", "is_new", "is_deal_of_day", "is_favorited", "created_at",
        ]

    def get_is_favorited(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if user and user.is_authenticated:
            return obj.favorited_by.filter(user=user).exists()
        return False


class ProductDetailSerializer(ProductListSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ["description", "specs", "images", "reviews"]


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ["id", "title", "subtitle", "image", "link", "active", "order"]
