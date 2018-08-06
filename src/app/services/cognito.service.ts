import { Injectable } from '@angular/core';
import * as AWSCognito from 'amazon-cognito-identity-js';
// import { CognitoAuth } from 'amazon-cognito-auth-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { CognitoAuthSession } from 'amazon-cognito-auth-js';
import { CognitoIdToken } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  // userStream: BehaviorSubject<AWSCognito.CognitoUser> = new BehaviorSubject<AWSCognito.CognitoUser>(null);

  private userPool: AWSCognito.CognitoUserPool;

  constructor() {
    console.log('[LOG] - Constructing cognito service');

    // ======================= POTENTIAL SECURITY RISK =======================
    const poolData = {
      UserPoolId : 'us-east-2_f2AlRFIT4',
      ClientId : '3fn7s9dc76u378r187hr2rv0b3'
    };

    this.userPool = new AWSCognito.CognitoUserPool(poolData);
    
  }

  registerUser(email: string, username: string, password: string, fn: string, ln: string) {
    console.log('[LOG] - In CognitoService.registerUser()');
    const attributeList = [];

    const emailData = {
      Name: 'email',
      Value: email
    };

    const usernameData = {
      Name: 'preferred_username',
      Value: username
    };

    const fnData = {
      Name: 'given_name',
      Value: fn
    };

    const lnData = {
      Name: 'family_name',
      Value: ln
    };

    const emailAttribute = new AWSCognito.CognitoUserAttribute(emailData);
    const usernameAttribute = new AWSCognito.CognitoUserAttribute(usernameData);
    const fnAttribute = new AWSCognito.CognitoUserAttribute(fnData);
    const lnAttribute = new AWSCognito.CognitoUserAttribute(lnData);

    attributeList.push(emailAttribute);
    attributeList.push(usernameAttribute);
    attributeList.push(fnAttribute);
    attributeList.push(lnAttribute);

    let cognitoUser;

    this.userPool.signUp(email, password, attributeList, null, function(err, result) {
      if (err) {
        console.log('[ERROR] - Failed to create cognito user');
        console.log(err.message);
        return;
      }

      cognitoUser = result.user;
      console.log('[LOG] - Created cognito user');
    });
  }

  signIn(email: string, password: string): BehaviorSubject<CognitoIdToken> {
    const userData = {
      Username: email,
      Pool: this.userPool
    };

    const authenticationData = {
      Username: email,
      Password: password
    };

    const authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);

    const cognitoUser = new AWSCognito.CognitoUser(userData);

    const obs = new BehaviorSubject<CognitoIdToken>(null);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(session: AWSCognito.CognitoUserSession) {
        console.log('[LOG] - Cognito login succeeded');
        obs.next(session.getIdToken());
      },
      onFailure: function(err: any) {
        console.log('[ERROR] - Failed to authenticate user');
        obs.next(new CognitoIdToken({IdToken: ''}));
      }
    });

    return obs;
  }
}
