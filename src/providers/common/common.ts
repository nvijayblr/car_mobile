import { Injectable } from '@angular/core';
import { HttpProvider } from '../http/http';
import { ToastController, LoadingController } from 'ionic-angular';
import { UrlGeneratorProvider } from '../url-generator/url-generator'

@Injectable()
export class CommonProvider {
	public externalWeightage = 10;
	public internalWeightage = 10;

	constructor (
		public http: HttpProvider, 
		public url:UrlGeneratorProvider, 
		public toastCtrl:ToastController, 
		public loadingCtrl: LoadingController) {
	}

  	public toast;
	public loader;

	showLoader() {
		this.loader = this.loadingCtrl.create({
			showBackdrop: true,
			spinner: 'dots'
		});
		this.loader.present();
	}

	hideLoader() {
		if(this.loader) {
			this.loader.dismiss();
			this.loader = null;
		}
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

	setExternalWeightage() {
		let modules = JSON.parse(localStorage.getItem('Weightage')).ModuleTransactions;
		for(let i=0; i<modules.length; i++) {
			if(modules[i].ModuleCode == 'CLMCR') {
				this.externalWeightage = modules[i].TransactionWeightage;
			}
		}
	}

	setInternalWeightage() {
		let modules = JSON.parse(localStorage.getItem('Weightage')).ModuleTransactions;
		for(let i=0; i<modules.length; i++) {
			if(modules[i].ModuleCode == 'ICLMCR') {
				this.internalWeightage = modules[i].TransactionWeightage;
			}
		}
	}

	getExternalWeightage() {
		return this.externalWeightage;
	}

	getInternalWeightage() {
		return this.internalWeightage;
	}

}
