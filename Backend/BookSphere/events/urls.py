from django.urls import path
from .views import (
    Update_Delete_Event_View, Create_Read_Event_View, BookedEventListView
)

urlpatterns = [

    path('udateORdelete/<int:pk>/', Update_Delete_Event_View.as_view(),name='filter-list-by-category'),
    path('createORread/', Create_Read_Event_View.as_view(), name='event-list'),
    path('book/', BookedEventListView.as_view(), name='event-list'),
]