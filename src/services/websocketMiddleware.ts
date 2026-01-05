import { Middleware, AnyAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { setUserConnected, setUserDisconnected, setUserOrders, type WebSocketConnectPayload } from './ordersWebSocketSlice';
import { getCookie } from '../utils/cookies';
import type { Order } from './ordersWebSocketSlice';
import { refreshToken } from './authActions';

interface WebSocketMessage {
  success?: boolean;
  orders?: unknown[];
  total?: number;
  totalToday?: number;
  message?: string;
  [key: string]: unknown;
}

interface WebSocketActionTypes {
  connect: string;
  disconnect: string;
  send?: string;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private shouldReconnect = true;
  private dispatch: ((action: AnyAction) => void) | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private config: WebSocketConnectPayload | null = null;
  private url: string | null = null;

  connect(url: string, config: WebSocketConnectPayload, dispatch: (action: AnyAction) => void) {
    this.url = url;
    this.config = config;
    this.dispatch = dispatch;
    this.shouldReconnect = true;
    this.attemptConnection();
  }

  private attemptConnection() {
    if (this.ws?.readyState === WebSocket.OPEN || !this.url || !this.config) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        if (this.config && this.dispatch) {
          this.dispatch(this.config.onConnected());
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          if (data.success && this.config) {
            const action = this.config.onMessage(data);
            if (action && this.dispatch) {
              this.dispatch(action);
            }
          } else {
            const errorMessage = data.message || 'Ошибка при получении данных';
            console.error('WebSocket message error:', errorMessage);

            if (errorMessage === 'Invalid or missing token') {
              this.shouldReconnect = false;
              if (this.ws) {
                this.ws.close();
                this.ws = null;
              }
              if (this.config) {
                this.config.onTokenInvalid?.();
              }
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
        if (this.config && this.dispatch) {
          this.dispatch(this.config.onDisconnected());
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

    this.config = null;
    this.url = null;
  }

  send(data: unknown) {
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

export function createWebSocketMiddleware(
  actionTypes: WebSocketActionTypes,
  options?: {
    onAuthAction?: (action: AnyAction, state: RootState) => AnyAction | null | undefined;
    onAuthSuccess?: (state: RootState, dispatch: (action: AnyAction) => void) => void;
    onAuthLogout?: (dispatch: (action: AnyAction) => void) => void;
  }
): Middleware {
  const managers = new Map<string, WebSocketManager>();

  return (store) => {
    return (next) => (action: unknown) => {
      const result = next(action);

      const typedAction = action as AnyAction & { payload?: WebSocketConnectPayload | unknown };

      if (options?.onAuthSuccess) {
        const state = store.getState() as RootState;
        if (typedAction.type === 'auth/loginUser/fulfilled' || typedAction.type === 'auth/checkAuth/fulfilled') {
          if (state.auth?.isAuthenticated) {
            options.onAuthSuccess(state, store.dispatch);
          }
        }
        if (typedAction.type === 'auth/refreshToken/fulfilled') {
          managers.forEach((manager, url) => {
            if (manager.isConnected() && url.includes('?token=')) {
              manager.disconnect();
              setTimeout(() => {
                const token = getCookie('accessToken');
                const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : '';
                const baseUrl = url.split('?')[0];
                const newUrl = `${baseUrl}${cleanToken ? `?token=${cleanToken}` : ''}`;
                const existingPayload = typedAction.payload as WebSocketConnectPayload | undefined;
                if (existingPayload) {
                  manager.connect(newUrl, { ...existingPayload, url: newUrl }, store.dispatch);
                }
              }, 100);
            }
          });
        }
      }

      if (options?.onAuthLogout && typedAction.type === 'auth/logoutUser/fulfilled') {
        options.onAuthLogout(store.dispatch);
      }

      if (typedAction.type === actionTypes.connect) {
        const payload = typedAction.payload as WebSocketConnectPayload | undefined;

        if (payload && payload.url) {
          const manager = managers.get(payload.url) || new WebSocketManager();
          managers.set(payload.url, manager);
          if (!manager.isConnected()) {
            manager.connect(payload.url, payload, store.dispatch);
          }
        }
      }

      if (typedAction.type === actionTypes.disconnect) {
        const payload = typedAction.payload as { url?: string };
        if (payload?.url) {
          const manager = managers.get(payload.url);
          if (manager) {
            manager.disconnect();
            managers.delete(payload.url);
          }
        } else {
          managers.forEach((manager) => manager.disconnect());
          managers.clear();
        }
      }

      if (actionTypes.send && typedAction.type === actionTypes.send) {
        const payload = typedAction.payload as { url?: string; data?: unknown };
        if (payload?.url) {
          const manager = managers.get(payload.url);
          if (manager) {
            manager.send(payload.data);
          }
        }
      }

      return result;
    };
  };
}

const getWebSocketUrl = (baseUrl: string, requiresToken: boolean): string => {
  if (requiresToken) {
    const token = getCookie('accessToken');
    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      return `${baseUrl}?token=${cleanToken}`;
    }
  }
  return baseUrl;
};

export const websocketMiddleware = createWebSocketMiddleware(
  {
    connect: 'ws/connect',
    disconnect: 'ws/disconnect',
    send: 'ws/send',
  },
  {
    onAuthAction: (action) => {
      if (action.type === 'auth/refreshToken') {
        return refreshToken() as unknown as AnyAction;
      }
      return null;
    },
    onAuthSuccess: (state, dispatch) => {
      if (state.auth?.isAuthenticated) {
        dispatch({
          type: 'ws/connect',
          payload: {
            url: getWebSocketUrl('wss://norma.education-services.ru/orders', true),
            onConnected: () => setUserConnected(),
            onDisconnected: () => setUserDisconnected(),
            onMessage: (data: WebSocketMessage) => {
              if (data.orders && Array.isArray(data.orders)) {
                return setUserOrders({
                  orders: data.orders as Order[],
                  total: data.total || 0,
                  totalToday: data.totalToday || 0,
                });
              }
              return null;
            },
            onTokenInvalid: () => {
              const refreshAction = refreshToken() as unknown as AnyAction;
              const result = dispatch(refreshAction);
              if (result !== undefined && result !== null && typeof result === 'object' && 'then' in result) {
                (result as unknown as Promise<{ type: string }>).then(() => {
                  const url = getWebSocketUrl('wss://norma.education-services.ru/orders', true);
                  dispatch({
                    type: 'ws/connect',
                    payload: {
                      url,
                      onConnected: () => setUserConnected(),
                      onDisconnected: () => setUserDisconnected(),
                      onMessage: (data: WebSocketMessage) => {
                        if (data.orders && Array.isArray(data.orders)) {
                          return setUserOrders({
                            orders: data.orders as Order[],
                            total: data.total || 0,
                            totalToday: data.totalToday || 0,
                          });
                        }
                        return null;
                      },
                    },
                  } as AnyAction);
                }).catch(() => {
                  console.error('Failed to refresh token');
                });
              }
            },
          },
        } as AnyAction);
      }
    },
    onAuthLogout: (dispatch) => {
      dispatch({ type: 'ws/disconnect' } as AnyAction);
    },
  }
);
