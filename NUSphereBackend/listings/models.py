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
    status = models.CharField(max_length=50, default="unsold")