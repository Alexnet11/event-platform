from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event
from .serializers import EventSerializer, PublicEventSerializer


class EventListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = (
            Event.objects
            .filter(organization__members=request.user)
            .select_related("organization")
            .order_by("starts_at")
        )

        serializer = EventSerializer(
            events,
            many=True,
            context={"requrst":request}
        )

        return Response(serializer.data)
    
    
class PublicEventListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        events = (
            Event.objects.filter(visibility = Event.Visibility.PUBLIC).select_related("organization").order_by("starts_at")
        )
        
        serializer = PublicEventSerializer(
            events,
            many=True,
            context={"requst":request}
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
            ]
        )
        
        serializer = PublicEventSerializer(
            event,
            context={"request": request},
        )
        
        return Response(serializer.data)
    