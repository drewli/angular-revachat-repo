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
    service.signIn('bradleynwalker1@gmail.com', 'f19K21-tHT_jScz73');
  }

  ngOnInit() {
  }

}
