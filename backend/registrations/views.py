from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated

from events.models import Event
from organizations.models import OrganizationMembership

from .models import Registration
from .serializers import (PublicRegistrationSerializer, OrganizerRegistrationSerializer )


class PublicRegistrationCreateView(generics.CreateAPIView):
    serializer_class = PublicRegistrationSerializer
    permission_classes = [AllowAny]

    def get_event(self):
        event = get_object_or_404(
            Event,
            slug=self.kwargs["slug"],
            visibility__in=[
                Event.Visibility.PUBLIC,
                Event.Visibility.UNLISTED,
            ],
        )

        if not event.registration_enabled:
            raise ValidationError(
                {
                    "detail": "Registration for this event is closed."
                }
            )

        return event

    def get_serializer_context(self):
        context = super().get_serializer_context()

        context["event"] = self.get_event()

        return context

    def perform_create(self, serializer):
        serializer.save(
            event=self.get_event(),
        )
        
        
class EventRegistrationListView(generics.ListAPIView):
    serializer_class = OrganizerRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_event(self):
        return get_object_or_404(
            Event.objects.select_related("organization"),
            pk=self.kwargs["event_id"],
            organization__memberships__user=self.request.user,
            organization__memberships__role__in=[
                OrganizationMembership.Role.ADMIN,
                OrganizationMembership.Role.MANAGER,
            ],
        )

    def get_queryset(self):
        event = self.get_event()

        return (
            Registration.objects
            .filter(event=event)
            .order_by("-created_at")
        )