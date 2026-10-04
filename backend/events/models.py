from django.db import models

from organizations.models import Organization


class Event(models.Model):
  class Visibility(models.TextChoices):
    PUBLIC = "public", "Public"
    UNLISTED = "unlisted", "Unlisted"
    PRIVATE = "private", "Private"
    
  organization = models.ForeignKey(
    Organization,
    on_delete=models.PROTECT,
    related_name="events",
  )
  
  title = models.CharField(max_length=255)
  
  slug = models.SlugField(
    max_length=255,
    unique=True,
  ) 
  
  description = models.TextField(blank=True)
  
  visibility = models.CharField(
    max_length=20,
    choices=Visibility.choices,
    default=Visibility.UNLISTED,
  )
  
  starts_at = models.DateTimeField()
  
  ends_at = models.DateTimeField(
    null=True,
    blank=True,
  )
  
  created_at = models.DateTimeField(auto_now_add=True)
  
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return self.title