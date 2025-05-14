from rest_framework import serializers
from .models import Event, BookedEvent
from django.core.exceptions import ValidationError


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class BookeventListSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='event.Name', read_only=True)
    event_date = serializers.DateTimeField(source='event.Date', read_only=True)
    event_price = serializers.DecimalField(source='event.Price', max_digits=10, decimal_places=2, read_only=True)
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(), write_only=True)
    

    class Meta:
        model = BookedEvent
        fields = ['event', 'booking_date', 'event_name', 'event_date', 'event_price']
        read_only_fields = ('booking_date', 'user')

    # user can book the event only once
    def validate(self, data):
        user = self.context['request'].user
        event = data.get('event')
        if BookedEvent.objects.filter(user=user, event=event).exists():
            raise serializers.ValidationError(
                "You have already booked this event."
            )
        return data

    # pull user from the request and set it to the serializer
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
  
    def update(self, instance, validated_data):
        Event.objects.filter(pk=instance.event.pk).update(IS_booked=True)
        return super().update(instance, validated_data)
    
