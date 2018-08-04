import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Materials
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { 
  MatDialog,
  MatToolbarModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { CognitoService } from './services/cognito.service';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatComponent } from './components/chat/chat.component';
import { SocketService } from './services/socket.service';
import { ChannelMenuComponent } from './components/channel-menu/channel-menu.component';
import { UserService } from './services/user.service';
import { ChannelService } from './services/channel.service';
import { DialogChannelComponent } from './components/dialog-channel/dialog-channel.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    NavbarComponent,
    ChatComponent,
    ChannelMenuComponent,
    DialogChannelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule
  ],
  providers: [
    CognitoService,
    SocketService,
    UserService,
    ChannelService,
    MatDialog
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogChannelComponent]
})
export class AppModule { }
