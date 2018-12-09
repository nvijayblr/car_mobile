var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { InAppBrowser } from '@ionic-native/in-app-browser';
var AttachmentModalPage = /** @class */ (function () {
    function AttachmentModalPage(navParams, viewCtrl, common, iab) {
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.common = common;
        this.iab = iab;
        this.attachmentsList = [];
        this.queueList = [];
        this.cameraList = [];
        this.claimObjectList = [];
        this.deletedImages = [];
        this.key = '';
        this.isViewMode = true;
        this.browser = '';
        this.attachmentsList = this.navParams.get('attachments');
        this.queueList = this.navParams.get('queue');
        this.cameraList = this.navParams.get('camera');
        this.claimObjectList = this.navParams.get('claimObj');
        this.key = this.navParams.get('key');
        this.isViewMode = this.navParams.get('videMode');
    }
    AttachmentModalPage.prototype.ionViewDidLoad = function () {
    };
    AttachmentModalPage.prototype.closeModal = function () {
        this.viewCtrl.dismiss(this.deletedImages);
    };
    AttachmentModalPage.prototype.opneFileInBrowser = function (_url) {
        var options = { location: 'yes', zoom: 'yes', closebuttoncaption: 'Close', toolbar: 'yes' };
        this.browser = this.iab.create(_url, '_system', options);
    };
    AttachmentModalPage.prototype.deleteImage = function (_name, filePath, _image, _index) {
        this.deletedImages.push(_image);
        for (var j = 0; j < this.queueList.length; j++) {
            if (this.queueList[j].file.name === _name) {
                this.queueList.splice(j, 1);
            }
        }
        /*To remove the camera uploads*/
        for (var j = 0; j < this.cameraList.length; j++) {
            if (this.cameraList[j] === filePath) {
                this.cameraList.splice(j, 1);
            }
        }
        /*To remove the claim objects to save*/
        for (var j = 0; j < this.claimObjectList.length; j++) {
            if (this.claimObjectList[j].FileName === _name) {
                var reqBody = {
                    'AttachmentID': this.claimObjectList[j].AttachmentID,
                    'Key': this.key
                };
                this.deleteAttchamnet(reqBody);
                this.claimObjectList.splice(j, 1);
            }
        }
        this.attachmentsList.splice(_index, 1);
        if (!this.attachmentsList.length) {
            this.viewCtrl.dismiss('');
        }
    };
    AttachmentModalPage.prototype.deleteAttchamnet = function (reqBody) {
        var _this = this;
        this.common.showLoader();
        this.common.http.doPost(this.common.url.getDeleteAttachmentURL(), reqBody, function (response) {
            _this.common.showToast('Attachment deleted successfully.', 'success');
            _this.common.hideLoader();
        }, function (error) {
            _this.common.hideLoader();
        });
    };
    AttachmentModalPage = __decorate([
        Component({
            selector: 'page-attachment-modal',
            templateUrl: 'attachment-modal.html',
        }),
        __metadata("design:paramtypes", [NavParams, ViewController, CommonProvider, InAppBrowser])
    ], AttachmentModalPage);
    return AttachmentModalPage;
}());
export { AttachmentModalPage };
//# sourceMappingURL=attachment-modal.js.map