from rest_framework import serializers
from .models import Products
from .models import Orders
from .models import OrdersDetail
from lumino.models import Drivelesscar


class DrivelesscarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drivelesscar
        fields = '__all__'
        
class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        # fields = '__all__'
        fields = ('productid', 'productname', 'unitprice', 'amount')

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        # fields = '__all__'
        fields = ('orderid', 'customername', 'orderdate', 'shippeddate', 'totalprice', 'complete')


class OrdersDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdersDetail
        # fields = '__all__'
        fields = ('detailid', 'orderid', 'productid', 'productname', 'unitprice', 'quantity', 'subtotalprice', 'status')