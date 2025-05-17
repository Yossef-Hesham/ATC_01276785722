from django.urls import path
from .views import UserRegisterView, AdminRegisterView, CustomLoginView

urlpatterns = [
    path('register/user/', UserRegisterView.as_view(), name='user-register'),
    path('register/admin/', AdminRegisterView.as_view(), name='admin-register'),
    path('login/', CustomLoginView.as_view(), name='custom-login'),
]
# i wanna to make IS_book to True when the user book the event
