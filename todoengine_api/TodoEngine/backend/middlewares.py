from typing import Any
from django.conf import settings
from django.http import HttpResponseRedirect


class AppendSlashMiddleware:
    def __init__(self, get_response) -> None:
        self.get_response = get_response

    def __call__(self, request) -> Any:
        response = self.get_response(request)
        if request.method == 'POST' and settings.APPEND_SLASH and not request.path.endswith('/'):
            return HttpResponseRedirect(request.path + '/')
        return response