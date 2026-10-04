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
            "short_description",
            "location_name",
            "address",
            "registration_enabled",
            "cover_image",
            "visibility",
            "starts_at",
            "ends_at",
            "created_at",
            "updated_at",
        )
        
        
class PublicEventSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = Event
        fields = (
            "id",
            "organization",
            "title",
            "slug",
            "short_description",
            "description",
            "cover_image",
            "starts_at",
            "ends_at",
            "location_name",
            "address",
            "registration_enabled",
        )