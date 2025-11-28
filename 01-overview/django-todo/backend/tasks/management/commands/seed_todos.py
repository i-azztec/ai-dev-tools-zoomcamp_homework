from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from tasks.models import Todo


class Command(BaseCommand):
    help = "Create a set of demo tasks (based on React mockTodos)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Clear existing tasks and seed again",
        )

    def handle(self, *args, **options):
        if Todo.objects.exists() and not options.get("force"):
            self.stdout.write(self.style.WARNING("Tasks already exist — skipping seed (use --force to overwrite)"))
            return
        if options.get("force"):
            Todo.objects.all().delete()

        today = timezone.now().date()

        sample = [
            {
                "title": "Prepare client presentation",
                "description": "Create slides with quarterly results and growth plans",
                "due_date": today + timedelta(days=2),
                "is_resolved": False,
                "priority": "high",
                "category": "work",
            },
            {
                "title": "Buy groceries for the week",
                "description": "Milk, bread, vegetables, fruit",
                "due_date": today,
                "is_resolved": False,
                "priority": "medium",
                "category": "shopping",
            },
            {
                "title": "Read Python chapter",
                "description": "Chapter 5: Decorators and context managers",
                "due_date": today + timedelta(days=5),
                "is_resolved": False,
                "priority": "medium",
                "category": "study",
            },
            {
                "title": "Book a dentist appointment",
                "description": "",
                "due_date": today - timedelta(days=2),
                "is_resolved": False,
                "priority": "high",
                "category": "personal",
            },
            {
                "title": "Do code review for the team",
                "description": "Check pull requests for new features",
                "due_date": None,
                "is_resolved": True,
                "priority": "medium",
                "category": "work",
            },
            {
                "title": "Pay utility bills",
                "description": "Don't forget internet and electricity",
                "due_date": today + timedelta(days=7),
                "is_resolved": False,
                "priority": "low",
                "category": "personal",
            },
            {
                "title": "Prepare for Django exam",
                "description": "Review ORM, migrations, authentication",
                "due_date": today + timedelta(days=10),
                "is_resolved": False,
                "priority": "high",
                "category": "study",
            },
            {
                "title": "Buy a birthday gift",
                "description": "",
                "due_date": today + timedelta(days=14),
                "is_resolved": True,
                "priority": "medium",
                "category": "shopping",
            },
        ]

        for item in sample:
            Todo.objects.create(**item)

        self.stdout.write(self.style.SUCCESS(f"Created {len(sample)} tasks"))
