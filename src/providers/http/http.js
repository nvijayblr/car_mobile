var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { ToastController } from 'ionic-angular/index';
import { LoginPage } from '../../pages/login/login';
var HttpProvider = /** @class */ (function () {
    function HttpProvider(http, appView, toastCtrl) {
        this.http = http;
        this.appView = appView;
        this.toastCtrl = toastCtrl;
        this.navCtrl = this.appView.getActiveNav();
    }
    HttpProvider.prototype.getHeader = function () {
        var authToken = '';
        if (localStorage.getItem("AuthToken")) {
            authToken = (localStorage.getItem("AuthToken"));
        }
        var header = {
            Authorization: authToken,
            'Content-Type': 'application/json'
        };
        return header;
    };
    HttpProvider.prototype.doGet = function (apiUrl, successCallback, failureCallback) {
        this.http.get(apiUrl, { headers: this.getHeader() }).subscribe(function (response) {
            successCallback(response);
        }, function (error) {
            failureCallback(error);
        });
    };
    HttpProvider.prototype.doPost = function (apiUrl, data, successCallback, failureCallback) {
        var _this = this;
        this.http.post(apiUrl, data, { headers: this.getHeader() }).subscribe(function (response) {
            successCallback(response);
        }, function (error) {
            failureCallback(error);
            if (error && error.status == 401 && error.statusText == 'Unauthorized') {
                _this.showToast('Unauthorized access.', 'error');
                _this.doLogout();
                return;
            }
            _this.showToast(error, 'error');
        });
    };
    HttpProvider.prototype.doLogout = function () {
        localStorage.removeItem("userData");
        localStorage.removeItem("AuthToken");
        localStorage.removeItem("userName");
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.popToRoot;
    };
    HttpProvider.prototype.showToast = function (_message, _type, _position, _duration) {
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
    HttpProvider.prototype.clearToast = function () {
        this.toast.hide();
    };
    HttpProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, App, ToastController])
    ], HttpProvider);
    return HttpProvider;
}());
export { HttpProvider };
//# sourceMappingURL=http.js.map