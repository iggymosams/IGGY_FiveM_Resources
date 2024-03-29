import { writable } from "svelte/store";

type NotificationType = "SUCCESS" | "ERROR";

export interface notification {
    id: string;
    message: string;
    type: NotificationType;
    duration: number;
}

export const notifications = writable<notification[]>([]);

export function sendNotification(
    message: string,
    type: NotificationType,
    duration = 3000
) {
    let id = randomID();

    const notification: notification = {
        id: id,
        message: message,
        type: type,
        duration: duration,
    };

    notifications.update((current) => {
        const updated = [...current, notification];

        setTimeout(() => {
            notifications.update((n) => n.filter((n) => n.id !== id));
        }, duration);

        return updated;
    });
}

function randomID() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}
