import { useState, useEffect, useRef, useCallback } from 'react';

interface WSMessage {
  type: 'new_match' | 'status_update' | 'crowd_update';
  data: unknown;
}

export function useWebSocket(userId: string | undefined) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!userId) return;

    const connect = () => {
      try {
        const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
        wsRef.current = ws;

        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => {
          setIsConnected(false);
          reconnectRef.current = setTimeout(connect, 3000);
        };
        ws.onmessage = (e) => {
          try {
            setLastMessage(JSON.parse(e.data));
          } catch { /* ignore */ }
        };
        ws.onerror = () => ws.close();
      } catch {
        reconnectRef.current = setTimeout(connect, 3000);
      }
    };

    connect();
    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [userId]);

  const sendMessage = useCallback((msg: unknown) => {
    wsRef.current?.send(JSON.stringify(msg));
  }, []);

  return { isConnected, lastMessage, sendMessage };
}
