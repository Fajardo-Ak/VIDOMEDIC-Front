// public/sw.js

self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const data = event.data ? event.data.json() : {};
    
    // Configuración de la alerta visual
    const title = data.title || 'VIDOMEDI';
    const options = {
        body: data.body || 'Tienes una nueva notificación.',
        icon: '/logoazul.png', // Asegúrate de que este logo exista en public
        badge: '/logoazul.png', // Icono pequeño para la barra de estado (Android)
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/inicio' // A donde nos lleva al hacer clic
        },
        actions: [
            { action: 'explore', title: 'Ver ahora' }
        ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Si ya hay una pestaña abierta, la enfoca
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Si no, abre una nueva
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});