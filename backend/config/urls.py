from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import RegisterView, LoginView, ProfileView, ProfileImageUploadView, AddressViewSet, AdminUserViewSet
from apps.categories.views import CategoryViewSet
from apps.products.views import ProductViewSet, BannerViewSet, ReviewViewSet
from apps.orders.views import CartView, CartItemView, OrderViewSet
from apps.favorites.views import FavoriteViewSet
from apps.analytics.views import DashboardStatsView

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"products", ProductViewSet, basename="product")
router.register(r"banners", BannerViewSet, basename="banner")
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"orders", OrderViewSet, basename="order")
router.register(r"favorites", FavoriteViewSet, basename="favorite")
router.register(r"addresses", AddressViewSet, basename="address")
router.register(r"admin/users", AdminUserViewSet, basename="admin-user")

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/register/", RegisterView.as_view(), name="auth-register"),
    path("api/auth/login/", LoginView.as_view(), name="auth-login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="auth-refresh"),

    path("api/users/profile/", ProfileView.as_view(), name="user-profile"),
    path("api/users/profile/image/", ProfileImageUploadView.as_view(), name="user-profile-image"),

    path("api/cart/", CartView.as_view(), name="cart"),
    path("api/cart/items/<int:pk>/", CartItemView.as_view(), name="cart-item"),

    path("api/dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),

    path("api/", include(router.urls)),
]

# Media fayllarni har doim xizmat qilish (Render uchun ham)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)