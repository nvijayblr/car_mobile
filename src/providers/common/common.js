var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpProvider } from '../http/http';
import { ToastController, LoadingController } from 'ionic-angular';
import { UrlGeneratorProvider } from '../url-generator/url-generator';
var CommonProvider = /** @class */ (function () {
    function CommonProvider(http, url, toastCtrl, loadingCtrl) {
        this.http = http;
        this.url = url;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.externalWeightage = 10;
        this.internalWeightage = 10;
    }
    CommonProvider.prototype.showLoader = function () {
        this.loader = this.loadingCtrl.create({
            showBackdrop: true,
            spinner: 'dots'
        });
        this.loader.present();
    };
    CommonProvider.prototype.hideLoader = function () {
        if (this.loader) {
            this.loader.dismiss();
            this.loader = null;
        }
    };
    CommonProvider.prototype.showToast = function (_message, _type, _position, _duration) {
        this.toast = this.toastCtrl.create({
            message: _message,
            cssClass: _type ? _type : '',
            position: _position ? _position : 'top',
            duration: _duration ? _duration : 3000,
            dismissOnPageChange: true,
            showCloseButton: true,
            closeButtonText: 'x'
        });
        this.toast.onDidDismiss(function () {
        });
        this.toast.present();
    };
    CommonProvider.prototype.clearToast = function () {
        this.toast.hide();
    };
    CommonProvider.prototype.setExternalWeightage = function () {
        var modules = JSON.parse(localStorage.getItem('Weightage')).ModuleTransactions;
        for (var i = 0; i < modules.length; i++) {
            if (modules[i].ModuleCode == 'CLMCR') {
                this.externalWeightage = modules[i].TransactionWeightage;
            }
        }
    };
    CommonProvider.prototype.setInternalWeightage = function () {
        var modules = JSON.parse(localStorage.getItem('Weightage')).ModuleTransactions;
        for (var i = 0; i < modules.length; i++) {
            if (modules[i].ModuleCode == 'ICLMCR') {
                this.internalWeightage = modules[i].TransactionWeightage;
            }
        }
    };
    CommonProvider.prototype.getExternalWeightage = function () {
        return this.externalWeightage;
    };
    CommonProvider.prototype.getInternalWeightage = function () {
        return this.internalWeightage;
    };
    CommonProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpProvider,
            UrlGeneratorProvider,
            ToastController,
            LoadingController])
    ], CommonProvider);
    return CommonProvider;
}());
export { CommonProvider };
//# sourceMappingURL=common.js.map