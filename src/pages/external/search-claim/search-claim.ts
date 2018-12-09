import { Component, ViewChild } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common'
import { CreateClaimPage } from '../../external/create-claim/create-claim'
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  selector: 'page-search-claim',
  templateUrl: 'search-claim.html',
})
export class SearchClaimPage {
  @ViewChild(Navbar) navBar: Navbar;

  public searchFilters = {
    'CustomerName': '',
    'ClaimInitiationFrom': moment().subtract(2, 'week').toISOString(),
    'ClaimInitiationTo': moment().toISOString(),
    'ClaimTypeId': '4',
    'ComplaintNumber': '',
    'InvoiceNumber': '',
    'StatusID': '0',
    'CategoryID': '0',
    'Initiator': '',
    'NoOfDays': '',
    'GlobalSerach':'',
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
	public claimCategoryList = [];
	public claimTypeList = [];

  constructor(public navCtrl: NavController, public common:CommonProvider) {
  }
  ionViewWillEnter() {

    this.common.hideLoader();

    /*If we comming back from edit claim, we should maintain the same state of results page*/
    if(!this.showSearchFilters) {
      this.doClaimSearch(this.searchFilters);
    } else {
      this.getAllDropdownData();
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
      'CustomerName': '',
      'ClaimInitiationFrom': moment().subtract(2, 'week').toISOString(),
      'ClaimInitiationTo': moment().toISOString(),
      'ClaimTypeId': '4',
      'ComplaintNumber': '',
      'InvoiceNumber': '',
      'StatusID': '0',
      'CategoryID': '0',
      'Initiator': '',
      'NoOfDays': '',
      'GlobalSerach':'',
      'PageSize':10,
      'PageNum':1,
      'SortingColumn':'ClaimId',
      'SortingOrder':'D'
    }  
  }

  getAllDropdownData(): void {
    this.common.showLoader();
    forkJoin([
      this.common.http.forkGet(this.common.url.getClaimStatusURL()), 
      this.common.http.forkGet(this.common.url.getClaimCategoryURL())
      ]).subscribe(results => {

        let dataObject:any = results[0];
        this.claimStatusList = dataObject.Data ? dataObject.Data : [];

        dataObject = results[1];
        this.claimCategoryList = dataObject.Data ? dataObject.Data : [];
        
        this.common.hideLoader();
      }, error => {
        this.common.hideLoader();
        if(error && error.status == 401 && error.statusText == 'Unauthorized') {
          this.common.showToast('Unauthorized access.', 'error');
          this.common.http.doLogout();
          return;
        }
        this.common.showToast('Oops! something went wrong.')
      });

  }

  doClaimSearch(_searchFilters): void {
    if(this.initiateDateValidate(_searchFilters.ClaimInitiationFrom, _searchFilters.ClaimInitiationTo)) {
      return;
    }
    this.claimsList = [];
    this.shownGroup = null;
  	this.common.showLoader();
    _searchFilters.ClaimInitiationFrom  =  moment(_searchFilters.ClaimInitiationFrom).format('MM/DD/YYYY');
    _searchFilters.ClaimInitiationTo = moment(_searchFilters.ClaimInitiationTo).format('MM/DD/YYYY');
    this.common.http.doPost(this.common.url.getSearchClaimURL(), _searchFilters, response => {
      if(response.Data && response.Data.ResultList) {
      	this.claimsList = response.Data.ResultList;
        this.pagination.totalItems = response.Data.TotalRows;
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
          this.common.showToast("Initiation To Date must be greater than or equal to Initiation From Date");
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

  gotoClaimPage(_complaintNumber): void {
    this.navCtrl.push(CreateClaimPage, {complaintNumber: _complaintNumber, isViewMode: true});
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
