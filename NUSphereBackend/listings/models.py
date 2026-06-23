from django.db import models
from django.contrib.auth.models import User

class Categories(models.Model):
    name = models.CharField(max_length=255, default="")
    
    def __str__(self):
        return self.name

class Listing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=255, default="", null=False, blank=False)
    item_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=False, blank=False)
    item_quantity = models.PositiveIntegerField(default=0, null=False, blank=False)
    item_description = models.TextField(default="", null=True, blank=True)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='listings/', null=True, blank=True)

class ListingItem(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="listing_item")
    status = models.CharField(max_length=50, default="unsold")

class Order(models.Model):
    listingItem = models.ForeignKey(ListingItem, on_delete=models.PROTECT, related_name="order_details")
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="purchases")
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchased_at = models.DateTimeField(auto_now_add=True);
    order_status = models.CharField(max_length=50, default = "pending seller confirmation")