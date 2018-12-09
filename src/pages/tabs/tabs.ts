import { Component } from '@angular/core';

import { LoginPage } from '../login/login';
import { LandingPage } from '../landing/landing';
import { DashboardPage } from '../external/dashboard/dashboard';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LoginPage;
  tab2Root = LandingPage;
  tab3Root = DashboardPage;

  constructor() {

  }
}
