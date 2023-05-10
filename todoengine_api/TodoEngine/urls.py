from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from TodoEngine.backend import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'tasks', views.TaskViewSet)

urlpatterns = [
    path('superAdmin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', views.login),
    path('api/register/', views.register),
    # path('api/login', include('rest_framework.urls', namespace='rest_framework')),
]
