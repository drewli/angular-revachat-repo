import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TestComponent } from './components/test/test.component';
import { CognitoService } from './services/cognito.service';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    CognitoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
