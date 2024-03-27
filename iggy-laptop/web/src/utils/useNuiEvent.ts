import { onDestroy } from "svelte";

interface NuiMessage<T = unknown> {
    app: string;
    action: string;
    data: T;
}

/**
 * A function that manage events listeners for receiving data from the client scripts
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this function
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 *   // whatever logic you want
 * })
 *
 **/

type NuiEventHandler<T = any> = (data: T) => void;

interface NuiEventData {
    action: string;
    handler: NuiEventHandler;
}

const eventListeners = new Map<string, NuiEventData[]>();

const eventListener = (event: MessageEvent<NuiMessage>) => {
    const { app, action, data } = event.data;
    const handlers = eventListeners.get(app);

    if (handlers) {
        handlers.forEach((handler) => {
            if (action === handler.action) {
                handler.handler(data);
            }
        });
    }
};

window.addEventListener("message", eventListener);

export function useNuiEvent<T = unknown>(
    app: string,
    action: string,
    handler: NuiEventHandler<T>
) {
    const handlers = eventListeners.get(app) || [];
    const eventData = { action, handler };
    handlers.push(eventData);
    eventListeners.set(app, handlers);

    onDestroy(() => {
        const handlers = eventListeners.get(app) || [];

        eventListeners.set(
            app,
            handlers.filter((h) => h !== eventData)
        );
    });
}
