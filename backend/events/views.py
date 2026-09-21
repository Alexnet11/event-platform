from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event
from .serializers import EventSerializer


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
        )

        return Response(serializer.data)