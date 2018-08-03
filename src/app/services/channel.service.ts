import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Channel } from '../models/channel';
import { environment } from '../../environments/environment';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  channel: BehaviorSubject<Channel> = new BehaviorSubject<Channel>({id: 1, isDirectMessaging: 'false', name: 'General'});
  allChannels: BehaviorSubject<Channel[]> = new BehaviorSubject<Channel[]>([]);

  constructor(private http: HttpClient) { }

  createChannel(channel: Channel): Observable<Channel> {
    console.log(`[LOG] - Creating channel ${channel.name}`);
    const json = JSON.stringify(channel);
    return this.http.post<Channel>(environment.apiUrl + 'channels', json, HTTP_OPTIONS);
  }

  loadChannels() {
    console.log('[LOG] - In ChannelService.loadChannels()');
    this.http.get<Channel[]>(environment.apiUrl + 'channels', HTTP_OPTIONS).subscribe(channels => {
      this.allChannels.next(channels);
    });
  }
}
