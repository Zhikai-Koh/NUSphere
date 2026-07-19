from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from shop.models import Shop, ShopProduct


class SellerAnalyticsIntegrationTest(APITestCase):

    def test_authenticated_seller_can_view_their_analytics(self):
        seller = User.objects.create_user(
            username="seller",
            password="safe-test-password",
        )
        shop = Shop.objects.create(
            owner=seller,
            store_name="Test Store",
            is_open=True,
        )
        ShopProduct.objects.create(
            shop=shop,
            item_name="Test Notebook",
            item_price="5.00",
            item_quantity=2,
        )

        self.client.force_authenticate(user=seller)
        response = self.client.get(reverse("seller-analytics"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["summary"]["stores"], 1)
        self.assertEqual(response.data["summary"]["open_stores"], 1)
        self.assertEqual(response.data["inventory"]["store_stock"], 2)
        self.assertEqual(response.data["low_stock"][0]["item_name"], "Test Notebook")
