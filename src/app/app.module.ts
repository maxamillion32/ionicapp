import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomeViewPage} from '../pages/homeview/homeview';
import { AuthService } from '../providers/authservice'; 
import { HomeService } from '../providers/homeservice';
import { HomeViewService } from '../providers/homeviewservice';
import { HomeUsersPage } from '../pages/homeusers/homeusers';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    HomeViewPage,
    HomeUsersPage
    
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    HomeViewPage,
    HomeUsersPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService,HomeService,HomeViewService]
})
export class AppModule {}
