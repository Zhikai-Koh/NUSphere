from django.db import models
from django.contrib.auth.models import User
from listings.models import Categories

class Shop(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='shop')
    store_name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Categories, on_delete=models.SET_NULL, null=True, blank=True)
    is_open = models.BooleanField(default=False)
    store_image = models.ImageField(upload_to='store_image/', null=True, blank=True)


class ShopProduct(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='products')

    item_name = models.CharField(max_length=255)
    item_price = models.DecimalField(max_digits=10, decimal_places=2)
    item_description = models.TextField(blank=True, null=True)
    item_image = models.ImageField(upload_to='store_products/', null=True, blank=True)
    item_quantity = models.PositiveIntegerField(default=1)

    is_active = models.BooleanField(default=True)

    
class ShopOrder(models.Model):
    product = models.ForeignKey(ShopProduct, on_delete=models.PROTECT, related_name="shop_orders")
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shop_purchases")
    
    quantity = models.PositiveIntegerField(default=1)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchased_at = models.DateTimeField(auto_now_add=True)
    
    order_status = models.CharField(max_length=50, default='pending')
