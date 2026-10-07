from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated

from events.models import Event
from organizations.models import OrganizationMembership

from .models import Registration
from .serializers import (PublicRegistrationSerializer, OrganizerRegistrationSerializer, RegistrationStatusSerializer )


class PublicRegistrationCreateView(generics.CreateAPIView):
    serializer_class = PublicRegistrationSerializer
    authentication_classes = []
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
        
        
class EventRegistrationDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Registration.objects
            .filter(
                event_id=self.kwargs["event_id"],
                event__organization__memberships__user=self.request.user,
                event__organization__memberships__role__in=[
                    OrganizationMembership.Role.ADMIN,
                    OrganizationMembership.Role.MANAGER,
                ],
            )
            .select_related(
                "event",
                "event__organization",
            )
        )

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return RegistrationStatusSerializer

        return OrganizerRegistrationSerializer
    
    
class EventStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, event_id):
        event = get_object_or_404(
            Event.objects.select_related("organization"),
            pk=event_id,
            organization__memberships__user=request.user,
            organization__memberships__role__in=[
                OrganizationMembership.Role.ADMIN,
                OrganizationMembership.Role.MANAGER,
            ],
        )

        stats = Registration.objects.filter(
            event=event
        ).aggregate(
            registrations_total=Count("id"),
            registered=Count(
                "id",
                filter=Q(
                    status=Registration.Status.REGISTERED
                ),
            ),
            cancelled=Count(
                "id",
                filter=Q(
                    status=Registration.Status.CANCELLED
                ),
            ),
        )

        return Response({"event_id": event.id, "title": event.title, **stats,})