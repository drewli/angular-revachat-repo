import { Component, OnInit } from '@angular/core';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private service: CognitoService) {
    service.login();
  }

  ngOnInit() {
    // let poolData = {
    //   UserPoolId : 'us-east-2_jgehXhpp7',
    //   ClientId : '1mk39hkeguvcmkdkmobcg5e40m'
    // };

    // let userPool = new AWSCognito.CognitoUserPool(poolData);

    // let attributeList = [];

    // let dataEmail = {
    //   Name: 'email',
    //   Value: 'bradleynwalker1@gmail.com'
    // };
    // let dataUsername = {
    //   Name: 'preferred_username',
    //   Value: 'bwalker'
    // };

    // let attributeEmail = new AWSCognito.CognitoUserAttribute(dataEmail);
    // let attributeUsername = new AWSCognito.CognitoUserAttribute(dataUsername);
    // attributeList.push(attributeEmail);
    // attributeList.push(attributeUsername);

    // let cognitoUser;

    // userPool.signUp(dataEmail.Value, 'f19K21-tHT_jScz73', attributeList, null, function(err, result){
    //   if (err) {
    //     alert(err.message);
    //     return;
    //   }
    //   cognitoUser = result.user;
    //   console.log(`Username: ${cognitoUser.getUsername()}`);
    // });
  }

}
