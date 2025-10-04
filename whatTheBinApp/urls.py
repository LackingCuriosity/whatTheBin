from django.urls import path
from . import views
# Create your views here.

urlpatterns = [
    path("", views.home, name="home"),
    path("api", views.api, name="api")
]
