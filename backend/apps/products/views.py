from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Review, Banner
from .serializers import ProductListSerializer, ProductDetailSerializer, ReviewSerializer, BannerSerializer
from .filters import ProductFilter


class ProductViewSet(viewsets.ModelViewSet):
    """
    GET  /api/products/?search=iphone&category=telefonlar&min_price=100000&max_price=5000000
                        &min_rating=4&brand=Apple&has_discount=true&ordering=-created_at
    ordering options: price, -price, -created_at, -rating (mashhur), -review_count
    """
    queryset = Product.objects.filter(is_active=True)
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "description", "brand"]
    ordering_fields = ["price", "created_at", "rating", "review_count", "discount"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_serializer_context(self):
        return {"request": self.request}


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        product_id = self.request.query_params.get("product")
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(active=True)
    serializer_class = BannerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
