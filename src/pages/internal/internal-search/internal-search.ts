import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { CommonProvider } from '../../../providers/common/common'
import { AccidentPage } from '../../internal/accident/accident'
import { HazardPage } from '../../internal/hazard/hazard'
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-internal-search',
  templateUrl: 'internal-search.html',
})
export class InternalSearchPage {

	@ViewChild(Navbar) navBar: Navbar;
  
  public searchFilters = {
    'GlobalSearch':'',
    'ClaimInitationFromDate': moment().subtract(2, 'week').toISOString(),
    'ClaimInitationToDate': moment().toISOString(),
    'ClaimType': '0',
    'ReferenceNo': '',
    'ClaimStatus': '0',
    'EmployeeName': '',
    'PageSize':10,
    'PageNum':1,
		'SortingColumn':'ClaimId',
		'SortingOrder':'D'
  };
  public pagination = {
    maxPages: 5,
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10
  }
  public claimsList = [];
  public showSearchFilters = true;
	public claimStatusList = [];
  public claimTypesList = [];
  public translation:any = {};
  
  constructor(public navCtrl: NavController, public common:CommonProvider, public translate: TranslateService) {
    this.translate.get('searchPage.toDateGreaterThanFrom').subscribe(value => {
        this.translation.toDateGreaterThanFrom = value;
    });
  }
  ionViewWillEnter() {
    this.common.hideLoader();

    /*If we comming back from edit claim, we should maintain the same state of results page*/
    if(!this.showSearchFilters) {
      this.doClaimSearch(this.searchFilters);
    } else {
      this.getClaimTypeList();
      this.getClaimStatusList();
    }

    /*Back button action*/
    this.navBar.backButtonClick = (e:UIEvent)=>{
			if(this.showSearchFilters) {
				this.navCtrl.pop();
			} else {
				this.showSearchFilters = !this.showSearchFilters;
			}
    }
  }

  resetClicked() {
    this.searchFilters = {
      'GlobalSearch':'',
      'ClaimInitationFromDate': moment().subtract(2, 'week').toISOString(),
      'ClaimInitationToDate': moment().toISOString(),
      'ClaimType': '0',
      'ReferenceNo': '',
      'ClaimStatus': '0',
      'EmployeeName': '',
      'PageSize':10,
      'PageNum':1,
      'SortingColumn':'ClaimId',
      'SortingOrder':'D'
    }  
  }

  getClaimTypeList(): void {
    this.common.http.doGet(this.common.url.getInternalClaimType(), response => {
      this.claimTypesList = response;
    }, error => {
      this.claimTypesList = [];
    });
  }

  getClaimStatusList(): void {
    this.common.http.doGet(this.common.url.getInternalClaimStatus(), response => {
      this.claimStatusList = response;
    }, error => {
      this.claimStatusList = [];
    });
  }

  doClaimSearch(_searchFilters): void {
    if(this.initiateDateValidate(_searchFilters.ClaimInitationFromDate, _searchFilters.ClaimInitationToDate)) {
      return;
    }
    this.claimsList = [];
    this.shownGroup = null;
  	this.common.showLoader();
    _searchFilters.ClaimInitationFromDate  =  moment(_searchFilters.ClaimInitationFromDate).format('MM/DD/YYYY');
    _searchFilters.ClaimInitationToDate = moment(_searchFilters.ClaimInitationToDate).format('MM/DD/YYYY');
    this.common.http.doPost(this.common.url.getInternalSearchClaimURL(), _searchFilters, response => {
      if(response && response.ClaimDetails) {
      	this.claimsList = response.ClaimDetails;
        this.pagination.totalItems = response.TotalRows;
        this.pagination.itemsPerPage = this.searchFilters.PageSize;
        if(this.claimsList.length > 0) {
          this.showSearchFilters = false;
        } else {
          this.common.showToast('No records found.')
        }
      }
      this.common.hideLoader();
    }, error => {
      this.common.hideLoader();
      this.common.showToast(error.ResponseMessage);
    });
  }

  initiateDateValidate(_fromDate, _toDate) {
      if(moment(_toDate).diff(moment(_fromDate)) < 0) {
          this.common.showToast(this.translation.toDateGreaterThanFrom);
          return true;
      }
      return false;
  }

  applySearch(_searchFilters) {
    this.searchFilters.PageNum = 1;
    this.pagination.currentPage = 1;
    this.doClaimSearch(_searchFilters);
  }

  paginationChanged(_event) {
    this.searchFilters.PageNum = _event.page;
    this.searchFilters.PageSize = _event.itemsPerPage;
    this.doClaimSearch(this.searchFilters);
  }

  gotoClaimPage(_claimTypeId, _complaintNumber): void {
      if(_claimTypeId == 1 || _claimTypeId == '1') {
        this.navCtrl.push(AccidentPage, {complaintNumber: _complaintNumber, isViewMode: true});
      } else {
        this.navCtrl.push(HazardPage, {complaintNumber: _complaintNumber, isViewMode: true});
      }
  }

  gotoBackPage() {
    if(this.showSearchFilters) {
      this.navCtrl.pop();
    } else {
      this.showSearchFilters = true;
    }
  }

  /*Expand/collapse lists*/
  shownGroup = null;

	toggleGroup(group) {
	    if (this.isGroupShown(group)) {
	        this.shownGroup = null;
	    } else {
	        this.shownGroup = group;
	    }
	};
	
	isGroupShown(group) {
	    return this.shownGroup === group;
	};

}
