import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LandingPage } from '../landing/landing';
import { CommonProvider } from '../../providers/common/common';
import { Constant } from '../../providers/constant/constant';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public removeView : any;

  public login = {
		username: '',
		password: '',
    DomainID: '',
    // LanguageCulture: '1'
	}
  public domainList = [];
  // public languageList = [];
  public rememberMe = false;
  // public removeView : any;

  constructor(public navCtrl: NavController, public common: CommonProvider, public constant: Constant) {
  }

  //ngOnInit, ionViewDidLoad
  ngOnInit() {
    this.navCtrl.popToRoot();
    this.common.hideLoader();
    if(localStorage.getItem("userData") && localStorage.getItem("AuthToken") && localStorage.getItem("Weightage")) {
      this.common.setExternalWeightage();
      this.common.setInternalWeightage();
      this.navCtrl.push(LandingPage);
    } else {
      this.getAllDomain();
      localStorage.removeItem("userData");
      localStorage.removeItem("AuthToken");
    }
  }

  // getAllLanguages() {
  //   this.common.showLoader();
  //   this.common.http.doGet(this.common.url.getLanguageList(), response => {
  //     this.languageList = response ? response : [];
  //     let localLang = localStorage.getItem('lang')
  //     this.login.LanguageCulture = (localLang)?localLang:"en-US";
  //     this.common.hideLoader();
  //   }, error => {
  //     console.log(error);
  //     this.common.hideLoader();
  //   });
  // }

  getAllDomain() {
    this.common.showLoader();
    this.common.http.doGet(this.common.url.getDomainListUrl(), response => {
      this.domainList = response.Data ? response.Data : [];
      this.common.hideLoader();
      let storedUser:any = JSON.parse(localStorage.getItem('arcuser'));
      if(storedUser && storedUser.username && storedUser.DomainID) {
        this.login.DomainID = storedUser.DomainID;
        this.login.username = storedUser.username;
        this.rememberMe = storedUser.rememberMe;
      }
      // this.getAllLanguages();
    }, error => {
      console.log(error);
      this.common.hideLoader();
    });
  }

  doLogin(_login) {
    if(!_login.username) {
      this.common.showToast('Please enter valid username');
      return;
    }
    if(!_login.password) {
      this.common.showToast('Please enter valid password');
      return;
    }
  	if(!_login.DomainID) {
      this.common.showToast('Please Choose domain name');
      return;
    }
    this.common.showLoader();
    this.common.http.doPost(this.common.url.getLoginUserURL(), _login, response => {
      if(response.ResponseCode !== 200) {
        this.common.hideLoader();
        this.common.showToast('Invalid username/password.',"error");
        return;
      }
      if(response.Data) {
        localStorage.setItem("userData", JSON.stringify(response.Data));
        var data = JSON.parse(response.Data);
        localStorage.setItem("AuthToken", 'Bearer ' + data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        // localStorage.setItem("lang", this.login.LanguageCulture);
        if(this.rememberMe) {
          delete _login.password;
          _login.rememberMe = this.rememberMe;
          localStorage.setItem("arcuser", JSON.stringify(_login));
        } else {
          localStorage.removeItem("arcuser");
        }
        /*Begin the Get user weightage*/
        this.common.http.doGet(this.common.url.getWeightageListURL(), response => {
          if(response.Data) {
            this.setUserWeightage(response);
          }
        }, error => {
          this.setUserWeightage('', error);
        });
        /*End the Get user weightage*/
      }
    }, error => {
      this.setUserWeightage('', error);
    });
  }

  setUserWeightage(_response, _error?) {
    this.common.hideLoader();
    if(_response) {
      if (_response.ResponseCode === 200) {
          var weightage = _response.Data;
          localStorage.setItem("Weightage",JSON.stringify(weightage));
          localStorage.setItem("fullName", _response.Data.FullName);
          localStorage.removeItem('lang');          
          localStorage.setItem("lang",_response.Data.LanguageCulture);
          this.common.setExternalWeightage();
          this.common.setInternalWeightage();
          this.navCtrl.push(LandingPage);
      } else {
        this.common.showToast(_response.ResponseMessage);
      } 
    } else {
      this.common.showToast(_response.Message ? _response.Message : 'Login Failed');
    }
  }

}

