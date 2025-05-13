from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters
from rest_framework import permissions
from .models import Event
from .serializers import EventSerializer
# Create your views here.


class Filter_by_cat(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.order_by('pk')
    # permission_classes = [permissions.IsAdminUser]  

    # filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['category']  
    # search_fields = ['Name', 'Description']

    
    
class EventListView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    # permission_classes = [permissions.IsAdminUser]

   
    