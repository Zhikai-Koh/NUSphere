"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from backend import settings

from listings.views import AddListingView
from listings.orderhistory.views import OrderHistoryView
from listings.personal.views import PersonalListingView
from listings.confirmsold.views import ConfirmSoldView
from listings.checkout.views import CheckOutView

from shop.views import AddStoreView
from shop.personalStores.views import PersonalStoresView
from shop.storeItems.views import StoreItemView
from shop.othersStores.views import OthersStoreItemView
from shop.checkout.views import StoreCheckOutView
from shop.confirmsold.views import StoreConfirmSoldView

from cart.views import CartAPIView
from django.conf.urls.static import static

from login.views import LogoutView
from login.views import ProfileView
from login.views import RegisterView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/cart/', CartAPIView.as_view(), name='cart-detail'),

    path('api/listings/', AddListingView.as_view(), name='add-listing'),
    path('api/listings/personal/', PersonalListingView.as_view(), name='personal-listing'),
    path('api/listings/checkout/', CheckOutView.as_view(), name='check-out'),
    path('api/listings/confirmsold/', ConfirmSoldView.as_view(), name='confirm-sold'),
    path('api/listings/orderhistory/', OrderHistoryView.as_view(), name='order-history'),

    path('api/store/', AddStoreView.as_view(), name='add-store'),
    path('api/store/personal/', PersonalStoresView.as_view(), name='personal-stores'),
    path('api/store/storeitems/<int:store_id>', StoreItemView.as_view(), name='store-items'),
    path('api/store/otherstoreitems/<int:store_id>', OthersStoreItemView.as_view(), name='other-store-items'),
    path('api/store/checkout/', StoreCheckOutView.as_view(), name='store-checkout'),
    path('api/store/orders/', StoreConfirmSoldView.as_view(), name='all-store-orders'),
    path('api/store/orders/<int:store_id>', StoreConfirmSoldView.as_view(), name='store-orders'),

    # The registration route, React will POST user details here to create a new account
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    # The login route, React will POST credentials here to get a token
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # The refresh route, Used to renew expired access tokens
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # The logout route, React will POST the refresh token here to blacklist it
    path('api/auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('api/auth/profile/', ProfileView.as_view(), name='auth_profile')

]

#Dis is for security reasons so when i deploy i wont be using local files :D
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
