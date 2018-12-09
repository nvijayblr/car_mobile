import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { ToastController, NavController } from 'ionic-angular/index';
import { LoginPage } from '../../pages/login/login';

@Injectable()
export class HttpProvider {
	private navCtrl: NavController;
	public toast;

	constructor(public http: HttpClient, private appView:App, public toastCtrl:ToastController) {
		this.navCtrl = this.appView.getActiveNav();
	}

	getHeader() {
		let authToken = '';
		if(localStorage.getItem("AuthToken")) {
		  authToken = (localStorage.getItem("AuthToken"));
		}
		let header = {
		  Authorization : authToken,
		  'Content-Type':'application/json'
		} 
		return header;
	}


	forkGet(apiUrl) {
		return this.http.get(apiUrl, {headers : this.getHeader()});
	}

	doGet(apiUrl, successCallback, failureCallback) {
		this.http.get(apiUrl, {headers : this.getHeader()}).subscribe(response => {
    		successCallback(response);
		}, error => {
			this.showToast('Oops! something went wrong.', 'error');
			failureCallback(error);
  		});
	}

	doPost(apiUrl, data, successCallback, failureCallback) {
		this.http.post(apiUrl, data, {headers : this.getHeader()}).subscribe(response => {
    		successCallback(response);
		}, error => {
			if(error && error.status == 401 && error.statusText == 'Unauthorized') {
				this.showToast('Unauthorized access.', 'error');
				this.doLogout();
				return;
			}
			failureCallback(error);
			this.showToast('Oops! something went wrong.', 'error');
  		});
	}

	doLogout() {
      	localStorage.removeItem("userData");
        localStorage.removeItem("AuthToken");     
		localStorage.removeItem("userName");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("lang");
	    this.navCtrl.setRoot(LoginPage);
	    this.navCtrl.popToRoot;
	}
	showToast(_message, _type?, _position?, _duration?) {
	   this.toast = this.toastCtrl.create({
	    message: _message,
	    cssClass: _type ? _type : '',
	    position: _position ? _position : 'top',
	    duration: _duration ? _duration : 3000,
	    dismissOnPageChange: true,
	    showCloseButton: true,
	    closeButtonText: 'x'
	  });

	  this.toast.onDidDismiss(() => {
	  });
	  this.toast.present();
	}

	clearToast() {
		this.toast.hide()
	}
}
