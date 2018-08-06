import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Invite } from '../models/invite';
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
export class InviteService {

  invites: BehaviorSubject<Invite[]> = new BehaviorSubject<Invite[]>([]);

  constructor(private http: HttpClient) { }

  createInvite(invite: Invite): Observable<Invite> {
    console.log('[LOG] - In InviteService.createInvite()');
    const json = JSON.stringify(invite);
    return this.http.post<Invite>(environment.apiUrl + 'invites', json, HTTP_OPTIONS);
  }

  loadInvites() {
    console.log('[LOG] - In InviteService.loadInvites()');
    this.http.get<Invite[]>(environment.apiUrl + 'invites', HTTP_OPTIONS).subscribe(
      invitesVariable => {
        this.invites.next(invitesVariable);
      }
    );
  }

  deleteInvite(id: number): Observable<Invite> {
    console.log('[LOG] - In InviteService.deleteInvite(id)');
    return this.http.delete<Invite>(environment.apiUrl + `invites/${id}`, HTTP_OPTIONS);
  }
}
