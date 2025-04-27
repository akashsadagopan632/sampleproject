import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillingPageRoutingModule } from './billing-routing.module';

import { BillingPage } from './billing.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { NewdashboardPageModule } from '../newdashboard/newdashboard.module';
import { IonicStorageModule } from '@ionic/storage';
import { PagesComponent } from '../pages/pages.component';
import { KnotesComponent } from '../components/knotes/knotes.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    BillingPageRoutingModule,
    NewdashboardPageModule,
    IonicStorageModule.forRoot({
      name: 'Today',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  declarations: [BillingPage,PagesComponent,KnotesComponent]
})
export class BillingPageModule {}
