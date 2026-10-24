import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'http';

const bare = createBareServer('/bare/');
const server = http.createServer();

server.on('request', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Servidor Bare activo y privado');
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen({ port: process.env.PORT || 8080 }, () => {
    console.log('Servidor Bare privado en marcha con éxito');
});
