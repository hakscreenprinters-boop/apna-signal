const WebSocket = require('ws');
const server = new WebSocket.Server({ port: process.env.PORT || 8080 });
const clients = {};

server.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const id = url.searchParams.get('id') || 'unknown';
    clients[id] = ws;
    console.log('✅ जुड़ा:', id);

    ws.on('message', (msg) => {
        try {
            const data = JSON.parse(msg);
            if (data.to && clients[data.to]) {
                clients[data.to].send(JSON.stringify(data));
            }
        } catch (e) {}
    });

    ws.on('close', () => {
        delete clients[id];
        console.log('❌ गया:', id);
    });
});

console.log('🚀 सिग्नलिंग सर्वर चालू (फ्री)');
