import {useState, useEffect} from 'react';
import {io, Socket} from 'socket.io-client';

export default function useWebSocket(url: string | undefined) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!url) {
            console.log("No url found. Returning...");
            return;
        }
        
        console.log('Socket initialising to url ' + url + '.')

        const socketClient = io(url, {
            transports: ["websocket", "polling"],
            upgrade: true
        });

        socketClient.on('connect', () => {
            console.log('Connected to server');
        });

        socketClient.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        setSocket(socketClient);

        return () => {
            socketClient.close();
        }
    }, [])

    return socket
}