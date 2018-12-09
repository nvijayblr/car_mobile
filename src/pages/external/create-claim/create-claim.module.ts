import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateClaimPage } from './create-claim';

@NgModule({
  declarations: [
    CreateClaimPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateClaimPage),
  ],
})
export class CreateClaimPageModule {}
