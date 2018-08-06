import { Injectable } from '@angular/core';

import * as socketIo from 'socket.io-client';
import { Message } from '../models/message';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

// const SERVER_URL = 'http://localhost:8080';
const SERVER_URL = 'http://ec2-18-219-104-1.us-east-2.compute.amazonaws.com:8772';

@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
        console.log(this.socket);
    }

    public send(message: Message): void {
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<Message> {
        console.log('Message received');
        return new Observable<Message>(observer => {
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    public disconnect() {
        this.socket.disconnect();
    }
}
