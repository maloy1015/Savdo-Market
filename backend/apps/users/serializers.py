from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Address


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(source="username", required=True)

    class Meta:
        model = User
        fields = ["first_name", "email", "phone", "password", "password_confirm"]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Parollar mos emas."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField(help_text="email yoki telefon")
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = User.objects.filter(
            Q(email=attrs["login"]) | Q(phone=attrs["login"])
        ).first()
        if not user or not user.check_password(attrs["password"]):
            raise serializers.ValidationError("Login yoki parol noto'g'ri.")
        attrs["user"] = user
        return attrs

    def get_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}


class UserSerializer(serializers.ModelSerializer):
    """O'z profilini ko'rish/tahrirlash uchun — is_staff/is_active o'zgartirib bo'lmaydi."""
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "avatar", "is_staff", "is_active", "date_joined"]
        read_only_fields = ["id", "is_staff", "is_active", "date_joined"]


class AdminUserSerializer(serializers.ModelSerializer):
    """Faqat admin uchun: boshqa userlarni boshqarish (is_staff/is_active o'zgartirish mumkin)."""
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "avatar", "is_staff", "is_active", "date_joined"]
        read_only_fields = ["id", "date_joined"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "region", "city", "district", "address", "latitude", "longitude", "is_default"]
        read_only_fields = ["user"]
