from rest_framework import generics, permissions, viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Address, User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, AddressSerializer, AdminUserSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = serializer.get_tokens(user)
        return Response({"user": UserSerializer(user).data, **tokens})


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ProfileImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        user.avatar = request.FILES.get("avatar")
        user.save(update_fields=["avatar"])
        return Response(UserSerializer(user).data)


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminUserViewSet(viewsets.ModelViewSet):
    """Admin uchun foydalanuvchilarni boshqarish: /api/admin/users/"""
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ["get", "patch", "delete", "head", "options"]
    filter_backends = [filters.SearchFilter]
    search_fields = ["username", "email", "phone"]

    @action(detail=True, methods=["patch"])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save(update_fields=["is_active"])
        return Response(AdminUserSerializer(user).data)

    @action(detail=True, methods=["patch"])
    def toggle_staff(self, request, pk=None):
        user = self.get_object()
        user.is_staff = not user.is_staff
        user.save(update_fields=["is_staff"])
        return Response(AdminUserSerializer(user).data)
