import { Component } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-invoice-modal',
  templateUrl: 'invoice-modal.html',
})
export class InvoiceModalPage {
	
	public invoiceDetails = {};
	public invoiceSelected = {};
	public invoiceSelectedId = '';

  constructor(public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl:ViewController) {
  	this.invoiceDetails = this.navParams.get('invoiceDetails');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoiceModalPage');
  }

  closeModal() {
    this.viewCtrl.dismiss('');
  }

  selectInvoice() {
  	this.viewCtrl.dismiss(this.invoiceSelected);
  }

  updateSelectedInvoice(_invoice) {
  	this.invoiceSelected = _invoice;
  }
}
