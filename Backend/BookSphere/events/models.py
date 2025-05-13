from django.db import models

# Create your models here.
class Event(models.Model):
    
    class EventCategory(models.TextChoices):
        SOCIAL = 'social', 'Social Events (Parties, reunions, weddings)'
        PROFESSIONAL = 'professional', 'Professional Events (Conferences, workshops)'
        CULTURAL = 'cultural', 'Cultural Events (Concerts, art exhibitions)'
        SPORTS = 'sports', 'Sports Events (Marathons, tournaments)'
    Name = models.CharField(max_length=255)
    Description = models.TextField()
    category = models.CharField(
            max_length=20,
            choices=EventCategory.choices,
            default=EventCategory.SOCIAL
        )    
    Date = models.DateTimeField()
    Venue = models.CharField(max_length=255)
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    Image = models.ImageField(upload_to='event_images/')


    def __str__(self):
        return f"{self.Name} - {self.Category}"
