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
import { NavController } from 'ionic-angular';
import { LandingPage } from '../landing/landing';
import { CommonProvider } from '../../providers/common/common';
import { Constant } from '../../providers/constant/constant';
var LoginPage = /** @class */ (function () {
    // public removeView : any;
    function LoginPage(navCtrl, common, constant) {
        this.navCtrl = navCtrl;
        this.common = common;
        this.constant = constant;
        this.login = {
            username: '',
            password: '',
            DomainID: '',
            LanguageCulture: '1'
        };
        this.domainList = [];
        this.languageList = [];
        this.rememberMe = false;
    }
    //ngOnInit, ionViewDidLoad
    LoginPage.prototype.ngOnInit = function () {
        this.navCtrl.popToRoot();
        this.common.hideLoader();
        if (localStorage.getItem("userData") && localStorage.getItem("AuthToken") && localStorage.getItem("Weightage")) {
            this.common.setExternalWeightage();
            this.common.setInternalWeightage();
            this.navCtrl.push(LandingPage);
        }
        else {
            this.getAllDomain();
            localStorage.removeItem("userData");
            localStorage.removeItem("AuthToken");
        }
    };
    LoginPage.prototype.getAllLanguages = function () {
        var _this = this;
        this.common.showLoader();
        this.common.http.doGet(this.common.url.getLanguageList(), function (response) {
            _this.languageList = response ? response : [];
            var localLang = localStorage.getItem('lang');
            _this.login.LanguageCulture = (localLang) ? localLang : "en-US";
            _this.common.hideLoader();
        }, function (error) {
            console.log(error);
            _this.common.hideLoader();
        });
    };
    LoginPage.prototype.getAllDomain = function () {
        var _this = this;
        this.common.showLoader();
        this.common.http.doGet(this.common.url.getDomainListUrl(), function (response) {
            _this.domainList = response.Data ? response.Data : [];
            _this.common.hideLoader();
            var storedUser = JSON.parse(localStorage.getItem('arcuser'));
            if (storedUser && storedUser.username && storedUser.DomainID) {
                _this.login.DomainID = storedUser.DomainID;
                _this.login.username = storedUser.username;
                _this.rememberMe = storedUser.rememberMe;
            }
            _this.getAllLanguages();
        }, function (error) {
            console.log(error);
            _this.common.hideLoader();
        });
    };
    LoginPage.prototype.doLogin = function (_login) {
        var _this = this;
        if (!_login.username) {
            this.common.showToast('Please enter valid username');
            return;
        }
        if (!_login.password) {
            this.common.showToast('Please enter valid password');
            return;
        }
        if (!_login.DomainID) {
            this.common.showToast('Please Choose domain name');
            return;
        }
        this.common.showLoader();
        this.common.http.doPost(this.common.url.getLoginUserURL(), _login, function (response) {
            if (response.ResponseCode !== 200) {
                _this.common.hideLoader();
                _this.common.showToast('Invalid username/password.', "error");
                return;
            }
            if (response.Data) {
                localStorage.setItem("userData", JSON.stringify(response.Data));
                var data = JSON.parse(response.Data);
                localStorage.setItem("AuthToken", 'Bearer ' + data.access_token);
                localStorage.setItem("lang", _this.login.LanguageCulture);
                if (_this.rememberMe) {
                    delete _login.password;
                    _login.rememberMe = _this.rememberMe;
                    localStorage.setItem("arcuser", JSON.stringify(_login));
                }
                else {
                    localStorage.removeItem("arcuser");
                }
                /*Begin the Get user weightage*/
                _this.common.http.doGet(_this.common.url.getWeightageListURL(), function (response) {
                    if (response.Data) {
                        _this.setUserWeightage(response);
                    }
                }, function (error) {
                    _this.setUserWeightage('', error);
                });
                /*End the Get user weightage*/
            }
        }, function (error) {
            _this.setUserWeightage('', error);
        });
    };
    LoginPage.prototype.setUserWeightage = function (_response, _error) {
        this.common.hideLoader();
        if (_response) {
            if (_response.ResponseCode === 200) {
                var weightage = _response.Data;
                localStorage.setItem("Weightage", JSON.stringify(weightage));
                localStorage.setItem("fullName", _response.Data.FullName);
                this.common.setExternalWeightage();
                this.common.setInternalWeightage();
                this.navCtrl.push(LandingPage);
            }
            else {
                this.common.showToast(_response.ResponseMessage);
            }
        }
        else {
            this.common.showToast(_response.Message ? _response.Message : 'Login Failed');
        }
    };
    LoginPage = __decorate([
        Component({
            selector: 'page-login',
            templateUrl: 'login.html'
        }),
        __metadata("design:paramtypes", [NavController, CommonProvider, Constant])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map