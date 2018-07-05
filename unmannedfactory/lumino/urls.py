from django.urls import path
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from . import views

app_name = "lumino"

router = DefaultRouter()
router.register(r'products', views.ProductsViewSet)
router.register(r'orders', views.OrdersViewSet)
router.register(r'ordersdetail', views.OrdersDetailViewSet)
router.register(r'employees', views.EmployeesViewSet)
router.register(r'employeestask', views.EmployeestaskViewSet)

urlpatterns = [
    path('', views.index, name="index"),
    path('carrobots/', views.carrobots, name="carrobots"),
    path('members/', views.members, name="members"),
    path('products/', views.products, name="products"),
    path('orders/', views.orders, name="orders"),
    path('login/', views.login, name="login"),
    path('api/v1/group/', views.getjson, name="getjson"),
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(router.urls)),
    path('api/v1/products',views.getProduct,name="getProduct"),
    path('api/v1/products/update',views.productUpdate,name="productUpdate"),
]
