#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# Superuser avtomatik yaratish (agar mavjud bo'lmasa)
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin2024').exists():
    User.objects.create_superuser('admin2024', 'admin@example.com', 'Savdo2024!Market')
    print('Superuser yaratildi: admin2024')
else:
    print('Superuser allaqachon mavjud')
"