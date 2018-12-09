import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TooltipPage } from './tooltip';

@NgModule({
  declarations: [
    TooltipPage,
  ],
  imports: [
    IonicPageModule.forChild(TooltipPage),
  ],
})
export class TooltipPageModule {}
