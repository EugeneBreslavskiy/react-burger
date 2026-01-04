import { Middleware } from '@reduxjs/toolkit';
import { setConnected, setDisconnected, setOrders, setUserConnected, setUserDisconnected, setUserOrders } from './ordersWebSocketSlice';
import { getCookie } from '../utils/cookies';
import { refreshToken } from './authActions';

type WebSocketAction = {
  type: string;
  payload?: any;
};

type WebSocketMessage = {
  success?: boolean;
  orders?: any[];
  total?: number;
  totalToday?: number;
  message?: string;
  [key: string]: unknown;
};

class WebSocketManager {
  private ws: WebSocket | null = null;
  private baseUrl: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private shouldReconnect = true;
  private dispatch: ((action: WebSocketAction) => void) | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private requiresToken: boolean;
  private onTokenInvalid: (() => void) | null = null;

  constructor(baseUrl: string, requiresToken: boolean = false) {
    this.baseUrl = baseUrl;
    this.requiresToken = requiresToken;
  }

  setOnTokenInvalid(callback: () => void) {
    this.onTokenInvalid = callback;
  }

  connect(dispatch: (action: WebSocketAction) => void) {
    this.dispatch = dispatch;
    this.shouldReconnect = true;
    this.attemptConnection();
  }

  private getUrl(): string {
    if (this.requiresToken) {
      const token = getCookie('accessToken');
      if (token) {
        const cleanToken = token.replace(/^Bearer\s+/i, '');
        return `${this.baseUrl}?token=${cleanToken}`;
      }
    }
    return this.baseUrl;
  }

  private attemptConnection() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const url = this.getUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        if (this.baseUrl.includes('/orders/all')) {
          this.dispatch?.(setConnected());
        } else {
          this.dispatch?.(setUserConnected());
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          if (data.success) {
            if (data.orders) {
              if (this.baseUrl.includes('/orders/all')) {
                this.dispatch?.(setOrders({
                  orders: data.orders,
                  total: data.total || 0,
                  totalToday: data.totalToday || 0,
                }));
              } else {
                this.dispatch?.(setUserOrders({
                  orders: data.orders,
                  total: data.total || 0,
                  totalToday: data.totalToday || 0,
                }));
              }
            } else {
              this.dispatch?.({
                type: 'ws/message',
                payload: data.message || 'Успешно',
              });
            }
          } else {
            const errorMessage = data.message || 'Ошибка при получении данных';
            console.error('WebSocket message error:', errorMessage);

            if (errorMessage === 'Invalid or missing token' && this.requiresToken) {
              this.shouldReconnect = false;
              if (this.ws) {
                this.ws.close();
                this.ws = null;
              }
              this.onTokenInvalid?.();
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed', event.code, event.reason);
        if (this.baseUrl.includes('/orders/all')) {
          this.dispatch?.(setDisconnected());
        } else {
          this.dispatch?.(setUserDisconnected());
        }

        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

          this.reconnectTimer = setTimeout(() => {
            this.attemptConnection();
          }, this.reconnectDelay);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }

  disconnect() {
    this.shouldReconnect = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

const wsManager = new WebSocketManager('wss://norma.education-services.ru/orders/all', false);
const feedWsManager = new WebSocketManager('wss://norma.education-services.ru/orders/all', false);
const userWsManager = new WebSocketManager('wss://norma.education-services.ru/orders', true);

export const websocketMiddleware: Middleware = (store) => {
  const reconnectUserWebSocket = () => {
    const state = store.getState() as any;
    if (state.auth?.isAuthenticated) {
      userWsManager.disconnect();
      setTimeout(() => {
        userWsManager.connect(store.dispatch);
      }, 100);
    }
  };

  userWsManager.setOnTokenInvalid(() => {
    const state = store.getState() as any;
    if (state.auth?.isAuthenticated) {
      const refreshTokenValue = window.localStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        store.dispatch(refreshToken() as any)
          .then((result: any) => {
            if (result.type === 'auth/refreshToken/fulfilled') {
              reconnectUserWebSocket();
            }
          })
          .catch(() => {
            console.error('Failed to refresh token');
          });
      }
    }
  });

  return (next) => (action: any) => {
    const result = next(action);

    if (action.type === 'auth/loginUser/fulfilled' || action.type === 'auth/checkAuth/fulfilled') {
      const state = store.getState() as any;
      if (state.auth?.isAuthenticated) {
        if (!userWsManager.isConnected()) {
          userWsManager.connect(store.dispatch);
        }
      }
    }

    if (action.type === 'auth/refreshToken/fulfilled') {
      reconnectUserWebSocket();
    }

    if (action.type === 'auth/logoutUser/fulfilled') {
      userWsManager.disconnect();
    }

    if (action.type === 'ws/connect') {
      wsManager.connect(store.dispatch);
    }

    if (action.type === 'ws/disconnect') {
      wsManager.disconnect();
    }

    if (action.type === 'ws/send') {
      wsManager.send(action.payload);
    }

    if (action.type === 'ws/feed/connect') {
      if (!feedWsManager.isConnected()) {
        feedWsManager.connect(store.dispatch);
      }
    }

    if (action.type === 'ws/feed/disconnect') {
      feedWsManager.disconnect();
    }

    if (action.type === 'ws/feed/send') {
      feedWsManager.send(action.payload);
    }

    if (action.type === 'ws/user/connect') {
      if (!userWsManager.isConnected()) {
        userWsManager.connect(store.dispatch);
      }
    }

    if (action.type === 'ws/user/disconnect') {
      userWsManager.disconnect();
    }

    if (action.type === 'ws/user/send') {
      userWsManager.send(action.payload);
    }

    return result;
  };
};

export { wsManager, feedWsManager, userWsManager };

