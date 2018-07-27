import { Injectable } from '@angular/core';
import * as AWSCognito from 'amazon-cognito-identity-js';
// import { CognitoAuth } from 'amazon-cognito-auth-js';
import { BehaviorSubject } from 'rxjs';
import { CognitoAuthSession } from 'amazon-cognito-auth-js';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  userStream: BehaviorSubject<AWSCognito.CognitoUser> = new BehaviorSubject<AWSCognito.CognitoUser>(null);

  private userPool: AWSCognito.CognitoUserPool;

  constructor() {
    console.log('[LOG] - Constructing cognito service');
    const poolData = {
      UserPoolId : 'us-east-2_jgehXhpp7',
      ClientId : '1mk39hkeguvcmkdkmobcg5e40m'
    };

    this.userPool = new AWSCognito.CognitoUserPool(poolData);

  }

  createUser(email: string, username: string, password: string) {
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

    const emailAttribute = new AWSCognito.CognitoUserAttribute(emailData);
    const usernameAttribute = new AWSCognito.CognitoUserAttribute(usernameData);

    attributeList.push(emailAttribute);
    attributeList.push(usernameAttribute);

    let cognitoUser;

    this.userPool.signUp(username, password, attributeList, null, function(err, result) {
      if (err) {
        this.userStream.next(null);
        // alert(err.message);
        console.log('[ERROR] - Failed to create cognito user');
        return;
      }
      cognitoUser = result.user;
      this.userStream.next(cognitoUser);
      localStorage.setItem('cognito_user', cognitoUser);
      console.log('[LOG] - Created cognito user');
    });
  }

  signIn(email: string, password: string) {
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

    let accessToken;

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(session: AWSCognito.CognitoUserSession) {
        accessToken = session.getAccessToken().getJwtToken();
        console.log(accessToken);
        // cognitoUser.getUserAttributes(function(callBack){
        //   console.log(callBack.message);
        // });
      },
      onFailure: function(err: any) {
        console.log('onFailure');
      }
    });
  }
}
