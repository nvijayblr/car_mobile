import { Component } from '@angular/core';
import { NavController, ActionSheetController, PopoverController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common'
import { InternalSearchPage } from '../../internal/internal-search/internal-search'
import { AccidentPage } from '../../internal/accident/accident'
import { HazardPage } from '../../internal/hazard/hazard'
import { LandingPage } from '../../landing/landing'
import { LogoutpopPage } from '../../modals/logoutpop/logoutpop'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-internal-dashboard',
  templateUrl: 'internal-dashboard.html',
})
export class InternalDashboardPage {
  
  public translation:any = {};
  public claimsList = [];
  public claimTypesList = [];

  constructor(public navCtrl: NavController, 
  	public common: CommonProvider, 
  	public actionSheetCtrl: ActionSheetController, 
  	public popoverCtrl: PopoverController, public translate: TranslateService) {

    this.getTranslateMessages();
  }

    ionViewWillEnter() {
      this.common.hideLoader();
      this.getClaimTypeList();
    	
    }

    getTranslateMessages() {
      this.translate.get('dashboard.selectClaimType').subscribe(value => {
          this.translation.selectClaimType = value;
      });
      this.translate.get('dashboard.accidentDeclaration').subscribe(value => {
          this.translation.accidentDeclaration = value;
      });
      this.translate.get('dashboard.hazardIdentification').subscribe(value => {
          this.translation.hazardIdentification = value;
      });
      this.translate.get('common.cancel').subscribe(value => {
          this.translation.cancel = value;
      });
    }

    getClaimTypeList(): void {
      this.common.showLoader();
      this.common.http.doGet(this.common.url.getInternalClaimType(), response => {
        this.claimTypesList = response;
        this.getLatestClaims();
      }, error => {
        this.claimTypesList = [];
        this.getLatestClaims();
      });
    }

    getLatestClaims(): void {
      let searchObject = {
        'LatestFiveClaim': true
      }
     
      this.common.http.doPost(this.common.url.getInternalSearchClaimURL(), searchObject, response => {
        if(response && response.ClaimDetails) {
        	this.claimsList = response.ClaimDetails;
        }
        this.common.hideLoader();
      }, error => {
        this.common.hideLoader();
        this.common.showToast(error.ResponseMessage);
      });
    }

    gotoSearchClaim(): void {
      this.navCtrl.push(InternalSearchPage);
    }

    gotoCreateClaim(_ClaimTypeId?): void {
      
      let actionSheetButtons:any = [];

       for(let i=0; i<this.claimTypesList.length; i++) {
         /*Adding Accident Button*/
         if(this.claimTypesList[i].Id == 1) {
           actionSheetButtons.push({
             text: this.translation.accidentDeclaration,
             handler: () => {
               this.navCtrl.push(AccidentPage, {claimTypeId: 1, isViewMode: false});
             }
           })
         }
         /*Adding Hazard Button*/
         if(this.claimTypesList[i].Id == 2) {
           actionSheetButtons.push({
             text: this.translation.hazardIdentification,
             handler: () => {
               this.navCtrl.push(HazardPage, {claimTypeId: 2, isViewMode: false});
             }
           })
         }
       }
       /*Adding Cancel Button*/
       actionSheetButtons.push({
         text: this.translation.cancel,
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       });

      let actionSheet = this.actionSheetCtrl.create({
        title: this.translation.selectClaimType,
        buttons: actionSheetButtons
     });

     actionSheet.present();

    }

    gotoClaimPage(_claimTypeId, _complaintNumber): void {
      if(_claimTypeId == 1) {
        this.navCtrl.push(AccidentPage, {complaintNumber: _complaintNumber, isViewMode: true});
      } else {
        this.navCtrl.push(HazardPage, {complaintNumber: _complaintNumber, isViewMode: true});
      }
    }

    gotoBackPage() {
      this.navCtrl.push(LandingPage);
    }

		presentPopover() {
			let popover = this.popoverCtrl.create(LogoutpopPage);
			popover.present();
		}

}
