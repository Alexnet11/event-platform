from rest_framework import serializers

from .models import Organization, OrganizationMembership


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
        )


class OrganizationMembershipSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)

    role_label = serializers.CharField(
        source="get_role_display",
        read_only=True,
    )

    class Meta:
        model = OrganizationMembership
        fields = (
            "id",
            "organization",
            "role",
            "role_label",
            "created_at",
        )