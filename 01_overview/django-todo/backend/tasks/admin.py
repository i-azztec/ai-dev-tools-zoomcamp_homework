from django.contrib import admin
from .models import Todo


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "priority", "due_date", "is_resolved", "created_at")
    list_filter = ("category", "priority", "is_resolved")
    search_fields = ("title", "description")
    ordering = ("is_resolved", "due_date")
