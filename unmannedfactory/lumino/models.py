from __future__ import unicode_literals
from django.db import models

# Create your models here.
# class COMP(models.Model):
#     CompanyID = models.IntegerField(db_column='CompanyID', primary_key=True)      
#     CompanyName = models.CharField(db_column='CompanyName', max_length=20)     
#     Abbreviation = models.CharField(db_column='Abbreviation', max_length=10, blank=True, null=True)
       
#     class Meta:
#         db_table = "companies_of_tw50"

class Employees(models.Model):
    employeeid = models.AutoField(db_column='EmployeeID', primary_key=True)  # Field name made lowercase.
    lastname = models.CharField(db_column='LastName', max_length=20)  # Field name made lowercase.
    firstname = models.CharField(db_column='FirstName', max_length=10)  # Field name made lowercase.
    title = models.CharField(db_column='Title', max_length=30, blank=True, null=True)  # Field name made lowercase.
    titleofcourtesy = models.CharField(db_column='TitleOfCourtesy', max_length=25, blank=True, null=True)  # Field name made lowercase.
    birthdate = models.DateTimeField(db_column='BirthDate', blank=True, null=True)  # Field name made lowercase.
    hiredate = models.DateTimeField(db_column='HireDate', blank=True, null=True)  # Field name made lowercase.
    address = models.CharField(db_column='Address', max_length=60, blank=True, null=True)  # Field name made lowercase.
    city = models.CharField(db_column='City', max_length=15, blank=True, null=True)  # Field name made lowercase.
    region = models.CharField(db_column='Region', max_length=15, blank=True, null=True)  # Field name made lowercase.
    postalcode = models.CharField(db_column='PostalCode', max_length=10, blank=True, null=True)  # Field name made lowercase.
    country = models.CharField(db_column='Country', max_length=15, blank=True, null=True)  # Field name made lowercase.
    homephone = models.CharField(db_column='HomePhone', max_length=24, blank=True, null=True)  # Field name made lowercase.
    extension = models.CharField(db_column='Extension', max_length=4, blank=True, null=True)  # Field name made lowercase.
    photo = models.CharField(db_column='Photo', max_length=255, blank=True, null=True)  # Field name made lowercase.
    notes = models.TextField(db_column='Notes', blank=True, null=True)  # Field name made lowercase.
    reportsto = models.IntegerField(db_column='ReportsTo', blank=True, null=True)  # Field name made lowercase.
    photopath = models.CharField(db_column='PhotoPath', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'employees'

class Orders(models.Model):
    orderid = models.AutoField(db_column='OrderID', primary_key=True)  # Field name made lowercase.
    customername = models.CharField(db_column='CustomerName', max_length=45)  # Field name made lowercase.
    orderdate = models.CharField(db_column='OrderDate', max_length=45)  # Field name made lowercase.
    shippeddate = models.CharField(db_column='ShippedDate', max_length=45)  # Field name made lowercase.
    totalprice = models.IntegerField(db_column='TotalPrice')  # Field name made lowercase.
    complete = models.CharField(db_column='Complete', max_length=10)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'orders'


class OrdersDetail(models.Model):
    detailid = models.AutoField(db_column='DetailID', primary_key=True)  # Field name made lowercase.
    orderid = models.IntegerField(db_column='OrderID')  # Field name made lowercase.
    productid = models.IntegerField(db_column='ProductID')  # Field name made lowercase.
    productname = models.CharField(db_column='ProductName', max_length=45)  # Field name made lowercase.
    unitprice = models.IntegerField(db_column='UnitPrice')  # Field name made lowercase.
    quantity = models.IntegerField(db_column='Quantity')  # Field name made lowercase.
    subtotalprice = models.IntegerField(db_column='SubtotalPrice')  # Field name made lowercase.
    status = models.CharField(db_column='Status', max_length=45)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'orders_detail'


class Products(models.Model):
    productid = models.AutoField(db_column='ProductID', primary_key=True)  # Field name made lowercase.
    productname = models.CharField(db_column='ProductName', max_length=45)  # Field name made lowercase.
    unitprice = models.IntegerField(db_column='UnitPrice')  # Field name made lowercase.
    amount = models.IntegerField(db_column='Amount')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'products'