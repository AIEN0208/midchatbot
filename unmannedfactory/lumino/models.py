from __future__ import unicode_literals
from django.db import models
from django.db import connection

class Drivelesscar(models.Model):
    id = models.IntegerField(primary_key=True)
    carid = models.CharField(max_length=45)
    status = models.CharField(max_length=45)
    battery = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'drivelesscar'

    def all(self):
        with connection.cursor() as cursor:
            cursor.execute("select * from drivelesscar")
            datas = cursor.fetchall()
        return datas

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

class Employees(models.Model):
    employeeid = models.AutoField(db_column='EmployeeID', primary_key=True)
# Field name made lowercase.
    lastname = models.CharField(db_column='LastName', max_length=20)  # Field name made lowercase.
    firstname = models.CharField(db_column='FirstName', max_length=10)  # Field name made lowercase.
    title = models.CharField(db_column='Title', max_length=30, blank=True, null=True)  # Field name made lowercase.
    titleofcourtesy = models.CharField(db_column='TitleOfCourtesy', max_length=25, blank=True, null=True)  # Field name made lowercase.
    birthdate = models.DateTimeField(db_column='BirthDate', blank=True, null=True)  # Field name made lowercase.
    hiredate = models.DateTimeField(db_column='HireDate', blank=True, null=True)  # Field name made lowercase.
    address = models.CharField(db_column='Address', max_length=60, blank=True, null=True)  # Field name made lowercase.
    city = models.CharField(db_column='City', max_length=15, blank=True, null=True)  # Field name made lowercase.
    region = models.CharField(db_column='Region', max_length=15, blank=True,
null=True)  # Field name made lowercase.
    postalcode = models.CharField(db_column='PostalCode', max_length=10, blank=True, null=True)  # Field name made lowercase.
    country = models.CharField(db_column='Country', max_length=15, blank=True, null=True)  # Field name made lowercase.
    homephone = models.CharField(db_column='HomePhone', max_length=24, blank=True, null=True)  # Field name made lowercase.
    extension = models.CharField(db_column='Extension', max_length=4, blank=True, null=True)  # Field name made lowercase.
    photo = models.CharField(db_column='Photo', max_length=255, blank=True, null=True)  # Field name made lowercase.
    notes = models.TextField(db_column='Notes', blank=True, null=True)  # Field name made lowercase.
    reportsto = models.IntegerField(db_column='ReportsTo', blank=True, null=True)  # Field name made lowercase.
    photopath = models.CharField(db_column='PhotoPath', max_length=255, blank=True, null=True)  # Field name made lowercase.
    department = models.CharField(db_column='Department', max_length=45, blank=True, null=True)  # Field name made lowercase.
    position = models.CharField(db_column='Position', max_length=45, blank=True, null=True)  # Field name made lowercase.
    email = models.CharField(db_column='Email', max_length=45, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'employees'

class Employeestask(models.Model):
    employeeid = models.IntegerField()
    job = models.CharField(max_length=200, blank=True, null=True)
    dailyreport = models.CharField(max_length=200, blank=True, null=True)
    notes = models.CharField(max_length=200, blank=True, null=True)
    enduptime = models.DateTimeField(blank=True, null=True)
    employeestaskcol = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'employeestask'

class Department(models.Model):
    id = models.CharField(primary_key=True, max_length=45)
    name = models.CharField(max_length=45)
    group = models.CharField(max_length=45)
    mainproject = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'department'