import { Component } from '@angular/core';
import { NavController, ActionSheetController, PopoverController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common'
import { SearchClaimPage } from '../../external/search-claim/search-claim'
import { CreateClaimPage } from '../../external/create-claim/create-claim'
import { LandingPage } from '../../landing/landing'
import { LogoutpopPage } from '../../modals/logoutpop/logoutpop'

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  constructor(public navCtrl: NavController, public common: CommonProvider, public actionSheetCtrl: ActionSheetController, public popoverCtrl: PopoverController) {
  }

  ionViewWillEnter() {
    this.common.hideLoader();
  	this.getLatestClaims();
  }

  	public claimsList = [];

    getLatestClaims(): void {
    	this.common.showLoader();
      let searchObject = {
        'LatestFiveClaims': true,
        'ClaimTypeId': '4'
      }
     
      this.common.http.doPost(this.common.url.getSearchClaimURL(), searchObject, response => {
        if(response.Data && response.Data.ResultList) {
        	this.claimsList = response.Data.ResultList;
        }
        this.common.hideLoader();
      }, error => {
        this.common.hideLoader();
        this.common.showToast(error.ResponseMessage);
      });
    }

    gotoSearchClaim(): void {
      this.navCtrl.push(SearchClaimPage);
    }

    gotoCreateClaim(_ClaimTypeId?): void {
      let actionSheet = this.actionSheetCtrl.create({
       title: 'Select Claim Type',
       buttons: [
         {
           text: 'Customer',
           handler: () => {
             this.navCtrl.push(CreateClaimPage, {claimTypeId: 4, isViewMode: false});
           }
         },
         {
           text: 'Cancel',
           role: 'cancel',
           handler: () => {
             console.log('Cancel clicked');
           }
         }
       ]
     });

     actionSheet.present();

    }

    gotoClaimPage(_complaintNumber): void {
    	this.navCtrl.push(CreateClaimPage, {complaintNumber: _complaintNumber, isViewMode: true});
    }

    gotoBackPage() {
      this.navCtrl.push(LandingPage);
    }

  presentPopover() {
    let popover = this.popoverCtrl.create(LogoutpopPage, {module: 'External'});
    popover.present();
  }
    
}
