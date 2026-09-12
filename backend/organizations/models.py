from django.db import models
from django.conf import settings




class Organization(models.Model):
    name = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="OrganizationMembership",
        related_name="organizations",
    )

    def __str__(self):
        return self.name
    
class OrganizationMembership(models.Model):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        MANAGER = "manager", "Manager"
        
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organization_memberships",
    ) 
    
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="memberships",
    )
        
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MANAGER
    )
        
    created_at = models.DateTimeField(auto_now_add=True)
        
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "organization"],
                name = "unique_user_organization_membership",
            )  
        ]
            
    def __str__(self):
        return f"{self.user} - {self.organization} ({self.role})"