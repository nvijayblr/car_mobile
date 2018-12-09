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
import { NavController, ActionSheetController, PopoverController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { SearchClaimPage } from '../../external/search-claim/search-claim';
import { CreateClaimPage } from '../../external/create-claim/create-claim';
import { LandingPage } from '../../landing/landing';
import { LogoutpopPage } from '../../modals/logoutpop/logoutpop';
var DashboardPage = /** @class */ (function () {
    function DashboardPage(navCtrl, common, actionSheetCtrl, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.common = common;
        this.actionSheetCtrl = actionSheetCtrl;
        this.popoverCtrl = popoverCtrl;
        this.claimsList = [];
    }
    DashboardPage.prototype.ionViewWillEnter = function () {
        this.common.hideLoader();
        this.getLatestClaims();
    };
    DashboardPage.prototype.getLatestClaims = function () {
        var _this = this;
        this.common.showLoader();
        var searchObject = {
            'LatestFiveClaims': true,
            'ClaimTypeId': '4'
        };
        this.common.http.doPost(this.common.url.getSearchClaimURL(), searchObject, function (response) {
            if (response.Data && response.Data.ResultList) {
                _this.claimsList = response.Data.ResultList;
            }
            _this.common.hideLoader();
        }, function (error) {
            _this.common.hideLoader();
            _this.common.showToast(error.ResponseMessage);
        });
    };
    DashboardPage.prototype.gotoSearchClaim = function () {
        this.navCtrl.push(SearchClaimPage);
    };
    DashboardPage.prototype.gotoCreateClaim = function (_ClaimTypeId) {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Select Claim Type',
            buttons: [
                {
                    text: 'Customer',
                    handler: function () {
                        _this.navCtrl.push(CreateClaimPage, { claimTypeId: 4, isViewMode: false });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    DashboardPage.prototype.gotoClaimPage = function (_complaintNumber) {
        this.navCtrl.push(CreateClaimPage, { complaintNumber: _complaintNumber, isViewMode: true });
    };
    DashboardPage.prototype.gotoBackPage = function () {
        this.navCtrl.push(LandingPage);
    };
    DashboardPage.prototype.presentPopover = function () {
        var popover = this.popoverCtrl.create(LogoutpopPage);
        popover.present();
    };
    DashboardPage = __decorate([
        Component({
            selector: 'page-dashboard',
            templateUrl: 'dashboard.html'
        }),
        __metadata("design:paramtypes", [NavController, CommonProvider, ActionSheetController, PopoverController])
    ], DashboardPage);
    return DashboardPage;
}());
export { DashboardPage };
//# sourceMappingURL=dashboard.js.map