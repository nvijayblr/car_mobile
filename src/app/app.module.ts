import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FileSelectDirective} from 'ng2-file-upload';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { LandingPage } from '../pages/landing/landing';
import { DashboardPage } from '../pages/external/dashboard/dashboard';
import { SearchClaimPage } from '../pages/external/search-claim/search-claim';
import { CreateClaimPage } from '../pages/external/create-claim/create-claim';
import { InvoiceModalPage } from '../pages/modals/invoice-modal/invoice-modal'
import { AttachmentModalPage } from '../pages/modals/attachment-modal/attachment-modal'
import { TabsPage } from '../pages/tabs/tabs';
import { LogoutpopPage } from '../pages/modals/logoutpop/logoutpop';
import { TooltipPage } from '../pages/modals/tooltip/tooltip';

/*Internal Pages*/
import { InternalDashboardPage } from '../pages/internal/internal-dashboard/internal-dashboard';
import { InternalSearchPage } from '../pages/internal/internal-search/internal-search';
import { AccidentPage } from '../pages/internal/accident/accident';
import { HazardPage } from '../pages/internal/hazard/hazard';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CommonProvider } from '../providers/common/common';
import { HttpProvider } from '../providers/http/http';
import { Constant } from '../providers/constant/constant';
import { UrlGeneratorProvider } from '../providers/url-generator/url-generator';
 
import { PaginationModule } from 'ngx-bootstrap/pagination';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/languages/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    LandingPage,
    DashboardPage,
    SearchClaimPage,
    CreateClaimPage,
    InvoiceModalPage,
    AttachmentModalPage,
    TabsPage,
    LogoutpopPage,
    TooltipPage,
    FileSelectDirective,
    InternalDashboardPage,
    InternalSearchPage,
    AccidentPage,
    HazardPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    PaginationModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    LandingPage,
    DashboardPage,
    SearchClaimPage,
    CreateClaimPage,
    InvoiceModalPage,
    AttachmentModalPage,
    TabsPage,
    LogoutpopPage,
    TooltipPage,
    InternalDashboardPage,
    InternalSearchPage,
    AccidentPage,
    HazardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonProvider,
    HttpProvider,
    Constant,
    UrlGeneratorProvider,
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    InAppBrowser
  ]
})
export class AppModule {}
