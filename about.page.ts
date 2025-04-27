import { Component, OnInit } from '@angular/core';
import { Platform, NavController, ToastController, MenuController } from '@ionic/angular';
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  menutoggle:any=0;
  width:any=0;
  constructor(private menu: MenuController) 
  { }

  ngOnInit() 
  {
    this.width = localStorage.getItem('device_width');
    if(this.width >500)
    this.menu.enable(false);
    else
    this.menu.enable(true);
  }

  openCustom(menutoggle) 
  {
    console.log(menutoggle);
    if(menutoggle==0)
    {
      this.menu.enable(true);
      this.menutoggle=1;
    }
    else
    {
      this.menu.enable(false);
      this.menutoggle=0;
    }
    
    //this.menu.open('custom');
  }

}
