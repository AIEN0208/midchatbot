from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers as asserializersForORM
from rest_framework import viewsets

import json

import lumino.models as models
from .models import Products
from .models import Orders
from .models import OrdersDetail
# from lumino.models import Drivelesscar
from lumino.models import Drivelesscar as dr

import lumino.serializers as serializers
# from lumino.serializers import DrivelesscarSerializer
# from .serializers import ProductsSerializer
# from .serializers import OrdersSerializer
# from .serializers import OrdersDetailSerializer

class ProductsViewSet(viewsets.ModelViewSet):
    queryset = models.Products.objects.all()
    serializer_class = serializers.ProductsSerializer

class OrdersViewSet(viewsets.ModelViewSet):
    queryset = models.Orders.objects.all()
    serializer_class = serializers.OrdersSerializer

class OrdersDetailViewSet(viewsets.ModelViewSet):
    queryset = models.OrdersDetail.objects.all()
    serializer_class = serializers.OrdersDetailSerializer

class DrivelesscarViewSet(viewsets.ModelViewSet):
    queryset = models.Drivelesscar.objects.all()
    serializer_class = serializers.DrivelesscarSerializer

class EmployeesViewSet(viewsets.ModelViewSet):
    queryset = models.Employees.objects.all()
    serializer_class = serializers.EmployeesSerializer

class EmployeestaskViewSet(viewsets.ModelViewSet):
    queryset = models.Employeestask.objects.all()
    serializer_class = serializers.EmployeestaskSerializer

# Create your views here.
def index(request):
    pageTitle = "UnmannedFactory首頁"
    return render(request, "lumino/index.html", locals())
def carrobots(request):
    pageTitle = "#"
    drs = dr()
    data = drs.all()
    return render(request, "lumino/carrobots.html", locals())
def members(request):
    pageTitle = "#"
    jobset={}
    authority=2
    employees= models.Employees.objects.filter(reportsto=authority)
    
    for employee in employees:
        tasks= models.Employeestask.objects.filter(employeeid=employee.employeeid)
        jobs= []

        for task in tasks:
            if(task.job):
                jobs.append(task.job)

        jobset['{}'.format(employee.employeeid)]= jobs

    rows= zip([employee for employee in employees],[value for key,value in jobset.items()])
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
        if order.status != 'Canceled':
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
    def percentage(p):
        if p > 100:
            return 100
        else:
            return p
    total = percentage(int(totalprice / totaltarget *100))
    costco = percentage(int(costcoprice / costcotarget *100))
    carrefour = percentage(int(carrefourprice / carrefourtarget *100))
    rtmart = percentage(int(rtmartprice / remarttarget *100))
    
    return render(request, "lumino/orders.html", locals())
    
def login(request):
    pageTitle = "#"
    return render(request, "lumino/login.html", locals())

def getjson(request):
    pageTitle = "#"
    data = serializers.serialize("json", Employees.objects.all())
    data2= json.loads(data)
    return JsonResponse(data2, safe=False)

# product
from django.views.decorators.csrf import csrf_exempt
from .models import Products
@csrf_exempt
def getProduct(request):
    pageTitle="#"
    if (request.method == "GET"):
        data = asserializersForORM.serialize("json", Products.objects.all())
        allDatasOfProduct= json.loads(data)
        return JsonResponse(allDatasOfProduct, safe=False)
    elif request.method == "POST":
        productname=request.POST.get('name')
        amount=request.POST.get('amount')
        shelves=request.POST.get('shelves')
        flavor=request.POST.get('flavor')
        size=request.POST.get('size')
        unitprice=request.POST.get('unitprice')
        
        Ans=[data for data in Products.objects.values_list('productid',flat=True)]
        Ans=(len(Ans)+1)
        unit=Products(productid=Ans,productname=productname,amount=amount,shelves=shelves,flavor=flavor,size=size,unitprice=unitprice)
        unit.save()
        print(unit)
        a={'messages':'succesee'} 
        dump = json.dumps(a)   
        return JsonResponse(dump,safe=False)
@csrf_exempt
def productUpdate(request):
    pageTitle="#"
    if request.method == "POST": 
        print(request.POST.get)    
        productid=request.POST.get('id')
        productname=request.POST.get('name')
        amount=request.POST.get('amount')
        shelves=request.POST.get('shelves')
        flavor=request.POST.get('flavor')
        size=request.POST.get('size')
        unitprice=request.POST.get('unitprice')

        unit=Products(productid=productid,productname=productname,amount=amount,shelves=shelves,flavor=flavor,size=size,unitprice=unitprice)
        unit.save()
        print(unit)
        a={'messages':'succesee'} 
        dump = json.dumps(a)   
        return JsonResponse(dump,safe=False)
        
    