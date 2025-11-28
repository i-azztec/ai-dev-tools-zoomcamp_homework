from django.db.models import Q
from django.http import HttpResponseRedirect
from django.urls import reverse, reverse_lazy
from django.utils import timezone
from django.views import View
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, TemplateView

from .models import Todo
from .forms import TodoForm


class TodoListView(ListView):
    model = Todo
    template_name = "tasks/list.html"
    context_object_name = "todos"

    def get_queryset(self):
        qs = Todo.objects.all()
        status = self.request.GET.get("status", "all")
        category = self.request.GET.get("category", "all")
        priority = self.request.GET.get("priority", "all")
        q = self.request.GET.get("q", "")
        order_by = self.request.GET.get("order_by", "due_date")

        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))
        if category != "all":
            qs = qs.filter(category=category)
        if priority != "all":
            qs = qs.filter(priority=priority)
        if status == "active":
            qs = qs.filter(is_resolved=False)
        elif status == "done":
            qs = qs.filter(is_resolved=True)

        if order_by in {"due_date", "-due_date", "priority", "-priority"}:
            qs = qs.order_by("is_resolved", order_by)
        else:
            qs = qs.order_by("is_resolved")

        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx.update(
            {
                "filters": {
                    "status": self.request.GET.get("status", "all"),
                    "category": self.request.GET.get("category", "all"),
                    "priority": self.request.GET.get("priority", "all"),
                    "q": self.request.GET.get("q", ""),
                    "order_by": self.request.GET.get("order_by", "due_date"),
                },
                "today": timezone.now().date(),
            }
        )
        return ctx


class TodoCreateView(CreateView):
    model = Todo
    form_class = TodoForm
    template_name = "tasks/form.html"
    success_url = reverse_lazy("tasks:list")


class TodoUpdateView(UpdateView):
    model = Todo
    form_class = TodoForm
    template_name = "tasks/form.html"
    success_url = reverse_lazy("tasks:list")


class TodoDeleteView(DeleteView):
    model = Todo
    success_url = reverse_lazy("tasks:list")
    template_name = "tasks/confirm_delete.html"


class ToggleResolvedView(View):
    def post(self, request, pk):
        todo = Todo.objects.get(pk=pk)
        todo.is_resolved = not todo.is_resolved
        todo.save(update_fields=["is_resolved"])
        return HttpResponseRedirect(request.META.get("HTTP_REFERER", reverse("tasks:list")))


class StatsView(TemplateView):
    template_name = "tasks/stats.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        todos = Todo.objects.all()
        total = todos.count()
        active = todos.filter(is_resolved=False).count()
        done = todos.filter(is_resolved=True).count()
        today = timezone.now().date()
        overdue = todos.filter(is_resolved=False, due_date__lt=today).count()
        progress = int(round((done / total) * 100)) if total else 0
        ctx.update({"stats": {"total": total, "active": active, "done": done, "overdue": overdue, "progress": progress}})
        return ctx
