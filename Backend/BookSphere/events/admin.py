from django.contrib import admin

# Register your models here.
from .models import Event, BookedEvent

admin.site.register(Event)
admin.site.register(BookedEvent)
