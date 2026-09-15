from rest_framework import viewsets, permissions
from .models import Category
from .serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    GET  /api/categories/        -> list
    POST /api/categories/        -> create (admin)
    GET  /api/categories/{id}/   -> retrieve
    GET  /api/categories/?slug=telefonlar
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
