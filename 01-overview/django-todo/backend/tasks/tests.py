from django.test import TestCase
from django.urls import reverse
from .models import Todo


class TodoModelTest(TestCase):
    def test_create_todo(self):
        todo = Todo.objects.create(title="Test", description="Desc", priority="high", category="work")
        self.assertEqual(todo.title, "Test")
        self.assertFalse(todo.is_resolved)


class TodoViewsTest(TestCase):
    def setUp(self):
        self.t1 = Todo.objects.create(title="A", is_resolved=False, priority="medium", category="work")
        self.t2 = Todo.objects.create(title="B", is_resolved=True, priority="low", category="shopping")

    def test_list_page(self):
        resp = self.client.get(reverse("tasks:list"))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "My Tasks")

    def test_filter_status_active(self):
        resp = self.client.get(reverse("tasks:list"), {"status": "active"})
        self.assertContains(resp, ">A<")
        self.assertNotContains(resp, ">B<")

    def test_create_view(self):
        resp = self.client.get(reverse("tasks:create"))
        self.assertEqual(resp.status_code, 200)
        resp = self.client.post(reverse("tasks:create"), {
            "title": "New",
            "description": "",
            "priority": "medium",
            "category": "work",
            "is_resolved": False,
        })
        self.assertEqual(resp.status_code, 302)
        self.assertTrue(Todo.objects.filter(title="New").exists())

    def test_update_view(self):
        resp = self.client.post(reverse("tasks:edit", args=[self.t1.id]), {
            "title": "A2",
            "description": "D",
            "priority": "high",
            "category": "work",
            "is_resolved": True,
        })
        self.assertEqual(resp.status_code, 302)
        self.t1.refresh_from_db()
        self.assertEqual(self.t1.title, "A2")
        self.assertTrue(self.t1.is_resolved)

    def test_toggle(self):
        resp = self.client.post(reverse("tasks:toggle", args=[self.t1.id]))
        self.assertEqual(resp.status_code, 302)
        self.t1.refresh_from_db()
        self.assertTrue(self.t1.is_resolved)

    def test_delete(self):
        resp = self.client.post(reverse("tasks:delete", args=[self.t2.id]))
        self.assertEqual(resp.status_code, 302)
        self.assertFalse(Todo.objects.filter(id=self.t2.id).exists())


class StatsViewTest(TestCase):
    def test_stats(self):
        Todo.objects.create(title="A", is_resolved=False)
        Todo.objects.create(title="B", is_resolved=True)
        resp = self.client.get(reverse("tasks:stats"))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "Statistics")


class OrderingCompletedLastTest(TestCase):
    def test_completed_tasks_go_last(self):
        t1 = Todo.objects.create(title="Task1", is_resolved=False)
        t2 = Todo.objects.create(title="Task2", is_resolved=True)
        t3 = Todo.objects.create(title="Task3", is_resolved=False)
        resp = self.client.get(reverse("tasks:list"))
        html = resp.content.decode("utf-8")
        pos1 = html.find(">Task1<")
        pos2 = html.find(">Task2<")
        pos3 = html.find(">Task3<")
        self.assertTrue(pos1 != -1 and pos2 != -1 and pos3 != -1)
        self.assertTrue(pos2 > pos1)
        self.assertTrue(pos2 > pos3)

# Create your tests here.
