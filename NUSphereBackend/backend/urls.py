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
from cart.views import CartAPIView
from django.conf.urls.static import static
from listings.views import AddListingView
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
