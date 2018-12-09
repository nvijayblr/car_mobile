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
import { ModalController, NavParams, ViewController } from 'ionic-angular';
var InvoiceModalPage = /** @class */ (function () {
    function InvoiceModalPage(modalCtrl, navParams, viewCtrl) {
        this.modalCtrl = modalCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.invoiceDetails = {};
        this.invoiceSelected = {};
        this.invoiceSelectedId = '';
        this.invoiceDetails = this.navParams.get('invoiceDetails');
    }
    InvoiceModalPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad InvoiceModalPage');
    };
    InvoiceModalPage.prototype.closeModal = function () {
        this.viewCtrl.dismiss('');
    };
    InvoiceModalPage.prototype.selectInvoice = function () {
        this.viewCtrl.dismiss(this.invoiceSelected);
    };
    InvoiceModalPage.prototype.updateSelectedInvoice = function (_invoice) {
        this.invoiceSelected = _invoice;
    };
    InvoiceModalPage = __decorate([
        Component({
            selector: 'page-invoice-modal',
            templateUrl: 'invoice-modal.html',
        }),
        __metadata("design:paramtypes", [ModalController, NavParams, ViewController])
    ], InvoiceModalPage);
    return InvoiceModalPage;
}());
export { InvoiceModalPage };
//# sourceMappingURL=invoice-modal.js.map