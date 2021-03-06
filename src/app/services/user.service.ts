import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CognitoService } from './cognito.service';
import { CognitoIdToken } from 'amazon-cognito-identity-js';


const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  subscribers: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private cognitoService: CognitoService, private http: HttpClient) { }

  registerCognito(user: User, password: string) {
    console.log('In UserService.registerCognito()');
    this.cognitoService.registerUser(user.email, user.username, password, user.firstName, user.lastName);
  }

  signInCognito(email: string, password: string): BehaviorSubject<CognitoIdToken> {
    console.log('In UserService.signInCognito()');
    return this.cognitoService.signIn(email, password);
  }

  registerUser(user: User): Observable<User> {
    console.log(`Attempting to register user: ${user.username}`);
    const json = JSON.stringify(user);
    return this.http.post<User>(environment.apiUrl + 'users', json, HTTP_OPTIONS);
  }

  loginUser(creds: string[]): Observable<User> {
    console.log(`Attempting to login user: ${creds[0]}`);
    const json = JSON.stringify(creds);
    return this.http.post<User>(environment.apiUrl + 'login', json, HTTP_OPTIONS);
  }

  getUserById(id: number) {
    console.log('In UserService.getUserById()');
    const json = JSON.stringify(id);
    return this.http.post<User>(environment.apiUrl + 'userForReimbursement.loadinfo', json, HTTP_OPTIONS);
  }

  getAllUsers() {
    console.log('In UserService.getAllUsers()');
    const json = '';
    return this.http.post<User[]>(environment.apiUrl + 'allUsers.loadinfo', json, HTTP_OPTIONS);
  }

  isUsernameAvailable(usr: string) {
    const json = JSON.stringify(usr);
    return this.http.post<string>(environment.apiUrl + 'username.validate', json, HTTP_OPTIONS);
  }
}
