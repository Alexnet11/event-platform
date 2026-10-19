from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event
from organizations.models import OrganizationMembership
from .serializers import EventSerializer, PublicEventSerializer


class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Event.objects
            .filter(
                organization__memberships__user=self.request.user,
                organization__memberships__role__in=OrganizationMembership.organizer_roles()
            )
            .select_related("organization")
            .order_by("starts_at")
        )
    
    
class PublicEventListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        events = (
            Event.objects
            .filter(
                visibility = Event.Visibility.PUBLIC,
                status=Event.Status.PUBLISHED,
            )
            .select_related("organization")
            .order_by("starts_at")
        )
        
        serializer = PublicEventSerializer(
            events,
            many=True,
            context={"request":request}
        )
        
        return Response(serializer.data)
    
    
class PublicEventDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        event = get_object_or_404(
            Event.objects.select_related("organization"),
            slug = slug,
            visibility__in = [
                Event.Visibility.PUBLIC,
                Event.Visibility.UNLISTED,
            ],
            status=Event.Status.PUBLISHED,
        )
        
        serializer = PublicEventSerializer(
            event,
            context={"request": request},
        )
        
        return Response(serializer.data)
    

  
class EventDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Event.objects
            .filter(
                organization__memberships__user=self.request.user,
                organization__memberships__role__in=OrganizationMembership.organizer_roles()
            )
            .select_related("organization")
        )
               