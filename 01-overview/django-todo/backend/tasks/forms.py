from django import forms
from .models import Todo


class TodoForm(forms.ModelForm):
    class Meta:
        model = Todo
        fields = [
            "title",
            "description",
            "due_date",
            "category",
            "priority",
            "is_resolved",
        ]
        widgets = {
            "title": forms.TextInput(attrs={"class": "form-control", "placeholder": "Enter task title"}),
            "description": forms.Textarea(attrs={"class": "form-control", "rows": 4, "placeholder": "Add task details (optional)"}),
            "due_date": forms.DateInput(attrs={"class": "form-control", "type": "date"}),
            "category": forms.Select(attrs={"class": "form-select"}),
            "priority": forms.Select(attrs={"class": "form-select"}),
            "is_resolved": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }
