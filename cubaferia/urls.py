"""Cubaferia URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework import routers

from cubaferia import settings
from rest.admin import ObjectDetailsView
from rest.views.AnnouncementViewSet import AnnouncementViewSet
from rest.views.EventViewSet import EventViewSet
from rest.views.NomenclatureViewSet import NomenclatureViewSet

router = routers.DefaultRouter()
router.register(r'announcement', AnnouncementViewSet)
router.register(r'event', EventViewSet)
router.register(r'nomenclature', NomenclatureViewSet)

urlpatterns = [
    path('admin/details/<str:model_name>/<int:pk>', ObjectDetailsView.as_view(), name='object_details'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
