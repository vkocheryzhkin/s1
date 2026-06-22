import type { Middleware, UnknownAction } from '@reduxjs/toolkit';

type TWsActionTypes = {
  connecting: string;
  open: string;
  close: string;
  error: string;
  message: string;
  disconnect: string;
};

type TSocketMiddlewareOptions = {
  onInvalidToken?: (dispatch: (action: UnknownAction) => void) => void;
};

export const socketMiddleware = (
  wsUrl: string | (() => string),
  wsActions: TWsActionTypes,
  options: TSocketMiddlewareOptions = {}
): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action: UnknownAction) => {
      const { dispatch } = store;

      if (action.type === wsActions.connecting) {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.close();
        }

        const url = typeof wsUrl === 'function' ? wsUrl() : wsUrl;
        socket = new WebSocket(url);

        socket.onopen = (): void => {
          dispatch({ type: wsActions.open });
        };

        socket.onmessage = (event: MessageEvent<string>): void => {
          const data = JSON.parse(event.data) as { message?: string };

          if (data.message === 'Invalid or missing token') {
            options.onInvalidToken?.(dispatch);
            return;
          }

          dispatch({ type: wsActions.message, payload: data });
        };

        socket.onerror = (): void => {
          dispatch({ type: wsActions.error });
        };

        socket.onclose = (): void => {
          dispatch({ type: wsActions.close });
          socket = null;
        };
      }

      if (action.type === wsActions.disconnect) {
        if (socket) {
          socket.onclose = null;
          socket.close();
          socket = null;
        }
      }

      return next(action);
    };
  };
};
