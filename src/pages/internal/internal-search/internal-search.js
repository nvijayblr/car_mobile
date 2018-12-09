var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IonicPage, NavController, Navbar } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { CommonProvider } from '../../../providers/common/common';
import { AccidentPage } from '../../internal/accident/accident';
import { HazardPage } from '../../internal/hazard/hazard';
import * as moment from 'moment';
var InternalSearchPage = /** @class */ (function () {
    function InternalSearchPage(navCtrl, common) {
        this.navCtrl = navCtrl;
        this.common = common;
        this.searchFilters = {
            'GlobalSearch': '',
            'ClaimInitationFromDate': moment().subtract(2, 'week').toISOString(),
            'ClaimInitationToDate': moment().toISOString(),
            'ClaimType': '0',
            'ReferenceNo': '',
            'ClaimStatus': '0',
            'EmployeeName': '',
            'PageSize': 10,
            'PageNum': 1,
            'SortingColumn': 'ClaimId',
            'SortingOrder': 'D'
        };
        this.pagination = {
            maxPages: 5,
            totalItems: 0,
            currentPage: 1,
            itemsPerPage: 10
        };
        this.claimsList = [];
        this.showSearchFilters = true;
        this.claimStatusList = [];
        this.claimTypesList = [];
        /*Expand/collapse lists*/
        this.shownGroup = null;
    }
    InternalSearchPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.common.hideLoader();
        this.getClaimTypeList();
        this.getClaimStatusList();
        /*Back button action*/
        this.navBar.backButtonClick = function (e) {
            if (_this.showSearchFilters) {
                _this.navCtrl.pop();
            }
            else {
                _this.showSearchFilters = !_this.showSearchFilters;
            }
        };
    };
    InternalSearchPage.prototype.resetClicked = function () {
        this.searchFilters = {
            'GlobalSearch': '',
            'ClaimInitationFromDate': moment().subtract(2, 'week').toISOString(),
            'ClaimInitationToDate': moment().toISOString(),
            'ClaimType': '0',
            'ReferenceNo': '',
            'ClaimStatus': '0',
            'EmployeeName': '',
            'PageSize': 10,
            'PageNum': 1,
            'SortingColumn': 'ClaimId',
            'SortingOrder': 'D'
        };
    };
    InternalSearchPage.prototype.getClaimTypeList = function () {
        var _this = this;
        this.common.http.doGet(this.common.url.getInternalClaimType(), function (response) {
            _this.claimTypesList = response;
        }, function (error) {
            _this.claimTypesList = [];
        });
    };
    InternalSearchPage.prototype.getClaimStatusList = function () {
        var _this = this;
        this.common.http.doGet(this.common.url.getInternalClaimStatus(), function (response) {
            _this.claimStatusList = response;
        }, function (error) {
            _this.claimStatusList = [];
        });
    };
    InternalSearchPage.prototype.doClaimSearch = function (_searchFilters) {
        var _this = this;
        if (this.initiateDateValidate(_searchFilters.ClaimInitationFromDate, _searchFilters.ClaimInitationToDate)) {
            return;
        }
        this.claimsList = [];
        this.common.showLoader();
        _searchFilters.ClaimInitationFromDate = moment(_searchFilters.ClaimInitationFromDate).format('MM/DD/YYYY');
        _searchFilters.ClaimInitationToDate = moment(_searchFilters.ClaimInitationToDate).format('MM/DD/YYYY');
        this.common.http.doPost(this.common.url.getInternalSearchClaimURL(), _searchFilters, function (response) {
            if (response && response.ClaimDetails) {
                _this.claimsList = response.ClaimDetails;
                _this.pagination.totalItems = response.TotalRows;
                _this.pagination.itemsPerPage = _this.searchFilters.PageSize;
                if (_this.pagination.totalItems > 0) {
                    _this.showSearchFilters = false;
                }
                else {
                    _this.common.showToast('No records found.');
                }
            }
            _this.common.hideLoader();
        }, function (error) {
            _this.common.hideLoader();
            _this.common.showToast(error.ResponseMessage);
        });
    };
    InternalSearchPage.prototype.initiateDateValidate = function (_fromDate, _toDate) {
        if (moment(_toDate).diff(moment(_fromDate)) < 0) {
            this.common.showToast("Initiation To Date must be greater than or equal to Initiation From Date.");
            return true;
        }
        return false;
    };
    InternalSearchPage.prototype.applySearch = function (_searchFilters) {
        this.searchFilters.PageNum = 1;
        this.pagination.currentPage = 1;
        this.doClaimSearch(_searchFilters);
    };
    InternalSearchPage.prototype.paginationChanged = function (_event) {
        this.searchFilters.PageNum = _event.page;
        this.searchFilters.PageSize = _event.itemsPerPage;
        this.doClaimSearch(this.searchFilters);
    };
    InternalSearchPage.prototype.gotoClaimPage = function (_claimType, _complaintNumber) {
        if (_claimType == 'Accident Declaration') {
            this.navCtrl.push(AccidentPage, { complaintNumber: _complaintNumber, isViewMode: true });
        }
        else {
            this.navCtrl.push(HazardPage, { complaintNumber: _complaintNumber, isViewMode: true });
        }
    };
    InternalSearchPage.prototype.gotoBackPage = function () {
        if (this.showSearchFilters) {
            this.navCtrl.pop();
        }
        else {
            this.showSearchFilters = true;
        }
    };
    InternalSearchPage.prototype.toggleGroup = function (group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        }
        else {
            this.shownGroup = group;
        }
    };
    ;
    InternalSearchPage.prototype.isGroupShown = function (group) {
        return this.shownGroup === group;
    };
    ;
    __decorate([
        ViewChild(Navbar),
        __metadata("design:type", Navbar)
    ], InternalSearchPage.prototype, "navBar", void 0);
    InternalSearchPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-internal-search',
            templateUrl: 'internal-search.html',
        }),
        __metadata("design:paramtypes", [NavController, CommonProvider])
    ], InternalSearchPage);
    return InternalSearchPage;
}());
export { InternalSearchPage };
//# sourceMappingURL=internal-search.js.map