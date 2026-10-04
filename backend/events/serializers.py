from rest_framework import serializers

from organizations.serializers import OrganizationSerializer

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = Event
        fields = (
            "id",
            "organization",
            "title",
            "slug",
            "description",
            "visibility",
            "starts_at",
            "ends_at",
            "created_at",
            "updated_at",
        )