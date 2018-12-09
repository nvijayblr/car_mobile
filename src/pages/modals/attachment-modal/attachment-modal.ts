import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-attachment-modal',
  templateUrl: 'attachment-modal.html',
})
export class AttachmentModalPage {

	public attachmentsList = [];
	public queueList:any = [];
	public cameraList = [];
	public claimObjectList = [];
	public deletedImages = [];
	public key:string = '';
	public isViewMode = true;
  public browser:any = '';
  public source = '';
  public translation:any = {};

  constructor(public navParams: NavParams, public viewCtrl:ViewController, public common:CommonProvider, private iab: InAppBrowser, public translate: TranslateService) {
  	this.attachmentsList = this.navParams.get('attachments');
  	this.queueList = this.navParams.get('queue');
  	this.cameraList = this.navParams.get('camera');
  	this.claimObjectList = this.navParams.get('claimObj');
  	this.key = this.navParams.get('key');
    this.isViewMode = this.navParams.get('videMode');
  	this.source = this.navParams.get('source') ? this.navParams.get('source') : '';
    //
    this.translate.get('common.deleteAttachment').subscribe(value => {
      if(this.key == 'Internal')
        this.translation.deleteAttachment = value;
      else 
        this.translation.deleteAttachment = 'Attachment deleted successfully.';

    });
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss(this.deletedImages);
  }
  opneFileInBrowser(_url) {
    let options:any = {location : 'yes', zoom : 'yes', closebuttoncaption : 'Close', toolbar : 'yes'};
    this.browser = this.iab.create(_url, '_system', options)
  }

  deleteImage(_name, filePath, _image, _index) {

  	this.deletedImages.push(_image);

    for (let j = 0; j < this.queueList.length; j++) {
      if (this.queueList[j].file.name === _name) {
        this.queueList.splice(j, 1);
      }
    } 
    /*To remove the camera uploads*/
    for (let j = 0; j < this.cameraList.length; j++) {
      if (this.cameraList[j] === filePath) {
        this.cameraList.splice(j, 1);
      }
    }

    /*To remove the claim objects to save*/
    for (let j = 0; j < this.claimObjectList.length; j++) {
      if (this.claimObjectList[j].FileName === _name) {
        const reqBody = {
          'AttachmentID': this.claimObjectList[j].AttachmentID,
          'Key': this.key ? this.key : ''
        }
        if(this.source == 'accident') {
          delete reqBody.Key;
          reqBody.AttachmentID = [reqBody.AttachmentID]
          this.deleteAccidentAttchamnet(reqBody);
        } else if(this.source == 'hazard') {
          delete reqBody.Key;
          reqBody.AttachmentID = [reqBody.AttachmentID]
          this.deleteHazardAttchamnet(reqBody);
        } else {
          /*Claim Delete Attachemnt*/
          this.deleteAttchamnet(reqBody);
        }
        this.claimObjectList.splice(j, 1);
      }
    }

  	this.attachmentsList.splice(_index, 1);

  	if(!this.attachmentsList.length) {
		    this.viewCtrl.dismiss('');
  	}
  }

  deleteAttchamnet(reqBody): void {
    this.common.showLoader();
    this.common.http.doPost(this.common.url.getDeleteAttachmentURL(), reqBody, response => {
      this.common.showToast(this.translation.deleteAttachment, 'success')
      this.common.hideLoader();
    }, error => {
      this.common.hideLoader();
    });
  }

  deleteAccidentAttchamnet(reqBody): void {
    this.common.showLoader();
    this.common.http.doPost(this.common.url.deleteAccidentAttachment(), reqBody, response => {
      this.common.showToast(this.translation.deleteAttachment, 'success')
      this.common.hideLoader();
    }, error => {
      this.common.hideLoader();
    });
  }

  deleteHazardAttchamnet(reqBody): void {
  	this.common.showLoader();
    this.common.http.doPost(this.common.url.deleteAccidentAttachment(), reqBody, response => {
    	this.common.showToast(this.translation.deleteAttachment, 'success')
    	this.common.hideLoader();
    }, error => {
    	this.common.hideLoader();
    });
  }

}
