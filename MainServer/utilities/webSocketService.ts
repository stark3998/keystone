import { WebSocket, Server as WebSocketServer } from 'ws';

export class WebSocketService {

    // public static handleWSConnections(wss: WebSocketServer) {
    //     // Handle WebSocket connections
    //     wss.on('connection', (ws) => {
    //         console.log('Client connected');

    //         // Handle messages from the client
    //         ws.on('message', (message) => {
    //             console.log('Received:', message);
    //         });

    //         // Send a message to the client
    //         ws.send('Welcome to the WebSocket server');

    //         // Handle client disconnection
    //         ws.on('close', () => {
    //             console.log('Client disconnected');
    //         });
    //     });

    // }

    public static sendAlertMessage (wss: WebSocketServer, alertMessage: string): void {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(alertMessage);
            }
        });
    };
    
}