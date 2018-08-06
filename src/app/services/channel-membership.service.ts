import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChannelMembership } from '../models/channel-membership';
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
export class ChannelMembershipService {

  channelMemberships: BehaviorSubject<ChannelMembership[]> = new BehaviorSubject<ChannelMembership[]>([]);

  constructor(private http: HttpClient) { }

  createChannelMembership(membership: ChannelMembership): Observable<ChannelMembership> {
    console.log('[LOG] - In ChannelMembershipService.createChannelMembership()');
    const json = JSON.stringify(membership);
    console.log(json);
    return this.http.post<ChannelMembership>(environment.apiUrl + 'channel-memberships', json, HTTP_OPTIONS);
  }

  loadChannelMemberships() {
    console.log('[LOG] - In ChannelMembershipService.loadChannelMemberships()');
    this.http.get<ChannelMembership[]>(environment.apiUrl + 'channel-memberships', HTTP_OPTIONS).subscribe(
      memberships => {
        this.channelMemberships.next(memberships);
      }
    );
  }
}
