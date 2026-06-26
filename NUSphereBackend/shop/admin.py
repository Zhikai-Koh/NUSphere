from django.contrib import admin
from .models import Shop, ShopOrder, ShopProduct

# Register your models here.
admin.site.register(Shop)
admin.site.register(ShopOrder)
admin.site.register(ShopProduct)