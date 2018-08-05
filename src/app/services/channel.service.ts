import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Channel } from '../models/channel';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  generalChat: Channel = {channelId: -1, isDirectMessaging: 'false', channelName: 'General'};
  channel: BehaviorSubject<Channel> = new BehaviorSubject<Channel>(this.generalChat);
  allChannels: BehaviorSubject<Channel[]> = new BehaviorSubject<Channel[]>([]);

  constructor(private http: HttpClient) { }

  createChannel(channel: Channel): Observable<Channel> {
    console.log(`[LOG] - Creating channel ${channel.channelName}`);
    const json = JSON.stringify(channel);
    return this.http.post<Channel>(environment.apiUrl + 'channels', json, HTTP_OPTIONS)
    .pipe(
      catchError(this.handleError)
    );
  }

  loadChannels() {
    console.log('[LOG] - In ChannelService.loadChannels()');
    this.http.get<Channel[]>(environment.apiUrl + 'channels', HTTP_OPTIONS).subscribe(channels => {
      this.allChannels.next(channels);
    });
  }

  getChannelById(id: number): Observable<Channel> {
    console.log('[LOG] - In ChannelService.getChannelById()');
    return this.http.get<Channel>(environment.apiUrl + `channels/${id}`, HTTP_OPTIONS);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
      // return new Channel();
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
