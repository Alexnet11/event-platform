from django.db import models

from events.models import Event


class Registration(models.Model):
  class Status(models.TextChoices):
    REGISTERED = "registered", "Registered"
    CANCELLED = "cancelled", "Cancelled"
    
    
  event = models.ForeignKey(
    Event,
    on_delete=models.PROTECT,
    related_name="registrations",
  )
    
  first_name = models.CharField(max_length=150)
  last_name = models.CharField(max_length=150)
    
  email = models.EmailField()
    
  phone = models.CharField(
    max_length=50,
    blank=True,
  )
    
  company = models.CharField(
    max_length=255,
    blank=True,
  )
    
  position = models.CharField(
    max_length=255,
    blank=True,
  )
    
  status = models.CharField(
    max_length=20,
    choices=Status.choices,
    default=Status.REGISTERED,
  )
    
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
    
  class Meta:
    constraints = [
      models.UniqueConstraint(
        fields=["event", "email"],
        name="unique_event_registration_email",
      )
    ]

    ordering = ["-created_at"]

  def __str__(self):
    return (
      f"{self.first_name} {self.last_name} "
      f"→ {self.event}"
    )
    
    
    