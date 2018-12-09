var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, PopoverController, Platform } from 'ionic-angular';
import { DashboardPage } from '../external/dashboard/dashboard';
import { InternalDashboardPage } from '../internal/internal-dashboard/internal-dashboard';
import { CommonProvider } from '../../providers/common/common';
import { LogoutpopPage } from '../modals/logoutpop/logoutpop';
import { TranslateService } from '@ngx-translate/core';
var LandingPage = /** @class */ (function () {
    function LandingPage(navCtrl, common, popoverCtrl, platform, translate) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.common = common;
        this.popoverCtrl = popoverCtrl;
        /*Android Back key handling*/
        platform.registerBackButtonAction(function () {
            _this.common.hideLoader();
            var viewName = _this.navCtrl.getActive().component.name;
            if (viewName == 'LoginPage') {
                platform.exitApp();
                return;
            }
            if (viewName != 'LandingPage') {
                _this.navCtrl.pop();
            }
        }, 1);
        /*Language Setting*/
        translate.setDefaultLang('en-US');
        translate.use(localStorage.getItem("lang") ? localStorage.getItem("lang") : 'en-US');
    }
    LandingPage.prototype.gotoExternal = function () {
        this.navCtrl.push(DashboardPage);
    };
    LandingPage.prototype.gotoInternal = function () {
        this.navCtrl.push(InternalDashboardPage);
    };
    LandingPage.prototype.presentPopover = function () {
        var popover = this.popoverCtrl.create(LogoutpopPage);
        popover.present();
    };
    LandingPage = __decorate([
        Component({
            selector: 'page-landing',
            templateUrl: 'landing.html'
        }),
        __metadata("design:paramtypes", [NavController,
            CommonProvider,
            PopoverController,
            Platform, TranslateService])
    ], LandingPage);
    return LandingPage;
}());
export { LandingPage };
//# sourceMappingURL=landing.js.map