from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem, Order
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, AdminOrderSerializer
from apps.products.models import Product


class CartView(APIView):
    """GET/POST/PUT/DELETE /api/cart/"""
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_cart(request.user)
        return Response(CartSerializer(cart).data)

    def post(self, request):
        """Body: {product: id, quantity: 1} -> mahsulot qo'shish yoki miqdorni oshirish"""
        cart = self.get_cart(request.user)
        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))
        product = Product.objects.get(pk=product_id)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"quantity": quantity})
        if not created:
            item.quantity += quantity
            item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def put(self, request):
        """Body: {item_id: id, quantity: N}"""
        cart = self.get_cart(request.user)
        item = cart.items.get(pk=request.data.get("item_id"))
        item.quantity = max(int(request.data.get("quantity", 1)), 1)
        item.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart = self.get_cart(request.user)
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartItemView(APIView):
    """DELETE /api/cart/items/{id}/"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        cart = self.request.user.cart
        cart.items.filter(pk=pk).delete()
        return Response(CartSerializer(cart).data)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return AdminOrderSerializer
        return OrderSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        return {"request": self.request}
