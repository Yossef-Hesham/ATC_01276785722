from django.urls import path
from .views import (
    Filter_by_cat, EventListView
)

urlpatterns = [

    path('filter/<int:pk>/', Filter_by_cat.as_view(),name='filter-list-by-category'),
    path('create/', EventListView.as_view(), name='event-list'),
    
]