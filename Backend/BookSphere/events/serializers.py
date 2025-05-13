from rest_framework import serializers
from .models import Event, BookedEvent



class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        
class BookeventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookedEvent
        fields = '__all__'
        
        
    def create(self, validated_data):
        """Automatically set the current user when creating a booking"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    
