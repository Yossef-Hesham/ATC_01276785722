from django.urls import path
from .views import (
    Update_Delete_View, Create_Read_View, BookedEventListView
)

urlpatterns = [

    path('filter/<int:pk>/', Update_Delete_View.as_view(),name='filter-list-by-category'),
    path('create/', Create_Read_View.as_view(), name='event-list'),
    path('book/<int:pk>', BookedEventListView.as_view(), name='event-list'),
]