class VisitorTrackingMiddleware:
    """
    Har bir API GET so'rovini engil tarzda logga yozadi (session_key asosida,
    hech qanday shaxsiy ma'lumot yoki IP saqlanmaydi).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        try:
            if request.path.startswith("/api/") and request.method == "GET":
                if not request.session.session_key:
                    request.session.save()
                from .models import Visit
                Visit.objects.create(
                    session_key=request.session.session_key or "anon",
                    path=request.path,
                    user=request.user if getattr(request, "user", None) and request.user.is_authenticated else None,
                )
        except Exception:
            pass
        return response
