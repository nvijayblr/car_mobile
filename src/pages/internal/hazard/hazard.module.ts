import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HazardPage } from './hazard';

@NgModule({
  declarations: [
    HazardPage,
  ],
  imports: [
    IonicPageModule.forChild(HazardPage),
  ],
})
export class HazardPageModule {}
