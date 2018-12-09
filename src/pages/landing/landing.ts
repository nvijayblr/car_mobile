import { Component } from '@angular/core';
import { NavController, PopoverController, Platform } from 'ionic-angular';
import { DashboardPage } from '../external/dashboard/dashboard';
import { InternalDashboardPage } from '../internal/internal-dashboard/internal-dashboard';
import { CommonProvider } from '../../providers/common/common'
import { LogoutpopPage } from '../modals/logoutpop/logoutpop'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})
export class LandingPage {

  constructor(
    public navCtrl: NavController, 
    public common:CommonProvider, 
    public popoverCtrl: PopoverController, 
    platform:Platform, translate: TranslateService ) {

    /*Android Back key handling*/
    platform.registerBackButtonAction(() => {
      this.common.hideLoader();
      let viewName:any = this.navCtrl.getActive().component.name;
      if(viewName == 'LoginPage') {
        platform.exitApp();
        return;
      }
      if( viewName != 'LandingPage') {
        this.navCtrl.pop();
      } 
    },1);

    /*Language Setting*/
    translate.setDefaultLang('en-US');
    translate.use(localStorage.getItem("lang") ? localStorage.getItem("lang") : 'en-US');
  }

  gotoExternal() {
    this.navCtrl.push(DashboardPage);
  }

  gotoInternal() {
    this.navCtrl.push(InternalDashboardPage);
  }

  presentPopover() {
    let popover = this.popoverCtrl.create(LogoutpopPage);
    popover.present();
  }


}
