"""
CTARTech ZentyCore — Python SDK & FastAPI Middleware
Plug-and-play Zero Trust Security for Python Web Applications.
"""

import httpx
from typing import Optional, Dict, Any

class ZeroTrustClient:
    def __init__(self, base_url: str = "http://localhost:8080", api_key: str = ""):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key

    def evaluate_access(
        self,
        user_id: str,
        token: str,
        device_id: str,
        resource: str,
        ip_address: str
    ) -> Dict[str, Any]:
        """Evaluasi permintaan akses ke ZentyCore Control Plane secara real-time."""
        endpoint = f"{self.base_url}/api/v1/policy/evaluate"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "user_id": user_id,
            "token": token,
            "device_id": device_id,
            "resource": resource,
            "ip_address": ip_address
        }
        
        with httpx.Client(timeout=3.0) as client:
            res = client.post(endpoint, json=payload, headers=headers)
            if res.status_code == 200:
                return res.json()
            return {
                "allowed": False,
                "reason": f"HTTP {res.status_code}: Access denied by Policy Engine",
                "overall_risk_score": 100
            }

    def fastapi_middleware(self, app, resource_prefix: str = "api"):
        """
        FastAPI ASGI Middleware untuk proteksi inline Zero Trust
        Usage:
            from fastapi import FastAPI
            from zentycore import ZeroTrustClient

            app = FastAPI()
            zt = ZeroTrustClient(base_url="http://localhost:8080", api_key="zt_live_key")
            zt.fastapi_middleware(app, resource_prefix="prod-finance-api")
        """
        from starlette.middleware.base import BaseHTTPMiddleware
        from starlette.responses import JSONResponse

        class ZeroTrustASGIMiddleware(BaseHTTPMiddleware):
            async def dispatch(inner_self, request, call_next):
                auth_header = request.headers.get("authorization", "")
                token = auth_header.replace("Bearer ", "") if "Bearer " in auth_header else auth_header
                user_id = request.headers.get("x-user-id", "anonymous")
                device_id = request.headers.get("x-device-id", "unknown_device")
                client_ip = request.client.host if request.client else "127.0.0.1"

                decision = self.evaluate_access(
                    user_id=user_id,
                    token=token,
                    device_id=device_id,
                    resource=f"{resource_prefix}:{request.url.path}",
                    ip_address=client_ip
                )

                if decision.get("allowed", False):
                    response = await call_next(request)
                    response.headers["X-ZentyCore-Attested"] = "true"
                    response.headers["X-ZentyCore-Session-ID"] = decision.get("session_id", "")
                    return response
                else:
                    return JSONResponse(
                        status_code=403,
                        content={
                            "error": "FORBIDDEN_ZERO_TRUST_VIOLATION",
                            "reason": decision.get("reason", "Access denied by Zero Trust Policy"),
                            "risk_score": decision.get("overall_risk_score", 100)
                        }
                    )

        app.add_middleware(ZeroTrustASGIMiddleware)
