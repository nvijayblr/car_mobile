import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage, NavController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common'
import { TranslateService } from '@ngx-translate/core';
import { LandingPage } from '../../landing/landing';
@Component({
  selector: 'page-logoutpop',
  templateUrl: 'logoutpop.html',
})
export class LogoutpopPage {

  public userName = '';
  public moduleName = '';
  private languageList = [];
  private languageCulture: any;
  private languageName: String;

  constructor(public common: CommonProvider, public viewCtrl: ViewController, public navParams: NavParams,private navCtrl: NavController, private translate: TranslateService) {
	  this.moduleName = this.navParams.get('module');
  }

  ionViewDidLoad() {
    this.userName = localStorage.getItem('fullName') ? localStorage.getItem('fullName') : '';
    this.getAllLanguages();
  }
  getAllLanguages() {
    this.common.showLoader();
    this.common.http.doGet(this.common.url.getLanguageList(), response => {
      this.languageList = response ? response : [];
      if(localStorage.getItem('lang')){
        this.languageCulture = localStorage.getItem('lang');
        this.languageName = this.languageCulture;
      }
      // if(this.languageList && this.languageList.length > 0) {
      //   for(var i=0; i< this.languageList.length; i++){
      //     if(this.languageList[i].Culture == this.languageCulture)
      //     this.languageName = this.languageList[i].Name;
      //   }
      // }
       
      this.common.hideLoader();
    }, error => {
      this.common.hideLoader();
    });
  }
  languageChanged(){
    let request_body = {
      "Token": localStorage.getItem('refresh_token'),
      "LanguageCulture": this.languageCulture,
    }
    this.common.http.doPost(this.common.url.getrefreshTokenURL(), request_body, response => {
     
      if(response.Data) {
        localStorage.removeItem("AuthToken");
        localStorage.removeItem("lang");
        localStorage.removeItem("refresh_token");
        localStorage.setItem("AuthToken", 'Bearer ' + JSON.parse(response.Data).access_token);
        localStorage.setItem("lang",this.languageCulture);
        localStorage.setItem("refresh_token",JSON.parse(response.Data).refresh_token);
    
        this.translate.use(localStorage.getItem("lang"))
        
      }
    }, error => {
      
    });
  }

}
