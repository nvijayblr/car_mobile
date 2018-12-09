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
import { InternalSearchPage } from '../../internal/internal-search/internal-search';
import { AccidentPage } from '../../internal/accident/accident';
import { HazardPage } from '../../internal/hazard/hazard';
import { LandingPage } from '../../landing/landing';
import { LogoutpopPage } from '../../modals/logoutpop/logoutpop';
var InternalDashboardPage = /** @class */ (function () {
    function InternalDashboardPage(navCtrl, common, actionSheetCtrl, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.common = common;
        this.actionSheetCtrl = actionSheetCtrl;
        this.popoverCtrl = popoverCtrl;
        this.claimsList = [];
    }
    InternalDashboardPage.prototype.ionViewWillEnter = function () {
        this.common.hideLoader();
        this.getLatestClaims();
    };
    InternalDashboardPage.prototype.getLatestClaims = function () {
        var _this = this;
        this.common.showLoader();
        var searchObject = {
            'LatestFiveClaim': true
        };
        this.common.http.doPost(this.common.url.getInternalSearchClaimURL(), searchObject, function (response) {
            if (response && response.ClaimDetails) {
                _this.claimsList = response.ClaimDetails;
            }
            _this.common.hideLoader();
        }, function (error) {
            _this.common.hideLoader();
            _this.common.showToast(error.ResponseMessage);
        });
    };
    InternalDashboardPage.prototype.gotoSearchClaim = function () {
        this.navCtrl.push(InternalSearchPage);
    };
    InternalDashboardPage.prototype.gotoCreateClaim = function (_ClaimTypeId) {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Select Claim Type',
            buttons: [
                {
                    text: 'Accident Declaration',
                    handler: function () {
                        _this.navCtrl.push(AccidentPage, { claimTypeId: 1, isViewMode: false });
                    }
                },
                {
                    text: 'Hazard Identification',
                    handler: function () {
                        _this.navCtrl.push(HazardPage, { claimTypeId: 1, isViewMode: false });
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
    InternalDashboardPage.prototype.gotoClaimPage = function (_claimType, _complaintNumber) {
        if (_claimType == 'Accident Declaration') {
            this.navCtrl.push(AccidentPage, { complaintNumber: _complaintNumber, isViewMode: true });
        }
        else {
            this.navCtrl.push(HazardPage, { complaintNumber: _complaintNumber, isViewMode: true });
        }
    };
    InternalDashboardPage.prototype.gotoBackPage = function () {
        this.navCtrl.push(LandingPage);
    };
    InternalDashboardPage.prototype.presentPopover = function () {
        var popover = this.popoverCtrl.create(LogoutpopPage);
        popover.present();
    };
    InternalDashboardPage = __decorate([
        Component({
            selector: 'page-internal-dashboard',
            templateUrl: 'internal-dashboard.html',
        }),
        __metadata("design:paramtypes", [NavController,
            CommonProvider,
            ActionSheetController,
            PopoverController])
    ], InternalDashboardPage);
    return InternalDashboardPage;
}());
export { InternalDashboardPage };
//# sourceMappingURL=internal-dashboard.js.map