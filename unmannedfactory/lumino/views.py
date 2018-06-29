from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from .models import Employees
from .models import Products
from .models import Orders
from .models import OrdersDetail
import json

from .serializers import ProductsSerializer
from .serializers import OrdersSerializer
from .serializers import OrdersDetailSerializer
from rest_framework import viewsets

# Create your views here.
def index(request):
    pageTitle = "UnmannedFactory首頁"
    return render(request, "lumino/index.html", locals())
def carrobots(request):
    pageTitle = "#"
    return render(request, "lumino/carrobots.html", locals())
def members(request):
    pageTitle = "#"
    return render(request, "lumino/members.html", locals())
def products(request):
    pageTitle = "#"
    return render(request, "lumino/products.html", locals())
def orders(request):
    pageTitle = "Orders"
    orders = Orders.objects.all()
    details = OrdersDetail.objects.all()

    totalprice = 0
    costcoprice = 0
    carrefourprice = 0
    rtmartprice = 0
    for order in orders:
        totalprice += order.totalprice
        if order.customername == 'Costco':
            costcoprice += order.totalprice
        elif order.customername == 'Carrefour':
            carrefourprice += order.totalprice
        elif order.customername == 'RT-Mart':
            rtmartprice += order.totalprice

    totaltarget = 100000
    costcotarget = 50000
    carrefourtarget = 30000
    remarttarget = 20000

    total = int(totalprice / totaltarget *100)
    costco = int(costcoprice / costcotarget *100)
    carrefour = int(carrefourprice / carrefourtarget *100)
    rtmart = int(rtmartprice / remarttarget *100)

    return render(request, "lumino/orders.html", locals())
    
def login(request):
    pageTitle = "#"
    return render(request, "lumino/login.html", locals())

def getjson(request):
    pageTitle = "#"
    data = serializers.serialize("json", Employees.objects.all())
    data2= json.loads(data)
    return JsonResponse(data2, safe=False)

class ProductsViewSet(viewsets.ModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer

class OrdersViewSet(viewsets.ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer

class OrdersDetailViewSet(viewsets.ModelViewSet):
    queryset = OrdersDetail.objects.all()
    serializer_class = OrdersDetailSerializer