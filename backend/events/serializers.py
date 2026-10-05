from rest_framework import serializers

from organizations.models import Organization, OrganizationMembership
from organizations.serializers import OrganizationSerializer

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    
    organization_id = serializers.PrimaryKeyRelatedField(
        source="organization",
        queryset=Organization.objects.all(),
        write_only=True,
    ) 

    class Meta:
        model = Event
        fields = (
            "id",
            "organization",
            "organization_id",
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
        
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        ) 
        
    def validate_organization_id(self, organization):
         request = self.context.get("request")
         
         if request is None or not request.user.is_authenticated:
             raise serializers.ValidationError(
                 "Authenticated user is required."
             )
             
         allowed = OrganizationMembership.objects.filter(
             user = request.user,
             organization=organization,
             role__in=[
                 OrganizationMembership.Role.ADMIN,
                 OrganizationMembership.Role.MANAGER,
             ],
         ).exists()
         
         if not allowed:
             raise serializers.ValidationError(
                 "You cannot manage events for this organization."
             )
            
         if (self.instance is not None and self.instance.organization != organization):
             raise serializers.ValidationError(
                 "Changing an event organization is not allowed."
             ) 
             
         return organization
                 
    def validate(self, attrs):
        start_at = attrs.get("start_at", getattr(self.instance, "ends_at", None))
        
        ends_at = attrs.get("ends_at", getattr(self.instance, "ends_at", None))
        
        if (start_at is not None and ends_at is not None and ends_at < start_at):
            raise serializers.ValidationError(
                {
                    "ends_at":(
                        "Event end time cannot be earlier "
                        "than start time."
                    )
                }
            )
            
        return attrs
        
        
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