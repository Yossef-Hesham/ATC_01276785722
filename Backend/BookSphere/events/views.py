from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters
from rest_framework import permissions
from .models import Event, BookedEvent
from .serializers import EventSerializer, BookeventListSerializer
# Create your views here.


class Update_Delete_View(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.order_by('pk')
    permission_classes = [permissions.IsAdminUser]  

    # filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['category']  
    # search_fields = ['Name', 'Description']


class Create_Read_View(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAdminUser]


class BookedEventListView(generics.ListCreateAPIView):
    queryset = BookedEvent.objects.all()
    serializer_class = BookeventListSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access this view
    
    
    
    def save(self, *args, **kwargs):
        # Set is_booked to True when booking is created
        self.event.is_booked = True
        self.event.save()
        super().save(*args, **kwargs)

    # def delete(self, *args, **kwargs):
    #     # Set is_booked to False when booking is deleted
    #     self.event.is_booked = False
    #     self.event.save()
    #     super().delete(*args, **kwargs)
    
    
   
    