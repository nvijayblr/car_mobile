import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tooltip',
  templateUrl: 'tooltip.html',
})
export class TooltipPage {
	public toolTipData = '';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.toolTipData = this.navParams.get('data')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TooltipPage');
  }

}
