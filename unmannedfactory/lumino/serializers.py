from rest_framework import serializers
import lumino.models as models
# from .models import Products
# from .models import Orders
# from .models import OrdersDetail
# from lumino.models import Drivelesscar


class DrivelesscarSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Drivelesscar
        fields = '__all__'
        
class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Products
        # fields = '__all__'
        fields = ('productid', 'productname', 'amount', 'shelves', 'flavor', 'size', 'unitprice')

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Orders
        # fields = '__all__'
        fields = ('orderid', 'customername', 'orderdate', 'shippeddate', 'totalprice', 'status')


class OrdersDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrdersDetail
        # fields = '__all__'
        fields = ('detailid', 'orderid', 'productid', 'productname', 'unitprice', 'quantity', 'subtotalprice', 'status')

class EmployeesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Employees
        fields = '__all__'

class EmployeestaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Employeestask
        fields = '__all__'