from fastapi import WebSocket
import json


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: str, message: dict):
        ws = self.active_connections.get(user_id)
        if ws:
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                self.disconnect(user_id)

    async def broadcast(self, message: dict):
        for user_id, ws in list(self.active_connections.items()):
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                self.disconnect(user_id)

    def get_connected_users(self) -> list[str]:
        return list(self.active_connections.keys())


manager = ConnectionManager()

