from django.urls import path
from .views import (
    UserRegistrationView,
    AdminRegistrationView,
    CustomLoginView, 
)

urlpatterns = [
    path('user/register/', UserRegistrationView.as_view(), name='user-register'),
    path('admin/register/', AdminRegistrationView.as_view(), name='admin-register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    ]