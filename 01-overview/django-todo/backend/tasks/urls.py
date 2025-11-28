from django.urls import path
from .views import (
    TodoListView,
    TodoCreateView,
    TodoUpdateView,
    TodoDeleteView,
    ToggleResolvedView,
    StatsView,
)


app_name = "tasks"

urlpatterns = [
    path("todos/", TodoListView.as_view(), name="list"),
    path("todos/create/", TodoCreateView.as_view(), name="create"),
    path("todos/<int:pk>/edit/", TodoUpdateView.as_view(), name="edit"),
    path("todos/<int:pk>/delete/", TodoDeleteView.as_view(), name="delete"),
    path("todos/<int:pk>/toggle/", ToggleResolvedView.as_view(), name="toggle"),
    path("stats/", StatsView.as_view(), name="stats"),
]
