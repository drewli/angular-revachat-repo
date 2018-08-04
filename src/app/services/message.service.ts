import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

  constructor(private http: HttpClient) { }

  createMessage(message: Message): Observable<Message> {
    console.log('[LOG] - Creating message');
    const json = JSON.stringify(message);
    return this.http.post<Message>(environment.apiUrl + 'messages', json, HTTP_OPTIONS);
  }

  loadMessages() {
    console.log('[LOG] - In MessageService.loadMessages()');
    this.http.get<Message[]>(environment.apiUrl + 'messages', HTTP_OPTIONS).subscribe(messages => {
      this.messages.next(messages);
    })
  }
}
