import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug", lookup_expr="exact")
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    min_rating = django_filters.NumberFilter(field_name="rating", lookup_expr="gte")
    brand = django_filters.CharFilter(field_name="brand", lookup_expr="iexact")
    has_discount = django_filters.BooleanFilter(method="filter_has_discount")

    class Meta:
        model = Product
        fields = ["category", "brand"]

    def filter_has_discount(self, queryset, name, value):
        if value:
            return queryset.filter(discount__gt=0)
        return queryset
