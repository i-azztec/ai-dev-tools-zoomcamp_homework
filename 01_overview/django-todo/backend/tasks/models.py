from django.db import models


PRIORITY_CHOICES = (
    ("low", "Low"),
    ("medium", "Medium"),
    ("high", "High"),
)

CATEGORY_CHOICES = (
    ("work", "Work"),
    ("study", "Study"),
    ("personal", "Personal"),
    ("shopping", "Shopping"),
    ("other", "Other"),
)


class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    is_resolved = models.BooleanField(default=False)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="work")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["is_resolved", "due_date", "-priority", "-created_at"]
