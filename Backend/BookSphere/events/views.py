from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination
from .models import Event, BookedEvent
from .serializers import EventSerializer, BookeventListSerializer



# Create your views here.


class Update_Delete_Event_View(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    permission_classes = [permissions.IsAdminUser]  
    



class Create_Read_Event_View(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = PageNumberPagination
    


class BookedEventListView(generics.ListCreateAPIView):
    queryset = BookedEvent.objects.all() 
    serializer_class = BookeventListSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination
    

    def get_queryset(self):
        # Only show bookings for the current user
        return BookedEvent.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # The user is automatically set in the serializer's create()
        serializer.save()
    
    
   
    