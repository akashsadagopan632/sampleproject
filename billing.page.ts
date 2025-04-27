import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe, formatDate } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { ActionSheetController, AlertController, AnimationController, LoadingController, MenuController, ModalController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ApiService } from '../api.service';
import { KnotesComponent } from '../components/knotes/knotes.component';
import { OtpAuthorizeComponent } from '../components/otp-authorize/otp-authorize.component';
import { CustomerdPage } from '../customerd/customerd.page';
import { KotbillPage } from '../kotbill/kotbill.page';
import { OnlineOrdersPage } from '../online-orders/online-orders.page';
import { PagesComponent } from '../pages/pages.component';
import { RunningOrderPage } from '../running-order/running-order.page';
import { AuthenticationService } from '../services/authentication.service';
import { HappyHoursService } from '../services/happy-hours.service';
import { PrinterService } from '../services/printer.service';
import { ProductionService } from '../services/production.service';
import { SqliteService } from '../sqlite.service';
export enum orderfrom {
  DELIVERY = 'D',
  SELF_SERVICE = 'S',
  ROOM_SERVICE = 'R',
  DINE_IN = 'E',
  TAKEAWAY = 'P'
}


class floor {
  public fid: number;
  public name: string;
}
class table {
  public id: number;
  public name: string;
}
class captain {
  public id: number;
  public name: string;
}
class waiter {
  public id: number;
  public name: string;
}

class onlineref {
  public id: number;
  public name: string;
}
class delivery_time {
  public id: Number;
  public timing: String;
}
class room_list {
  public id: Number;
  public name: String;
}
class printer {
  public printID: string
  public printName: string
}
const CART_KEY = 'cartProducts';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('openClose', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0px' })),
      transition('false <=> true', [animate(300)])
    ])
  ]
})
export class BillingPage implements OnInit {
  // @ViewChild('qty') qtyElement: ElementRef;
  @ViewChild('otpAuthorizeComponent', { static: false }) otpAuthorizeComponent: OtpAuthorizeComponent
  @ViewChild('tableComponent') tableComponent: IonicSelectableComponent;
  @ViewChild('captainComponent') captainComponent: IonicSelectableComponent;
  @ViewChild('waiterComponent') waiterComponent: IonicSelectableComponent;
  @ViewChild('onlinecomponent') onlinecomponent: IonicSelectableComponent;
  @ViewChild('deliverytimecomponet') deliverytimecomponet: IonicSelectableComponent;
  @ViewChild('roomlistcomponet') roomlistcomponet: IonicSelectableComponent;
  @ViewChild('printercomponet') printercomponet: IonicSelectableComponent;
  height: number = 500;
  today: any;
  category: any = [];
  cust: any = 0;
  menus: any = [];
  cartdetails: any = [];
  width: any = 0;
  data: any = {};
  custtax: any = {};
  database: any;
  citem: any = 0.0;
  ctotal: any = 0;
  cartItems: any = 0.0;
  cartTotalamt: any = 0;
  storageItems: any = [];
  cart_items: any = 0;
  catid: any;
  menu_code: any = '';
  menussearch: any[] = [];
  branchid: any;
  restid: any;
  sessionwise: any = '';
  search_menu: any[];
  length: any = 0;
  form1: any = true;
  ressql: any = '';
  LoadMenuByAdmin: any = '';
  OnlineRefprice: any;
  flooraccess: any = '';
  tax_list: any = [];
  tax_list2: any = [];
  taxstr: any = [];
  discperc: any;
  discamnt: any;
  grandtotal: any = 0;
  tax_amnt: any = [];
  tax_name: any = [];
  subtotal: any = 0;
  tax_details: any = [];
  itemdetails: any = [];
  decimalpoint: any = 0;
  maxdiscount: any = 0;
  orderdetails: any = [];
  waiterid: any = 1;
  captainid: any = 0;
  onlirefid: any = 0;
  cusnumber: any = 0;
  cusname: any = '';
  tablename: any = '';
  userid: any = 0;
  noofpax: any = 0;
  cusemail: any = '';
  time: any;
  ordersummaryid: any = [];
  order_id: any;
  bluetoothList: any = [];
  selectedPrinter: any;
  list: any;
  datas: any = "";
  currenttime: any;
  totaldiscountamount: any = 0;
  discper: any = 0;
  billdate: any;
  floorid: number = 0;
  discby: any = "";
  orderdet: any = [];
  ordertax: any = [];
  price: any = 0;
  ordereddet: any = [];
  checkitem: any = [];
  address: any;
  billingfocus1;
  focuscount1 = 0;
  focusmdtry1 = 0;
  branchname: any = '';
  username: any = '';
  custd;
  flag = 0;
  qty = 0;
  floor1: any = [];
  table1: any = [];
  waiter1: any = [];
  captain1: any = [];
  tablevalue: table;
  floorvalue: floor;
  changeorder: floor;
  tempfloor: any;
  captainvalue: captain;
  waitervalue: waiter;
  onlinerefvalue: onlineref;
  delivery_time: delivery_time;
  printer: printer
  roomvalues: room_list;
  rooms = [];
  ORDER_ID: any;
  addcart: any = [];
  roundoff: any = 0;
  billroundoff: any = 'N';
  custaddr: any = "";
  todayorder: any = [];
  orderlist: any = [];
  order_type: any = "";
  modifier: any = [];
  addons: any = 0;
  addon: any = [];
  modparent: any = [];
  variancemenu: any = [];
  variance: any = [];
  cartProduct: any = {};
  comboitems: any = [];
  parentname: any = "";
  restname: any = "";
  countfloor_dinein: any = 0;
  name: any = "";
  online: any = 0;
  searchmenu: any;
  logo: any = '';
  onlinerefmstr: any = [];
  floorname: any = "";
  itemwisedet: any = 0;
  itemwisedata = [];
  kitchennotes: any = [];
  itemwisedisc: any;
  itemcomp: any;
  str_id: any = 0;
  ischecked: boolean = false;
  variancelist: any;
  time_list: any
  deliverytime_arr: any[];
  deliverytime: any;
  dtime: any;
  bill_data: any;
  rewardpoint: any;
  flatno: any;
  latitude: any;
  longitude: any;
  HtlDesk: any;
  HtlIP: any;
  foodenginestoreid: any;
  roomno: any;
  htlbookid: any;
  htlbookmobile: any;
  htlbookname: any;
  roomid: any;
  oneuiinstance: string;
  isLoading: boolean;
  stockconsumation: any;
  disableButton: boolean;
  changefloorlist: any = [];
  isdinein: boolean = false;
  keycount: number = -1;
  printers: any = [];
  printerId: any;
  ismodify: string;
  totalTaxAmount: any = 0;
  isHappyHourEnable: string;
  happyHourId: string;
  happyHourTypeID: string;
  acfloor: any;
  cancelRemarks: any = '';
  discReason: any = '0';
  discRemarks: any = '';
  cancelCategory: any = 0;
  cancelbilladminid: any = '';
  cancelTime: string = '';
  discApprover: number = 0;
  show: boolean = false;
  updateItemDetails: any = [];
  updateTax: any = [];
  pageName: string = 'Billing';
  mainbillstatus: string;
  mainip: string;
  kotBillStatus: string;
  kotIP: string;
  remarks: string = '';
  isAuttosettlement: any;
  hallType: string;
  settingList: { name: string; count: number; code: number; }[];
  segment: number;
  pageList: { name: string; code: number; }[];
  stockvalidate: any;
  prodvalidate: any;
  Arr = Array;
  iscat: boolean = false;
  ismenu: boolean = false;
  otp: string;
  otpForConcelKot: any;
  menutoggle: number = 0;
  currency: string = 'INR';
  billcount: number = 1;
  productionDetails: { menuid: string, productionCount: number, productionStatus: number, qty: number }[] = [];
  modifiykot: string = 'N';
  dicountamount:number = 0;
  constructor(private sqlite: SQLite, public cartService: ApiService, public storage: Storage,
    public sqlservice: SqliteService, private router: Router, public toastCtrl: ToastController,
    private route: ActivatedRoute, private authService: AuthenticationService, public alertController: AlertController,
    public btSerial: BluetoothSerial, private datePipe: DatePipe, public apiService: ApiService, public modalController: ModalController, public loadingController: LoadingController,
    private productionService: ProductionService, private happyhour: HappyHoursService, public popoverController: PopoverController, private menu: MenuController,
    private actionSheetController: ActionSheetController, public Platform: Platform, public printerservice: PrinterService,
    public animationCtrl: AnimationController) {
    this.discby = "P";
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.cusname = (params.cusname != undefined) ? params.cusname : '';
        this.cusnumber = (params.cusnumber != undefined) ? params.cusnumber : '';
        this.captainid = (params.captainid != undefined && params.captainid != '') ? params.captainid : '0';
        this.waiterid = (params.waiterid != undefined && params.waiterid != '') ? params.waiterid : '0';
        this.deliverytime = (params.deliverytime != undefined && params.deliverytime != '') ? params.deliverytime : '1';
        this.noofpax = (params.noofpax != undefined && params.noofpax != '') ? params.noofpax : '1';
        this.cusemail = (params.email != undefined) ? params.email : "";
        this.address = (params.address != undefined) ? params.address : "";
        this.discby = params.discby;
        if (this.discby == 'P')
          this.discperc = params.discper;
        else if (this.discby == 'R')
          this.discamnt = params.discamnt;
        else {
          this.discperc = 0;
          this.discamnt = 0;
          this.discby = "P";
        }
      }
    });

    let dateTime = new Date();
    this.currenttime = formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US', '+0530');
    this.billdate = localStorage.getItem('dayenddate');
    console.log(this.discby);
    menu.close();

  }

  ngOnInit() {
    this.menuEnable();
    this.height = window.screen.height;
    this.cartdetails = [];
    this.disableButton = false;
    this.isLoading = false;
    var url = localStorage.getItem('API_URL');
    var logo = localStorage.getItem('logo');
    this.logo = url + "displayImage/Logo/ColorImage/" + logo;
    this.ismodify = localStorage.getItem('modifykot');
    this.name = localStorage.getItem('Name');
    this.isHappyHourEnable = localStorage.getItem('isHappyHourEnable');
    this.online = localStorage.getItem('onlineStatus');
    this.restname = localStorage.getItem('restname');
    this.oneuiinstance = localStorage.getItem('oneuiinstance');
    this.cust = localStorage.getItem('ordertype');
    this.width = localStorage.getItem('device_width');
    this.branchname = localStorage.getItem('branchname');
    this.username = localStorage.getItem('Name');
    this.data = { "search": '' };
    this.branchid = localStorage.getItem('BranchID');
    this.restid = localStorage.getItem('RestID');
    this.length = 0;
    this.maxdiscount = localStorage.getItem('maxdiscount');
    console.log(this.restid);
    this.tablename = localStorage.getItem('tablename');
    this.userid = localStorage.getItem('UserID');
    this.ORDER_ID = localStorage.getItem('order_id');
    var dayenddate = localStorage.getItem('dayenddate');
    let dateTime = new Date(dayenddate);
    this.today = dateTime;
    this.onlirefid = localStorage.getItem('onlinerfid') ?? 0;
    // this.cartTotal();
    this.floor();
    this.menucode();
    this.tax_str();
    this.taxlist();
    this.captain();
    this.waiter();
    this.allmenus();
    this.get_reward_data();
    this.proctionvalidation()
    this.stockvalidation();
    this.getMainPrinter();
    this.getKOTPrinter();
    this._getCaptionAndWaiterID(this.restid, this.branchid, this.ORDER_ID);
    this.cart_items = 0;
    this.subtotal = 0;
    this.grandtotal = 0;
    this.roundoff = 0;
    this.ischecked = false;
    this.addcart = [];
    this.floorid = Number(localStorage.getItem('FloorId'));
    this.data.menuview = '1';
    this.sqlservice.deliverytime(this.branchid, this.restid).then((res) => {
      this.time = res;
      this.cartTotal();
    });
    // this.billing_focus1();
    this.countordertype();
    this.onlinerefermstr();
    this.deliverytime_list();
    this.set_deliverytime();
    this.roomlst();
    this.hotelckn();
    this.getAutoSettlement();
    if (this.oneuiinstance === 'H') {
      this.dynamic_printers();
    }
    this.isLoading = false;
    var strockdectsql = "SELECT StockDedTyp FROM sr_branches_tbl where restid=" + this.restid + " AND branchid='" + this.branchid + "'";
    this.sqlservice.dayendaut3(strockdectsql).then((res1) => {
      var stockdedtyp = res1[0].stockdedtyp;
      localStorage.setItem("stockdedtyp", stockdedtyp);
    })
    this.printerId = localStorage.getItem(this.floorname);
    if (this.printerId === undefined || this.printerId === 'undefined' || this.printerId === null) {
      this.printerId = '0';
    } else {
      const print = this.printers.filter(p => p.printID === this.printerId);
      this.printer = print[0];
    }
    this.settingList = [
      { name: 'CUSTOMER - INFO', count: 0, code: 1 },
      { name: 'SPLIT BILL', count: 0, code: 2 },
      { name: 'OPEN ORDERS', count: 0, code: 3 },
      { name: 'Online Orders', count: 0, code: 4 },
      { name: 'TODAYS ORDERS', count: 0, code: 5 },
      { name: 'HOLD', count: 0, code: 6 },
      { name: 'PRODUCTON', count: 0, code: 7 },
      { name: 'EXTRAS', count: 0, code: 8 },
      { name: 'TABLE INFO', count: 0, code: 9 },
      { name: 'RE-ORDER', count: 0, code: 10 },
      { name: 'COUPON', count: 0, code: 11 },
      { name: 'VOID', count: 0, code: 12 }
    ]
    this.currency = localStorage.getItem('currency');
    this.currency = (this.currency != undefined && this.currency != 'undefined' && this.currency !== null && this.currency.trim().length > 0) ? this.currency : 'INR';
    this.dismiss();
  }
  private menuEnable() {
    if (this.width > 500) {
      this.menu.enable(false);
    } else {
      this.menu.enable(true);
    }
  }

  ionViewDidEnter() {
    this.menuEnable();
    this.cartdetails = [];
    this.dismiss();
    this.floorid = Number(localStorage.getItem('FloorId'));
    let check = localStorage.getItem('changeorder');
    this.ismodify = localStorage.getItem('modifykot');
    if (check === 'Y') {
      const floor = this.floor1.filter(value => value.fid === this.floorid);
      this.floorvalue = floor[0];
      this.tablename = localStorage.getItem('tablename');
      this.cust = floor[0].ordertype;
      this.table(this.floorid);
      localStorage.setItem('changeorder', 'N');
    }
    this.categories();
    this.getProductionCount(this.restid, this.branchid);
    this.flag = 0;
    var orderid = localStorage.getItem('orderid');
    this._getCaptionAndWaiterID(this.restid, this.branchid, orderid);
    var cartitems = [];
    var cartvalue = [];
    if (orderid != null && orderid != '') {
      if (this.oneuiinstance == 'H') {
        var data = JSON.stringify({ restid: this.restid, branchid: this.branchid, "oid": orderid })
        console.log(data);
        this.apiService.getbillingorders(data).subscribe(res => {
          this.ordereddet = JSON.parse(res.orderdetails);
          if (this.ordereddet[0].UiComp === 'Y') {
            this.ischecked = true;
          }
          this.discby = this.ordereddet[0].discby;
          if (this.discby == 'P')
            this.discperc = this.ordereddet[0].discper;
          else if (this.discby == 'R')
            this.discamnt = this.ordereddet[0].discprice;
          else
          this.discamnt = this.ordereddet[0].discprice;
          this.discamnt = Math.round(this.discamnt);
          localStorage.setItem('discamnt', this.discamnt)
          localStorage.setItem('cusnumber', this.ordereddet[0].custmob);
          localStorage.setItem('custaddr', this.ordereddet[0].custaddr);
          localStorage.setItem('custname', this.ordereddet[0].custname);
          localStorage.setItem('flatno', this.ordereddet[0].flatno);
          localStorage.setItem('latitude', this.ordereddet[0].latitude);
          localStorage.setItem('longitude', this.ordereddet[0].longitude);
          this.waiterid = this.ordereddet[0].captainid;
          this.captainid = this.ordereddet[0].waiterid;
          for (var i = 0; i < this.ordereddet.length; i++) {
            var cart = this.existingorder(this.ordereddet[i], orderid);
            cartitems.push(cart);
          }
          this.storage.set(CART_KEY, cartitems).then(() => {
            this.cartTotal();
          });
        });
      }
      else {
        var orderdetails = "SELECT a.ordersummaryid,a.itemprice,a.itemqty,b.name,a.currentstatus,a.remarks,a.knotes,a.kotstatus,a.structid,b.menuid,a.modparent ,c.discper,c.discprice,c.discby,c.custmob,c.custname,c.custaddr,c.flatno,c.latitude,c.longitude,c.UIComp,IFNULL(c.discprice,0) AS discountamount  FROM sr_order_smry_tbl a,sr_menumstr_tbl b,sr_orders_tbl c WHERE a.orderid=c.orderid AND a.itemid=b.menuid AND a.sbranchid='" + this.branchid + "' AND a.srestid=" + this.restid + " AND a.orderid=" + orderid;
        this.sqlservice.orderdetails(orderdetails).then((res) => {
          console.log(res);
          this.ordereddet = res;
          if (this.ordereddet[0].UIComp === 'Y') {
            this.ischecked = true;
          }
          this.dicountamount = this.ordereddet[0].dicountamount
          this.discby = this.ordereddet[0].discby;
          if (this.discby == 'P')
            this.discperc = this.ordereddet[0].discper;
          else if (this.discby == 'R')
            this.discamnt = this.ordereddet[0].discprice;
          this.discamnt = Math.round(this.discamnt);
          localStorage.setItem('cusnumber', this.ordereddet[0].custmob);
          localStorage.setItem('custaddr', this.ordereddet[0].custaddr);
          localStorage.setItem('custname', this.ordereddet[0].custname);
          localStorage.setItem('flatno', this.ordereddet[0].flatno);
          localStorage.setItem('latitude', this.ordereddet[0].latitude);
          localStorage.setItem('longitude', this.ordereddet[0].longitude);
          for (var i = 0; i < this.ordereddet.length; i++) {
            var cart = this.existingorder(this.ordereddet[i], orderid);
            cartitems.push(cart);
          }
          this.storage.set(CART_KEY, cartitems).then(() => {
            this.cartTotal();
          });
        });
      }
    } else {
      this.cartTotal();
    }
    if (this.width > 500) {
      this.ngOnInit();
    }
    this.dismiss();
  }

  //Keyboard Shortcuts
  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    if (event.key === "F10") {
      if (this.oneuiinstance === 'C') {
        this.saveorder('Y');
      } else {
        this.Hsaveorder('Y');
      }
    } else if (event.key === "F11") {
      if (this.oneuiinstance === 'C') {
        this.saveorder('N');
      } else {
        this.Hsaveorder('N');
      }
    } else if (event.key === "F6") {
      localStorage.setItem('orderid', '');
      localStorage.setItem('order_id', '');
      this.cartService.removeAllCartItems();
      this.cartItems = 0;
      this.neworder();
    } else {
      var floorlist = JSON.parse(localStorage.getItem('floorlist'));
      for (var i = 0; i < floorlist.length; i++) {
        if (floorlist[i].shortcutkey == event.key) {
          this.floorvalue = floorlist[i];
          this.floorchange(floorlist[i]);
        }
      }
    }
  }


  //floorchange
  floorchange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log(event.value);
    console.log(event.component);
    console.log(this.cartdetails);
    var cartlist = 0;
    for (var i = 0; i < this.cartdetails.length; i++) {
      if (this.cartdetails[i].currentstatus == '' && this.cartdetails[i].count > 0) {
        cartlist++;

      }
    }
    if (cartlist > 0) {
      this.clearcart("Are you sure, want to clear cart?", event.value.fid, event.value.ordertype);

    }
    else {
      this.floorid = event.value.fid;
      this.order_type = event.value.ordertype;
      this.floorname = event.value.descr;
      this.changefloorlist = this.floor1.filter(value => value.fid !== this.floorid);
      localStorage.setItem('FloorId', this.floorid.toString());
      localStorage.setItem('orderid', '');
      localStorage.setItem('order_id', '');
      localStorage.setItem('tableid', '0');
      localStorage.setItem('ordertype', this.order_type);
      this.table1 = [];
      if (this.order_type == 'D') {
        this.custModal()
      }
      if (this.order_type == 'E') {
        this.table(this.floorid);
      }
      this.cartdetails = [];
      this.cust = this.order_type;
      this.cartService.removeAllCartItems();
      this.cartItems = 0;
      if (this.tableComponent !== undefined) {
        this.tableComponent.clear();
      }
      if (this.captainComponent !== undefined) {
        this.captainComponent.clear();
      }
      if (this.waiterComponent !== undefined) {
        this.waiterComponent.clear();
      }
      if (this.onlinecomponent !== undefined) {
        this.onlinecomponent.clear();
      }
      this.ionViewDidEnter();
    }

  }

  async clearcart(title, floorid, ordertype) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      subHeader: title,
      buttons: [
        {
          text: 'No',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Yes',
          handler: (data: any) => {
            this.floorid = floorid;
            this.order_type = ordertype;
            localStorage.setItem('FloorId', this.floorid.toString());
            localStorage.setItem('orderid', '');
            localStorage.setItem('order_id', '');
            localStorage.setItem('tableid', '0');
            localStorage.setItem('ordertype', this.order_type);
            if (this.order_type == 'E') {
              this.table(this.floorid);
            }
            this.cartdetails = [];
            this.cust = this.order_type;
            this.menudetail(this.category[0].id);
            this.cartService.removeAllCartItems();
            this.cartItems = 0;
            this.tableComponent.clear();
            this.captainComponent.clear();
            this.waiterComponent.clear();
            this.onlinecomponent.clear();
            this.ionViewDidEnter();
          }
        }
      ]
    })

    await alert.present();
  }



  //While table change
  tableChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    var cartlist = 0;
    let ordertype: string = localStorage.getItem('ordertype');
    for (var i = 0; i < this.cartdetails.length; i++) {
      if (this.cartdetails[i].currentstatus == '' && this.cartdetails[i].count > 0) {
        cartlist++;

      }
    }
    if (cartlist > 0) {
      this.clearcart_tbl("Are you sure, want to clear cart?", event.value.id, event.value.tno, event.value.orderid, event.value.billedstatus, event.value.settlement);
    }
    else {
      if (this.oneuiinstance == 'H') {
        localStorage.setItem('tableid', event.value.id);
        localStorage.setItem('tablename', event.value.tno);
        if (event.value.orderid == undefined) {
          localStorage.setItem('orderid', '');
          localStorage.setItem('order_id', '');
          localStorage.setItem('settlementtable', 'N');
          this.cartdetails = [];
          this.cartService.removeAllCartItems();
          this.cartItems = 0;
          this.ionViewDidEnter();
        }
        else if (event.value.billedstatus == 'N' && event.value.settlement == 'N' && ordertype === orderfrom.DINE_IN) {
          this.loadtable(event.value.orderid)
          localStorage.setItem('orderid', event.value.orderid);
          localStorage.setItem('order_id', event.value.orderid);
          localStorage.setItem('settlementtable', 'N');
        }
        else if (event.value.billedstatus == 'Y' && event.value.settlement == 'N' && this.ismodify === 'N') {
          this.openToast('Please Close the Settlement');
          localStorage.setItem('settlementtable', 'Y');
        }
        else if (event.value.billedstatus == 'Y' && event.value.settlement == 'Y') {
          localStorage.setItem('settlementtable', 'N');
        }
        else {
          localStorage.setItem('settlementtable', 'N');
        }
      }
      else {
        localStorage.setItem('tableid', event.value.id);
        localStorage.setItem('tablename', event.value.tno);
        var dayenddate = localStorage.getItem('dayenddate');
        var tablesql = "select count(*) as count ,orderid from sr_orders_tbl where restid=" + this.restid + " AND branchid='" + this.branchid + "' AND billedstatus='Y' AND Settlement='N' And TableNo=" + event.value.id + " AND billdate='" + dayenddate + "' Limit 0,1;";
        this.sqlservice.dayendaut3(tablesql).then((res) => {
          var count = res[0].count;
          var orderid = res[0].orderid;
          if (orderid != undefined && count > 0) {

            let navigationExtras: NavigationExtras = {
              queryParams: {
                orderid: orderid
              }
            };
            this.router.navigate(['settlement'], navigationExtras);
          }
          else {
            var tablesql = "select count(*) as count ,orderid,billedstatus from sr_orders_tbl where restid=" + this.restid + " AND branchid='" + this.branchid + "' AND billedstatus='N'  And TableNo=" + event.value.id + " AND billdate='" + dayenddate + "' Limit 0,1;";
            this.sqlservice.dayendaut3(tablesql).then((res) => {
              var count = res[0].count;
              var orderid = res[0].orderid;
              if (count > 0 && orderid != null) {
                localStorage.setItem('orderid', orderid);
                localStorage.setItem('order_id', orderid);
                this.ionViewDidEnter();
              }
              else {
                localStorage.setItem('orderid', '');
                localStorage.setItem('order_id', '');
                this.cartdetails = [];
                this.cartService.removeAllCartItems();
                this.cartItems = 0;
                this.ionViewDidEnter();
              }
            });
          }
        })
      }
    }
  }

  async clearcart_tbl(title, tableid, tablename, orderid, billstatus, settlement) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      subHeader: title,
      buttons: [
        {
          text: 'No',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Yes',
          handler: (data: any) => {
            localStorage.setItem('tableid', tableid);
            localStorage.setItem('tablename', tablename);
            if (orderid == undefined) {
              localStorage.setItem('orderid', '');
              localStorage.setItem('order_id', '');
              this.cartdetails = [];
              this.cartService.removeAllCartItems();
              this.cartItems = 0;
            }
            else if (billstatus == 'N' && settlement == 'N') {
              localStorage.setItem('orderid', orderid);
              localStorage.setItem('order_id', orderid);
            }
            else if (billstatus == 'Y' && settlement == 'N') {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  orderid: orderid
                }
              };
              this.router.navigate(['settlement'], navigationExtras);
            }
            this.ionViewDidEnter();
          }
        }
      ]
    })

    await alert.present();
  }

  //Captain
  captainChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {

    this.captainid = event.value.id;

  }

  //ONline Reference Master
  onlinerefermstr() {
    var sql = "SELECT a.id,a.descr,a.status,a.paymodeid,a.autosettle,a.onlinerefdriver,a.autodriverassign,a.onliemobile,a.settlementtype,b.custname,b.custaddr,b.custemail,b.landmark,c.waitername FROM sr_onlinereferal_mstr a LEFT JOIN sr_custmaster_tbl b ON a.onliemobile=b.custmobile LEFT JOIN sr_waiter_name_tbl c ON a.onlinerefdriver=c.empcode WHERE a.restid=" + this.restid + " AND a.branchid='" + this.branchid + "' ORDER BY a.displayorder ASC";
    this.sqlservice.fetchdet(sql).then((res) => {
      this.onlinerefmstr = res;
      if (this.onlirefid != 0) {
        for (var i = 0; i < this.onlinerefmstr.length; i++) {
          if (this.onlinerefmstr[i].id == this.onlirefid) {
            this.onlinerefvalue = this.onlinerefmstr[i];
          }
        }
      }
      localStorage.setItem('onlinereferencemaster', JSON.stringify(this.onlinerefmstr));
    });
  }

  //Online Reference change
  onlinerefChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    var cartlist = 0;
    for (var i = 0; i < this.cartdetails.length; i++) {
      if (this.cartdetails[i].count > 0) {
        cartlist++;

      }
    }
    if (cartlist > 0) {
      this.whileonlinerefchange("If You Change Online Paid Type Or Reference Site Then Previous Data Will Erase?", event.value.id, this.onlirefid);

    }
    else {
      this.onlirefid = event.value.id;
      console.log(this.onlirefid);
    }
  }

  //Alert will come while change reference site when cart is not empty
  async whileonlinerefchange(msg, refid, alrefid) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      subHeader: msg,
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Canceled', data);
            for (var i = 0; i < this.onlinerefmstr.length; i++) {
              if (this.onlinerefmstr[i].id == alrefid) {
                this.onlinerefvalue = this.onlinerefmstr[i];
              }
            }
          }
        },
        {
          text: 'Proceed',
          handler: (data: any) => {
            this.cartService.removeAllCartItems();
            this.cartItems = 0;
            this.ionViewDidEnter();
            this.onlirefid = refid;
            this.categories();
            console.log(this.onlirefid);


          }
        }
      ]
    })

    await alert.present();
  }

  //Waiter change
  waiterChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.waiterid = event.value.empcode;
  }

  //Change ordertype
  ordertype(res) {
    localStorage.setItem('ordertype', res);
    localStorage.setItem('orderid', '');
    localStorage.setItem('order_id', '');
    this.ionViewDidEnter();
  }


  //Floor List
  floor() {
    this.sqlservice.floor(this.branchid, this.restid).then((response) => {
      this.floor1 = response;
      this.changefloorlist = this.floor1.filter(value => value.fid !== this.floorid);
      const floor = this.floor1.filter(x => x.fid === this.floorid);
      if (floor.length > 0) {
        this.acfloor = floor[0].acfloor;
        this.floorvalue = floor[0];
        this.order_type = floor[0].ordertype;
        this.floorname = floor[0].descr;
        this.cust = this.order_type;
        localStorage.setItem('ordertype', this.order_type);
        localStorage.setItem('FloorId', floor[0].fid);
      }
      this.getBillCount(this.restid, this.branchid, floor[0].fid);
      localStorage.setItem('floorlist', JSON.stringify(this.floor1));
      this.table(this.floorvalue.fid);
      this.todaysorder()
    })


  }

  //Table List
  table(floorid) {
    localStorage.setItem('FloorId', this.floorid.toString());
    let ordertype: string = localStorage.getItem('ordertype');
    var tableid = (localStorage.getItem('tableid') ? localStorage.getItem('tableid') : 0);
    if (this.oneuiinstance == "H") {
      var tabllist2 = [];
      var tabllist = [];
      var data = JSON.stringify({ floorid: floorid, tableid: 0, restid: this.restid, branchid: this.branchid });
      this.apiService.tablelist(data).subscribe(res => {
        tabllist = JSON.parse(res.comtablelist);
        if (res.tablelist != null && res.tablelist != "" && res.tablelist != undefined) {
          tabllist2 = JSON.parse(res.tablelist)
        }
        for (var i = 0; i < tabllist.length; i++) {
          for (var j = 0; j < tabllist2.length; j++) {

            if (tabllist[i].id == tabllist2[j].id) {
              tabllist[i].billedstatus = tabllist2[j].billedstatus;
              tabllist[i].orderid = tabllist2[j].orderid;
              tabllist[i].noofpeople = tabllist2[j].nofpeople;
              tabllist[i].waiterid = tabllist2[j].waiterid;
              tabllist[i].captainid = tabllist2[j].captainid;
              tabllist[i].custname = tabllist2[j].custname;
              tabllist[i].custmob = tabllist2[j].custmob;
              tabllist[i].custemail = tabllist2[j].custemail;
              tabllist[i].discby = tabllist2[j].discby;
              tabllist[i].discper = tabllist2[j].discper;
              tabllist[i].discprice = tabllist2[j].discprice;
              tabllist[i].settlement = tabllist2[j].settlement;
            }
          }
        }
        this.table1 = tabllist;

        if (tableid != 0) {
          for (var i = 0; i < this.table1.length; i++) {
            if (this.table1[i].id == tableid) {
              this.tablevalue = this.table1[i];
              if (this.table1[i].orderid == undefined) {
                localStorage.setItem('orderid', '');
                localStorage.setItem('order_id', '');
              }
              else if (this.table1[i].billedstatus == 'N' && this.table1[i].settlement == 'N' && ordertype === orderfrom.DINE_IN) {
                this.loadtable(this.table1[i].orderid)
                localStorage.setItem('orderid', this.table1[i].orderid);
                localStorage.setItem('order_id', this.table1[i].orderid);
              }
              else if (this.table1[i].billedstatus == 'Y' && this.table1[i].settlement == 'N' && this.ismodify === 'N') {
                this.openToast('Please Close the Settlement');
              }
            }
          }
        }
        localStorage.setItem('tablelist', JSON.stringify(this.table1));
      })
    } else {
      this.sqlservice.tablelist(floorid, this.branchid, this.restid).then((res) => {
        this.table1 = res;
        if (tableid != 0) {
          for (var i = 0; i < this.table1.length; i++) {
            if (this.table1[i].id == tableid) {
              this.tablevalue = this.table1[i];
              if (this.table1[i].orderid == undefined) {
                localStorage.setItem('orderid', '');
                localStorage.setItem('order_id', '');
                if (this.table1[i].actable == 'Y') {
                  this.hallType = 'Ac';
                }
              }
              else if (this.table1[i].billedstatus == 'N' && this.table1[i].settlement == 'N') {
                localStorage.setItem('orderid', this.table1[i].orderid);
                localStorage.setItem('order_id', this.table1[i].orderid);
              }
              else if (this.table1[i].billedstatus == 'Y' && this.table1[i].settlement == 'N' && this.ismodify === 'N') {
                this.openToast('Please Close the Settlement');
              }
            }
          }
        }
        else {
          this.tablevalue = undefined;
        }
        localStorage.setItem('tablelist', JSON.stringify(this.table1));
        // this.ionViewDidEnter();
      });
    }
  }

  //Waiter List
  async waiter() {
    this.waiter1 = await this.sqlservice.waiterlist(this.branchid, this.restid)
    if (this.waiterid != 1) {
      for (var i = 0; i < this.waiter1.length; i++) {
        if (this.waiter1[i].wid == this.waiterid) {
          this.waitervalue = this.waiter1[i];
          break;
        }
      }
    }
    localStorage.setItem('waiter', JSON.stringify(this.waiter1));
  }
  //captain List
  async captain() {
    this.captain1 = await this.sqlservice.captainlist(this.branchid, this.restid)
    if (this.captainid != 0) {
      for (var i = 0; i < this.captain1.length; i++) {
        if (this.captain1[i].id == this.captainid) {
          this.captainvalue = this.captain1[i];
          break;
        }
      }
    }
    localStorage.setItem('captainlist', JSON.stringify(this.captain1));
  }


  // billing_focus1() {
  //   var billingfocus1 = "SELECT * FROM sr_billingpage_columnfocus_mstr_tbl WHERE restid=" + this.restid + " AND branchid='" + this.branchid + "'";
  //   this.sqlservice.billingfocus(billingfocus1).then((res) => {
  //     this.billingfocus1 = res;
  //     console.log(this.billingfocus1);

  //   });
  // }

  todaysorder() {
    if (this.oneuiinstance === 'C') {
      let today = this.datePipe.transform(this.today, 'yyyy-MM-dd');
      var sql = `SELECT a.orderid,a.ordertype,a.createdate,a.totalprice,a.tokenno,a.onlineref,b.tableno
      FROM sr_orders_tbl a LEFT JOIN sr_table_no_tbl b ON b.id=a.tableno WHERE a.billedstatus = 'N' AND a.settlement = 'N' AND ordfloorid = ${this.floorvalue.fid}
      AND a.restid=${this.restid} AND a.branchid='${this.branchid}' AND a.billdate='${today}' GROUP BY a.orderid`;
      this.sqlservice.runningorder(sql).then((res) => {
        this.orderlist = [];
        this.todayorder = [];
        this.orderlist = res;
        this._getTimming();
      });
    } else {
      let today = this.datePipe.transform(this.today, 'yyyy-MM-dd');
      var data = JSON.stringify({ restid: this.restid, branchid: this.branchid, billtime: today });
      console.log(sql);
      this.apiService.runningorder(data).subscribe((res) => {
        this.orderlist = [];
        this.todayorder = [];
        if (res !== null) {
          if (res.data.runningList !== null && res.data.runningList.length > 0) {
            this.orderlist = res.data.runningList;
            this._getTimming();
          }
        }
      });
    }
  }

  private _getTimming() {
    for (var j = 0; j < this.orderlist.length; j++) {
      let date = new Date(this.datePipe.transform(this.currenttime, 'yyyy-MM-dd h:mm:ss'));
      let date1 = new Date(this.datePipe.transform(this.orderlist[j].createdate, 'yyyy-MM-dd h:mm:ss'));
      let diffInMs = (date.getTime() - date1.getTime()) / (1000 * 60);
      this.orderlist[j].totalprice = parseFloat(this.orderlist[j].totalprice).toFixed(this.decimalpoint);
      if (this.orderlist[j].onlineref != 0) {
        var onlinereferencemaster = JSON.parse(localStorage.getItem('onlinereferencemaster'));
        for (var k = 0; k < onlinereferencemaster.length; k++) {
          if (onlinereferencemaster[k].id == this.orderlist[j].onlineref) {
            this.orderlist[j].onlinerefname = onlinereferencemaster[k].descr;
          }
        }
      } else {
        this.orderlist[j].onlinerefname = '';
      }
      this.orderlist[j].occupytime = parseInt(diffInMs.toString());
      this.todayorder.push(this.orderlist[j]);
    }
  }

  continue() {
    var count = 0;
    var man_count = 0;
    var mandatory = "";
    //  console.log(this.data.pax);
    if (this.cust == "E") {
      for (var i = 0; i < this.billingfocus1.length; i++) {
        console.log(this.billingfocus1[i].di_mandatory);

        if (this.billingfocus1[i].di_mandatory == "Y") {
          man_count = man_count + 1;
          if (this.billingfocus1[i].focusid == "tableno") {
            var tableid = (localStorage.getItem('tableid') != undefined) ? localStorage.getItem('tableid') : '0';
            if (tableid != "0")
              count = count + 1;
            else {
              mandatory = "Table No";
              break;
            }
          }
          else if (this.billingfocus1[i].focusid == "cname") {
            if (this.cusname != undefined && this.cusname != "" && this.cusname != null)
              count = count + 1;
            else {
              mandatory = "Customer Name";
              break;
            }

          }
          else if (this.billingfocus1[i].focusid == "cphone") {
            if (this.cusnumber != undefined && this.cusnumber != "" && this.cusnumber != null)
              count = count + 1;
            else {
              mandatory = "Customer Number";
              break;
            }

          }
          else if (this.billingfocus1[i].focusid == "drpwaiter") {
            if (this.captainid != undefined && this.captainid != "" && this.captainid != null)
              count = count + 1;
            else {
              mandatory = "Captain Name";
              break;
            }

          } else if (this.billingfocus1[i].focusid == "cadd") {
            if (this.address != undefined && this.address != "" && this.address != null)
              count = count + 1;
            else {
              mandatory = "Address";
              break;
            }

          }

        }
      }
    }
    if (this.cust == "P") {

      for (var i = 0; i < this.billingfocus1.length; i++) {
        console.log(this.billingfocus1[i].ta_mandatory);

        if (this.billingfocus1[i].ta_mandatory == "Y") {
          man_count = man_count + 1;
          if (this.billingfocus1[i].focusid == "tableno") {
            var tableid = (localStorage.getItem('tableid') != undefined) ? localStorage.getItem('tableid') : '0';
            if (tableid != "0")
              count = count + 1;
            else {
              mandatory = "Table No";
              break;
            }
          }
          else if (this.billingfocus1[i].focusid == "cname") {
            if (this.cusname != undefined && this.cusname != "" && this.cusname != null)
              count = count + 1;
            else {
              mandatory = "Customer Name";
              break;
            }

          }
          else if (this.billingfocus1[i].focusid == "cphone") {
            if (this.cusnumber != undefined && this.cusnumber != "" && this.cusnumber != null)
              count = count + 1;
            else {
              mandatory = "Customer Number";
              break;
            }

          }
          else if (this.billingfocus1[i].focusid == "drpwaiter") {
            if (this.captainid != undefined && this.captainid != "" && this.captainid != null)
              count = count + 1;
            else {
              mandatory = "Captain Name";
              break;
            }

          } else if (this.billingfocus1[i].focusid == "cadd") {
            if (this.address != undefined && this.address != "" && this.address != null)
              count = count + 1;
            else {
              mandatory = "Address";
              break;
            }

          }

        }
      }
    }
    if (this.cust == "D") {

      for (var i = 0; i < this.billingfocus1.length; i++) {
        console.log(this.billingfocus1[i].d_mandatory);

        if (this.billingfocus1[i].d_mandatory == "Y") {
          man_count = man_count + 1;
          if (this.billingfocus1[i].focusid == "tableno") {
            var tableid = (localStorage.getItem('tableid') != undefined) ? localStorage.getItem('tableid') : '0';
            if (tableid != "0")
              count = count + 1;
            else {
              mandatory = "Table No";
              break;
            }
          }
          else if (this.billingfocus1[i].focusid == "cname") {
            if (this.cusname != undefined && this.cusname != "" && this.cusname != null)
              count = count + 1;
            else {
              mandatory = "Customer Name";
              break;
            }

          }
          else if (this.billingfocus1[i].focusid == "cphone") {
            if (this.cusnumber != undefined && this.cusnumber != "" && this.cusnumber != null)
              count = count + 1;
            else {
              mandatory = "Customer Number";
              break;
            }

          }
          else if (this.billingfocus1[i].focusid == "drpwaiter") {
            if (this.captainid != undefined && this.captainid != "" && this.captainid != null)
              count = count + 1;
            else {
              mandatory = "Captain Name";
              break;
            }

          } else if (this.billingfocus1[i].focusid == "cadd") {
            if (this.address != undefined && this.address != "" && this.address != null)
              count = count + 1;
            else {
              mandatory = "Address";
              break;
            }

          }

        }
      }
    }

    console.log(man_count);
    console.log(count);
    if (man_count == count) {
      this.flag = 1;
      localStorage.setItem('cust', this.cusname);
    }
    else {
      this.openToast(mandatory + " is Mandatory...!");
    }

  }

  //New Order
  neworder() {
    console.log("new order");
    localStorage.removeItem('orderid');
    localStorage.removeItem('order_id');
    localStorage.removeItem('tablename')
    var ordertype = localStorage.getItem('ordertype');
    if (ordertype == 'E') {
      var tableid = localStorage.getItem('tableid');
      for (var i = 0; i < this.table1.length; i++) {
        if (this.table1[i].id == tableid) {
          if (this.table1[i].orderid !== undefined) {
            localStorage.setItem('orderid', '');
            localStorage.setItem('order_id', '');
            localStorage.setItem('tableid', '0');
            this.cartService.removeAllCartItems();
            this.tablevalue = undefined;
            if (this.tableComponent !== undefined) {
              this.tableComponent.clear();
            }
            this.cartItems = 0;
          }
          else if (this.table1[i].billedstatus == 'N' && this.table1[i].settlement == 'N') {
            localStorage.setItem('orderid', this.table1[i].orderid);
            localStorage.setItem('order_id', this.table1[i].orderid);
          }
          else if (this.table1[i].billedstatus == 'Y' && this.table1[i].settlement == 'N' && this.ismodify === 'N') {
            this.openToast('Please Close the Settlement');
          }
          break;
        }
      }
      localStorage.setItem('orderid', '');
      localStorage.setItem('order_id', '');
    }
    else {
      localStorage.setItem('orderid', '');
      localStorage.setItem('order_id', '');
      this.cartService.removeAllCartItems();
      this.cartItems = 0;
    }
    if (this.captainComponent !== undefined) {
      this.captainComponent.clear();
    }
    if (this.waiterComponent !== undefined) {
      this.waiterComponent.clear();
    }
    if (this.onlinecomponent !== undefined) {
      this.onlinecomponent.clear();
    }
    this.noofpax = 1;
    this.waiterid = 0;
    this.captainid = 0;
    this.discby = "P";
    this.discperc = "0";
    this.discamnt = "0";
    this.cartItems = 0;
    this.ionViewDidEnter();
  }

  existingorder(cart, orderid) {
    console.log(cart);
    var knoterem = '';
    if (cart.remarks == '(Take-Away)')
      cart.remarks = '';
    if (cart.knotes != '' && cart.remarks == '') {
      knoterem = cart.knotes;
    }
    else if (cart.knotes == '' && cart.remarks != '') {
      knoterem = cart.remarks;
    }
    else if (cart.knotes == '' && cart.remarks == '') {
      knoterem = '';
    }
    else {
      knoterem = cart.knotes + ', ' + cart.remarks;
    }
    var product_price = parseFloat(cart.itemprice) / parseFloat(cart.itemqty);
    var cartProduct = {
      product_id: cart.menuid,
      itemid: cart.menuid,
      name: cart.name,
      count: cart.itemqty,
      ordersummaryid: cart.ordersummaryid,
      orderid: orderid,
      singlePrice: product_price,
      totalPrice: cart.itemprice,
      tax_struct_id: cart.structid,
      packingcharge: cart.packingcharge,
      packingchargetype: cart.packingchargetype,
      packingtaxid: cart.packingtaxid,
      currentstatus: cart.currentstatus,
      checked: false,
      knotes: cart.knotes,
      remarks: cart.remarks,
      knoterem: knoterem,
      add: '',
      modparent: cart.modparent,
      combomenu: [],
      idiscprice: cart.idiscprice,
      idiscperc: cart.idiscperc
    };
    return cartProduct;

  }

  logout() {
    this.authService.logout();
  }

  //Categories
  async categories() {
    this.iscat = false;
    this.category = await this.sqlservice.categories(this.branchid, this.restid)
    this.iscat = true;
    await this.menudetail(this.category[0].id);
  }

  async menudetail(catid) {
    this.ismenu = false;
    var sql = '';
    sql += "SELECT a.MenuID,a.Name,a.price,IFNULL(a.parcelprice,'0.00') AS parcelprice,a.calories,a.combotype,a.image,";
    sql += " IFNULL(a.acprice,'0.00')AS acprice,a.itemparent,IFNULL(a.roomprice,'0.00') AS roomprice,";
    sql += " IFNULL(a.deliveryprice,'0.00') AS delivprice,a.AcDineInTax,a.NonAcDineInTax,a.TAwayTax,";
    sql += " a.DelivTax,a.RoomServTax,IFNULL(a.happyprice,'0.00') AS happyprice,IFNULL(a.happyacprice,'0.00') AS happyacprice,";
    sql += " IFNULL(a.IncludeDiscount,'Y') AS includediscount,IFNULL(a.OtherTaxID,0) AS othertaxid,";
    sql += " (a.FloorId) floorid,IFNULL(a.barcode,'') AS barcode,a.Itemallowdecimalqty,IFNULL(p.packingcharge,'0') AS packingcharge, ";
    sql += " IFNULL(p.packingchargetype,'F') packingchargetype,IFNULL(p.taxid,'0') AS packingtaxid,IFNULL(a.selfsprice,'0.00') AS selfsprice,a.selfstax  AS selfstax,a.ProdEnable,";
    sql += " ROUND(IFNULL(MIN(pc.availableqty/mp.quantity),0),2) AS productionItemCount,CASE WHEN (mp.menuid = a.MenuID) THEN TRUE ELSE FALSE END  as productionMappingStatus,itemtype FROM sr_menumstr_tbl a";
    sql += " LEFT JOIN sr_menu_parcelcharge_tbl p ON p.parcelchargeid=a.PackagingChargeID AND a.restid=p.restid AND a.branchid=p.branchid";
    sql += " LEFT JOIN  sr_menuproduction_tbl mp ON mp.menuid =  a.MenuID AND mp.restid=a.restid AND mp.branchid=a.branchid";
    sql += " LEFT JOIN  sr_productionmstr_tbl pc ON pc.productionid = mp.productionid AND pc.restid=a.restid AND pc.branchid=a.branchid";
    sql += " WHERE a.itemlevel='2'AND a.ItemStatus='A' AND ItemParent='" + catid + "' AND a.restid=" + this.restid + "  AND a.branchid='" + this.branchid + "' GROUP BY a.menuid ORDER BY a.displayorder";
    this.catid = catid;
    this.menus = [];
    this.sqlservice.menumaster(sql).then(async (res) => {
      for (var i = 0; i < res.length; i++) {
        if (res[i].combotype != 'C') {
          var ordertype = localStorage.getItem('ordertype');
          if (ordertype == 'P') {
            res[i].price = +res[i].parcelprice;
            this.hallType = 'Parcel';
          }
          else if (ordertype == 'D') {
            res[i].price = +res[i].delivprice;
            this.hallType = 'Delivery';
          }
          else if (ordertype == 'E') {
            res[i].price = +res[i].price;
            this.hallType = 'NonAc';
          }
          else if (ordertype == 'S') {
            res[i].price = +res[i].selfsprice;
            this.hallType = 'Self Service';
          }
          else if (ordertype == 'R') {
            res[i].price = +res[i].roomprice;
            this.hallType = 'Room Service';
          }

          if (res[i].productionMappingStatus === 0) {
            res[i].productionMappingStatus = false;
          } else {
            res[i].productionMappingStatus = true;
          }
          if (this.oneuiinstance === 'H') {
            for (let j = 0; j < this.productionDetails.length; j++) {
              if (res[i]?.id == this.productionDetails[j].menuid) {
                res[i].productionItemCount = this.productionDetails[j].productionCount;
                if (this.productionDetails[j].productionStatus === 0) {
                  res[i].productionMappingStatus = false;
                } else {
                  res[i].productionMappingStatus = true;
                }
              }
            }
          }
          res[i].modparent = "0";
          this.menus.push(res[i]);
        }
      }
      this.ismenu = true;
    })

    if (this.onlirefid != 0) {
      var sql1 = "SELECT menuid,orefid,price FROM sr_menumstr_oref_tbl WHERE restid=" + this.restid + " AND branchid='" + this.branchid + "' AND orefId=" + this.onlirefid;
      this.sqlservice.fetchdet(sql1).then((res) => {
        //console.log(res);
        for (var i = 0; i < this.menus.length; i++) {
          for (var j = 0; j < res.length; j++) {
            if (this.menus[i].id == res[j].menuid) {
              this.menus[i].price = res[j].price;
            }
          }
        }
      });

    }


    console.log(this.menus);
    this.cartService.getCartItems().then((val) => {
      if (val) {

        for (var i = 0; i < this.menus.length; i++) {
          for (var k = 0; k < val.length; k++) {
            if (val[k].product_id == this.menus[i]["id"] && val[k].currentstatus == "") {
              this.menus[i]["qty"] = val[k].count;
            }
          }
        }
      }
    });

  }

  //Add from Menu
  async add(product) {
    product.add = '';
    if (product.takeaway == 'Y') {
      this.menus.find(item => item.id == product.id).parcelprice = product.price;
    }
    var ordertype = localStorage.getItem('ordertype');
    let isHappyHourEnable = localStorage.getItem('isHappyHourEnable');
    var tax = 0;
    tax = this._taxAmount(ordertype, tax, product);
    var taxarray = this.getGstTaxPerc(tax);
    if (taxarray.length == 0) {
      this.openToast("Please Map the TaxStructure for this item")
    } else {
      if (product.productionMappingStatus === false) {
        product.qty++;
        product.tax_struct_id = tax;
        if (product.calories == '') {
          product.calories = 0;
        }
        if (isHappyHourEnable === 'Y') {
          product = await this._happyHours(this.restid, this.branchid, product);
        }
        var cartProduct = this._productDetails(product);
        this.cartService.addToCart(cartProduct).then((val) => {
          this.cartTotal();
        });
      } else {
        if (product.ProdEnable === 'Y') {
          if (product.productionItemCount > 0) {
            product.qty++;
            let qty = 0;
            if (this.oneuiinstance === "C") {
              qty = await this.productionService._productionItemQty(this.restid, this.branchid, product.id);
            } else {
              qty = this.productionDetails.find(x => x.menuid === product.id).qty;
            }
            product.productionItemCount = product.productionItemCount - qty;
            product.tax_struct_id = tax;
            if (product.calories == '') {
              product.calories = 0;
            }
            if (isHappyHourEnable === 'Y') {
              product = await this._happyHours(this.restid, this.branchid, product);
            }
            var cartProduct = this._productDetails(product);
            this.cartService.addToCart(cartProduct).then((val) => {
              this.cartTotal();
            });
          } else {
            this.openToast(`${product.name} - Production Item Count Zero`)
          }
        } else {
          if (product.productionItemCount < 0) {
            this.openToast(`${product.name} - Production Item Count Zero`)
          }
          product.qty++;
          let qty = 0;
          if (this.oneuiinstance === "C") {
            qty = await this.productionService._productionItemQty(this.restid, this.branchid, product.id);
          } else {
            qty = this.productionDetails.find(x => x.menuid === product.id).qty;
          }
          product.productionItemCount = product.productionItemCount - qty;
          product.tax_struct_id = tax;
          if (product.calories == '') {
            product.calories = 0;
          }
          if (isHappyHourEnable === 'Y') {
            product = await this._happyHours(this.restid, this.branchid, product);
          }
          var cartProduct = this._productDetails(product);
          this.cartService.addToCart(cartProduct).then((val) => {
            this.cartTotal();
          });
        }
      }
    }

  }

  private _taxAmount(ordertype: string, tax: number, product: any) {
    if (ordertype == 'E') {
      tax = product.NonAcDineInTax;
    }
    else if (ordertype == 'P') {
      tax = product.TAwayTax;
    }
    else if (ordertype == 'D') {
      tax = product.DelivTax;
    }
    else if (ordertype == 'S') {
      tax = product.selfstax;
    }
    else if (ordertype == 'R') {
      tax = product.RoomServTax;
    }
    return tax;
  }

  //Add from Cart
  async add_cart(product) {

    var tax = 0;
    if (product.takeaway == 'Y') {
      for (let i = 0; i < this.menus.length; i++) {
        if (product.id == this.menus[i].id) {
          product.price = this.menus[i]?.parcelprice;
          break;
        }
      }
      // this.menus.find(item => item.id == product.id).parcelprice = product.price;
    }
    product.add = '';
    let isHappyHourEnable = localStorage.getItem('isHappyHourEnable');
    var ordertype = localStorage.getItem('ordertype');
    tax = this._taxAmount(ordertype, tax, product);
    if (product.productionMappingStatus === false) {
      product.qty++;
      if (isHappyHourEnable === 'Y') {
        product = await this._happyHours(this.restid, this.branchid, product);
      }
      var cartProduct = this._productDetails(product);
      this.menus.filter(item => item.id == product.id).map(x => x.qty = product?.qty);
      this.cartService.addToCart(cartProduct).then((val) => {
        console.log(val);
        this.cartTotal();
      });
    } else {
      if (product.ProdEnable === 'Y') {
        if (product.productionItemCount > 0) {
          let qty = 0;
          if (this.oneuiinstance === "C") {
            qty = await this.productionService._productionItemQty(this.restid, this.branchid, product.id);
          } else {
            qty = this.productionDetails.find(x => x.menuid === product.id).qty;
          }
          product.productionItemCount = product.productionItemCount - qty;
          product.qty++;
          this.menus.find(item => item.id == product.id).productionItemCount = product?.productionItemCount;

          if (isHappyHourEnable === 'Y') {
            product = await this._happyHours(this.restid, this.branchid, product);
          }
          var cartProduct = this._productDetails(product);
          this.menus.filter(item => item.id == product.id).map(x => x.qty = product?.qty);
          this.cartService.addToCart(cartProduct).then((val) => {
            console.log(val);
            this.cartTotal();
          });
        } else {
          this.openToast(`${product.name} - Production Item Count Zero`)
        }
      } else {
        if (product.productionItemCount < 0) {
          this.openToast(`${product.name} - Production Item Count Zero`)
        }
        let qty = 0;
        if (this.oneuiinstance === "C") {
          qty = await this.productionService._productionItemQty(this.restid, this.branchid, product.id);
        } else {
          qty = this.productionDetails.find(x => x.menuid === product.id).qty;
        }
        product.productionItemCount = product.productionItemCount - qty;
        product.qty++;
        this.menus.find(item => item.id == product.id).productionItemCount = product?.productionItemCount;
        if (isHappyHourEnable === 'Y') {
          product = await this._happyHours(this.restid, this.branchid, product);
        }
        var cartProduct = this._productDetails(product);
        this.menus.filter(item => item.id == product.id).map(x => x.qty = product?.qty);
        this.cartService.addToCart(cartProduct).then((val) => {
          console.log(val);
          this.cartTotal();
        });
      }
    }
  }

  private _productDetails(product: any) {
    var productPrice = Number(product.qty) * parseFloat(product.price);
    var calories = Number(product.qty) * parseInt(product.calories);
    if (product.itemallowdecimalqty == 'Y') {
      product.qty = Number(product.qty).toFixed(2)
    } else {
      product.qty = product.qty;
    }
    var cartProduct = {
      id: product.id,
      product_id: product.id,
      name: product.name,
      count: product.qty,
      qty: product.qty,
      singlePrice: product.price,
      price: product.price,
      totalPrice: productPrice,
      tax_struct_id: product.tax_struct_id,
      packingcharge: product.packingcharge,
      packingchargetype: product.packingchargetype,
      packingtaxid: product.packingtaxid,
      includediscount: product.includediscount,
      calories: calories,
      add: product.add,
      checked: false,
      currentstatus: "",
      modparent: product.modparent,
      combotype: product.combotype,
      combomenu: [],
      productionItemCount: product.productionItemCount,
      productionMappingStatus: product.productionMappingStatus,
      ProdEnable: product.ProdEnable,
      itemparent: product.itemparent,
      itemallowdecimalqty: product.itemallowdecimalqty
    };
    var combomenu = [];
    if (cartProduct.combotype == "M") {
      for (var i = 0; i < this.comboitems.length; i++) {
        if (this.comboitems[i].menuparentid == cartProduct.product_id) {
          this.comboitems[i].qty = cartProduct.count;
          this.comboitems[i].price = 0;
          combomenu.push(this.comboitems[i]);
        }
      }
      cartProduct.combomenu = combomenu;
    }
    return cartProduct;
  }
  //Minus item from cart
  async minus_cart(product) {
    product.add = '';
    if (product.takeaway == 'Y') {
      this.menus.find(item => item.id == product.id).parcelprice = product.price;
    }
    let isHappyHourEnable = localStorage.getItem('isHappyHourEnable');
    if (product.productionMappingStatus === false) {
      if (product.qty >= 1) {
        product.qty--;
      } else {
        product.qty = 0;
      } if (product.qty > 0) {

        if (isHappyHourEnable === 'Y') {
          product = await this._happyHours(this.restid, this.branchid, product);
        }
        var cartProduct = this._productDetails(product);
        this.menus.filter(item => item.id == product.id).map(x => x.qty = product?.qty);
        this.cartService.addToCart(cartProduct).then((val) => {
          console.log(val);
          this.cartTotal();
        });
      } else {
        this.minuscart(product);
      }
    } else {
      if (product.ProdEnable === 'Y') {
        if (product.productionItemCount >= 0) {
          if (product.qty >= 1) {
            let productionCount = [];
            let qty = 0
            if (this.oneuiinstance === "C") {
              productionCount = await this.productionService._getProductionDetails(this.restid, this.branchid, product.id);
              qty = await this.productionService._productionItemQty(this.restid, this.branchid, product.id);
              if (productionCount[0].ClosingQty >= product.productionItemCount) {
                product.productionItemCount = product.productionItemCount + qty;
              }
            } else {
              productionCount = this.productionDetails.filter(x => x.menuid === product.id);
              qty = this.productionDetails.find(x => x.menuid === product.id)?.qty;
              if (productionCount[0].closingqty >= product.productionItemCount) {
                product.productionItemCount = product.productionItemCount + qty;
              }
            }
            product.qty--;
            this.menus.find(item => item.id == product.id).productionItemCount = product?.productionItemCount;
          } else {
            product.qty = 0;
          } 
          
          if (product.qty > 0) {

            if (isHappyHourEnable === 'Y') {
              product = await this._happyHours(this.restid, this.branchid, product);
            }
            var cartProduct = this._productDetails(product);
            this.menus.filter(item => item.id == product.id).map(x => x.qty = product?.qty);
            this.menus.find(item => item.id == product.id).productionItemCount = product.productionItemCount;
            this.cartService.addToCart(cartProduct).then((val) => {
              console.log(val);
              this.cartTotal();
            });
          } else {
            this.minuscart(product);
          }
        }
      } else {
        if (product.qty >= 1) {
          let productionCount = [];
          let qty = 0
          if (this.oneuiinstance === "C") {
            productionCount = await this.productionService._getProductionDetails(this.restid, this.branchid, product.id);
            qty = await this.productionService._productionItemQty(this.restid, this.branchid, product.id);
            if (productionCount[0].ClosingQty >= product.productionItemCount) {
              product.productionItemCount = product.productionItemCount + qty;
            }
          } else {
            productionCount = this.productionDetails.filter(x => x.menuid === product.id);
            qty = this.productionDetails.find(x => x.menuid === product.id)?.qty;
            if (productionCount[0].closingqty >= product.productionItemCount) {
              product.productionItemCount = product.productionItemCount + qty;
            }
          }
          product.qty--;
          this.menus.find(item => item.id == product.id).productionItemCount = product?.productionItemCount;
        } else {
          product.qty = 0;
        } if (product.qty > 0) {
          if (isHappyHourEnable === 'Y') {
            product = await this._happyHours(this.restid, this.branchid, product);
          }
          var cartProduct = this._productDetails(product);
          this.menus.filter(item => item.id == product.id).map(x => x.qty = product?.qty);
          this.cartService.addToCart(cartProduct).then((val) => {
            console.log(val);
            this.cartTotal();
          });
        } else {
          this.minuscart(product);
        }
      }
    }
  }

  //Alert for product reaches a zero
  async minuscart(product) {
    let isHappyHourEnable = localStorage.getItem('isHappyHourEnable');
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Do You Want To Remove Item From Cart? ',
      buttons: [
        {
          text: 'Yes',
          handler: async data => {
            console.log(product.count);

            if (isHappyHourEnable === 'Y') {
              product = await this._happyHours(this.restid, this.branchid, product);
            }
            var cartProduct = this._productDetails(product);
            this.menus.filter(item => item.id == product.id).map(x => x.qty = product?.qty);
            this.cartService.addToCart(cartProduct).then((val) => {
              console.log(val);
              if (this.grandtotal !== '0') {
                this.discperc = 0;
              }
              this.cartTotal();
              this.categories();
            });
          }
        }, {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async data => {
            product.count = 1;
            product.qty = 1;
            let qty = 0;
            if (this.oneuiinstance === "C") {
              qty = await this.productionService._productionItemQty(this.restid, this.branchid, product.id);
            } else {
              qty = this.productionDetails.find(x => x.menuid === product.id).qty;
            }
            product.productionItemCount = product.productionItemCount - qty;
            var cartProduct = this._productDetails(product);
            this.menus.find(item => item.id == product.id).productionItemCount = product?.productionItemCount;
            this.menus.filter(item => item.id == product.id).map(x => x.qty = product?.qty);
            this.cartService.addToCart(cartProduct).then((val) => {
              console.log(val);
              this.cartTotal();
            });
          }
        }
      ]
    });

    await alert.present();
  }



  //add item from cart
  additem(product) {
    console.log(product);
    var count = 0.0;
    count = parseFloat((document.getElementById('qty' + product.product_id + product.count) as HTMLInputElement).value);
    console.log(count);
    var productPrice = count * parseFloat(product.singlePrice);
    var calories = count * parseInt(product.calories);
    var cartProduct = {
      product_id: product.product_id,
      name: product.name,
      count: count,
      singlePrice: product.singlePrice,
      totalPrice: productPrice,
      tax_struct_id: product.tax_struct_id,
      packingcharge: product.packingcharge,
      packingchargetype: product.packingchargetype,
      packingtaxid: product.packingtaxid,
      includediscount: product.includediscount,
      calories: calories,
      add: '',
      checked: false,
      currentstatus: "",
      combotype: product.combotype,
      modparent: "0",
      combomenu: []
    };
    this.cartService.addToCart(cartProduct).then((val) => {
      console.log(val);
      this.cartTotal();
    });
  }

  //Addproduct
  async addproduct(menu) {
    this.billing();
    var ordertype = localStorage.getItem('ordertype');
    var settlementtable = localStorage.getItem('settlementtable');
    if (ordertype == 'E') {
      var tableid = localStorage.getItem('tableid');
      if (tableid == '0' || tableid === null) {
        this.openToast('Please Select Table Number');
      } else {
        this.checkcombo(menu);
      }
    } else if (ordertype === 'R') {
      if (this.roomid == '0' || this.roomid == undefined || this.roomid == null || this.roomid == 'undefined' || this.roomid == '') {
        this.openToast('Please Select Room Number');
      } else {
        this.checkcombo(menu);
      }
    }
    else {
      this.checkcombo(menu);
    }
  }

  //Check Combo type for menu
  checkcombo(menu) {
    this.variance = [];
    this.parentname = "";
    console.log(this.variancemenu);
    console.log(this.comboitems);
    if (menu.combotype == 'V') {
      for (var i = 0; i < this.variancemenu.length; i++) {
        if (this.variancemenu[i].menuparentid == menu.id) {
          this.parentname = menu.name;
          this.variancemenu[i].qty = 1;
          this.variance.push(this.variancemenu[i]);
        }
      }

      if (this.width > 500)
        this.addons = 1;
      else
        this.presentModal(this.variance, 'variance');
      console.log(this.variance.length);
    }
    else if (menu.combotype == 'M') {

      this.add(menu);
    }
    else {
      this.add(menu);
    }
  }

  cartTotal() {
    return this.cartService.getCartItems().then((val) => {
      if (val) {
        console.log(val);
        this.cartdetails = val;
        this.citem = 0;
        this.ctotal = 0;
        this.cart_items = 0;
        console.log(this.cartdetails);
        for (var i = 0; i < val.length; i++) {
          this.citem = this.citem + parseFloat(val[i]["count"]);
          this.ctotal = this.ctotal + (val[i]["count"] * val[i]["singlePrice"]);
          if (val[i]["count"] > 0) {
            this.cart_items = this.cart_items + parseFloat('1');
          }
        }
        this.cartItems = this.citem;
        this.cartTotalamt = this.ctotal.toFixed(2);
        this.taxcalculation(val);
      }

    });

  }

  //cart page
  viewcart(cart_item, cartTotalamt) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        cart_item: cart_item,
        cartTotalamt: cartTotalamt,
        cusname: (this.cusname != undefined) ? this.cusname : '',
        cusnumber: (this.cusnumber != undefined) ? this.cusnumber : '',
        captainid: (this.captainid != undefined) ? this.captainid : '0',
        waiterid: (this.waiterid != undefined) ? this.waiterid : '0',
        deliverytime: (this.deliverytime != undefined) ? this.deliverytime : '1',
        noofpax: (this.noofpax != undefined) ? this.noofpax : '1',
        email: (this.cusemail != undefined) ? this.cusemail : "",
        discby: this.discby,
        discper: this.discper,
        discprice: this.discamnt,
        onlirefid: this.onlirefid,
        itemdetails: JSON.stringify(this.addcart),
        comboitems: JSON.stringify(this.comboitems),
        roomlist: this.roomid,
        roomno: this.roomid,
        htlbookid: this.htlbookid,
        HtlDesk: this.HtlDesk,
        HtlIP: this.HtlIP,
        foodenginestoreid: this.foodenginestoreid,
        htlbookname: this.htlbookname,
        htlbookmobile: this.htlbookmobile,
        ischecked: this.ischecked,
        acfloor: this.acfloor


      }
    };

    this.router.navigate(['cart'], navigationExtras);
    this.cartItems = 0;
  }

  //Get Menu code
  async menucode() {
    this.menu_code = await this.sqlservice.menucode(this.branchid, this.restid)
    const res = await this.sqlservice.config(this.branchid, this.restid)
    this.sessionwise = res[0].sessionwise;
    this.LoadMenuByAdmin = res[0].LoadMenuByAdmin;
    this.OnlineRefprice = res[0].OnlineRefprice;
    var DiscountLessTax = res[0].DiscountLessTax;
    this.decimalpoint = res[0].decimalpoint;
    localStorage.setItem('DiscountLessTax', DiscountLessTax);
    localStorage.setItem('decimalpoint', this.decimalpoint);
    localStorage.setItem('itemwisedisc', res[0].itemwisedisc);
    localStorage.setItem('billroundoff', res[0].billroundoff);
    localStorage.setItem('roundto', res[0].roundto);
    console.log(this.sessionwise);
    this.billroundoff = res[0].billroundoff;
    if (this.sessionwise != null && this.sessionwise.toUpperCase() == "Y") {
      this.ressql = await this.sqlservice.getSessionIds(this.branchid, this.restid)
    }
    if (this.LoadMenuByAdmin.toUpperCase() == "Y") {
      var userfloorlst = localStorage.getItem('FloorAccess');
      if (userfloorlst != null && userfloorlst != '0') {
        this.flooraccess = await this.sqlservice.flooraccess('a.floorid', userfloorlst)
      }
    }
  }

  //Clear search Menu
  clear() {
    this.length = 0;
    this.data.search = '';
    this.data.qty = '';
  }

  //Searchan item
  searchitem() {
    this.billing();
    var ordertype = localStorage.getItem('ordertype');
    var settlementtable = localStorage.getItem('settlementtable');

    if (ordertype == 'E') {
      var tableid = localStorage.getItem('tableid');
      if (tableid == '0') {
        this.openToast('Please Select Table Number');
        this.data.search = "";
      }
      // else if(settlementtable=='Y')
      // {
      //   this.openToast('Please Close The Settlement');
      //   this.data.search="";
      // }
      else {
        this.search();
      }
    }
    else {
      this.search();
    }
  }


  //While Search Menu
  search() {

    if (this.search_menu != undefined && this.search_menu.length != 0) {
      if (this.search_menu[0].name != this.data.search) {
        this.length = 0;
        this.data.qty = '';
      }
    }
    if (this.data.search != '') {
      var searchdata = this.data.search;
      console.log(this.search_menu);
      if (searchdata == '')
        this.search_menu = [];
      // if(this.search_menu !=undefined)
      // this.length=this.search_menu.length;
      var searchdata = this.data.search;
      var sql = '';
      var ordertype = localStorage.getItem('ordertype');
      var onlinerefid = localStorage.getItem('onlinerefid');
      if (this.OnlineRefprice != null && this.OnlineRefprice != '' && this.OnlineRefprice.toUpperCase() == 'Y' && onlinerefid != '0') {
        sql += "SELECT a.MenuID,a.Name,a.price,IFNULL(a.parcelprice,'0.00') AS parcelprice,a.calories,a.combotype,a.image,";
        sql += "IFNULL(a.acprice,'0.00')AS acprice,a.itemparent,IFNULL(a.roomprice,'0.00') AS roomprice,";
        sql += "IFNULL(a.deliveryprice,'0.00') AS delivprice,a.AcDineInTax,a.NonAcDineInTax,a.TAwayTax,";
        sql += "a.DelivTax,a.RoomServTax,IFNULL(a.happyprice,'0.00') AS happyprice,IFNULL(a.happyacprice,'0.00') AS happyacprice,IFNULL(oref.price,'0.00')AS orefprice,";
        sql += "IFNULL(a.IncludeDiscount,'Y') AS includediscount,IFNULL(a.OtherTaxID,0) AS othertaxid,";
        sql += "(a.FloorId) floorid,IFNULL(a.barcode,'') AS barcode,a.Itemallowdecimalqty,IFNULL(p.packingcharge,'0') AS packingcharge,";
        sql += "IFNULL(p.packingchargetype,'F') packingchargetype,IFNULL(p.taxid,'0') AS packingtaxid,IFNULL(a.selfsprice,'0.00') AS selfsprice,a.selfstax  AS selfstax,a.ProdEnable";
        sql += " FROM sr_menumstr_tbl a";
        sql += " LEFT JOIN sr_menumstr_oref_tbl oref ON oref.menuid=a.menuid AND OrefId=" + onlinerefid + " AND oref.restid=a.restid AND oref.branchid=a.branchid";
        sql += " LEFT JOIN sr_menu_parcelcharge_tbl p ON p.parcelchargeid=a.PackagingChargeID AND a.restid=p.restid AND a.branchid=p.branchid";
        sql += " WHERE a.itemlevel='2'AND a.ItemStatus='A' AND a.restid=" + this.restid + " AND a.branchid='" + this.branchid + "'";
      }
      else {
        sql += "SELECT a.MenuID,a.Name,a.price,IFNULL(a.parcelprice,'0.00') AS parcelprice,a.calories,a.combotype,a.image,";
        sql += "IFNULL(a.acprice,'0.00')AS acprice,a.itemparent,IFNULL(a.roomprice,'0.00') AS roomprice,";
        sql += "IFNULL(a.deliveryprice,'0.00') AS delivprice,a.AcDineInTax,a.NonAcDineInTax,a.TAwayTax,";
        sql += "a.DelivTax,a.RoomServTax,IFNULL(a.happyprice,'0.00') AS happyprice,IFNULL(a.happyacprice,'0.00') AS happyacprice,";
        sql += " IFNULL(a.IncludeDiscount,'Y') AS includediscount,IFNULL(a.OtherTaxID,0) AS othertaxid,";
        sql += "(a.FloorId) floorid,IFNULL(a.barcode,'') AS barcode,a.Itemallowdecimalqty,IFNULL(p.packingcharge,'0') AS packingcharge, ";
        sql += "IFNULL(p.packingchargetype,'F') packingchargetype,IFNULL(p.taxid,'0') AS packingtaxid,IFNULL(a.selfsprice,'0.00') AS selfsprice,a.selfstax  AS selfstax,a.ProdEnable";
        sql += " FROM sr_menumstr_tbl a";
        sql += " LEFT JOIN sr_menu_parcelcharge_tbl p ON p.parcelchargeid=a.PackagingChargeID AND a.restid=p.restid AND a.branchid=p.branchid";
        sql += " WHERE a.itemlevel='2'AND a.ItemStatus='A' AND a.restid=" + this.restid + " AND a.branchid='" + this.branchid + "'";
      }
      // sql = sql.concat(" AND a.ItemStatus='A'  ");
      if (ordertype == 'P') {
        sql += " and TakeAvailable='Y' ";
      }
      else if (ordertype == 'D') {
        sql += "  and delAvailable='Y'";
      }
      else if (ordertype == 'S') {
        // sql += "  and selfsavailable='Y'";
      }
      else if (ordertype == 'R') {
        sql += "  and delAvailable='Y'";
      }
      if (this.flooraccess != '') {
        sql = sql + " and " + this.flooraccess;
      }
      if (this.ressql != '' && this.ressql != undefined) {
        sql = sql.concat(this.ressql);
      }

      if (this.menu_code == "Y") {
        sql = sql.concat("AND a.code LIKE '%" + searchdata + "%'  ORDER BY a.Code");
      }
      else if (this.menu_code == "K") {
        sql = sql.concat("AND (a.name LIKE '%" + searchdata + "%' OR a.code LIKE'%" + searchdata + "%' )");
      }
      else if (this.menu_code == "S") {
        sql = sql.concat("AND (a.name LIKE '%" + searchdata + "%' OR a.code LIKE'" + searchdata
          + "' OR a.addtcode='" + searchdata + "' )");
      }
      else if (this.menu_code == "G") {
        sql = sql.concat("AND (a.name LIKE '" + searchdata + "%' OR a.code like'" + searchdata
          + "%' OR a.addtcode LIKE '" + searchdata
          + "%' OR SUBSTRING_INDEX(SUBSTRING_INDEX(a.name, ' ', 2), ' ', -1) = '" + searchdata
          + "' OR SUBSTRING(a.name,LENGTH(SUBSTRING_INDEX(a.name, ' ', 2))+1)   = '" + searchdata
          + "' )  ORDER BY a.name,a.addtcode,a.code ");
      }
      else {
        sql = sql.concat("AND (a.name LIKE '%" + searchdata + "%' OR a.code='" + searchdata + "' )");

      }
      sql = sql + " LIMIT 0,8";
      console.log(sql);

      this.sqlservice.menusearch(sql).then(async (res) => {
        this.menussearch = [];
        for (var i = 0; i < res.length; i++) {
          if (res[i].combotype != 'C') {
            var ordertype = localStorage.getItem('ordertype');
            if (ordertype == 'P') {
              res[i].price = res[i].parcelprice;
            }
            else if (ordertype == 'D') {
              res[i].price = res[i].delivprice;
            }
            else if (ordertype == 'E') {
              res[i].price = res[i].price;
            }
            else if (ordertype == 'S') {
              res[i].price = res[i].selfsprice;
            }
            else if (ordertype == 'R') {
              res[i].price = res[i].roomprice;
            }
            if (this.oneuiinstance === 'C') {
              res[i].productionMappingStatus = await this.productionService._checkMappedItem(this.restid, this.branchid, res[i].id);
              res[i].productionItemCount = await this.productionService._productionItemCount(this.restid, this.branchid, res[i].id);
            }
            res[i].modparent = "0";
            if (this.oneuiinstance === 'H') {
              for (let j = 0; j < this.productionDetails.length; j++) {
                if (res[i]?.id == this.productionDetails[j].menuid) {
                  res[i].productionItemCount = this.productionDetails[j].productionCount;
                  if (this.productionDetails[j].productionStatus === 0) {
                    res[i].productionMappingStatus = false;
                  } else {
                    res[i].productionMappingStatus = true;
                  }
                }
              }
            }
            this.menussearch.push(res[i]);
          }
        }
        if (this.onlirefid != 0) {
          var sql1 = "SELECT menuid,orefid,price FROM sr_menumstr_oref_tbl WHERE restid=" + this.restid + " AND branchid='" + this.branchid + "' AND orefId=" + this.onlirefid;
          this.sqlservice.fetchdet(sql1).then((res) => {
            //console.log(res);
            for (var i = 0; i < this.menussearch.length; i++) {
              for (var j = 0; j < res.length; j++) {
                if (this.menussearch[i].id == res[j].menuid) {
                  this.menussearch[i].price = res[j].price;
                }
              }
            }
          });
        }
        //this.menussearch=res;
        if (this.length > 0) {
          this.form1 = false;
          (document.getElementById('qty1') as HTMLInputElement).focus();
          (document.getElementById('qty1') as HTMLInputElement).select();
        }
        else {
          this.form1 = true;
        }
      })
    } else {
      this.menussearch = [];
    }
  }

  async select_menu(menu) {
    if (menu.combotype == 'V') {
      this.data.search = "";
      this.form1 = false;
      this.checkcombo(menu);

    }
    else {
      console.log(menu);
      this.searchmenu = menu;
      this.search_menu = [menu];
      this.data.search = this.search_menu[0].name;
      this.menussearch.push(this.data.search);
      this.data.qty = parseFloat('1');
      this.length = this.search_menu.length;
      this.form1 = false;

      this.search_menu[0].productionItemCount = await this.productionService._productionItemCount(this.restid, this.branchid, this.search_menu[0].id);
      this.search_menu[0].productionMappingStatus = await this.productionService._checkMappedItem(this.restid, this.branchid, this.search_menu[0].id);
    }

  }

  //ADD menu from search
  async search_add() {
    this.search_menu[0].add = 'add';
    let isHappyHourEnable = localStorage.getItem('isHappyHourEnable');
    if (this.search_menu[0].name == this.data.search && this.data.qty != 0 && isNaN(this.data.qty) == false && this.data.qty > 0 && (this.search_menu[0].itemallowdecimalqty == 'N' && (this.data.qty % 1) == 0 || this.search_menu[0].itemallowdecimalqty == 'Y')) {
      var ordertype = localStorage.getItem('ordertype');
      var tax = 0;
      tax = this._taxAmount(ordertype, tax, this.search_menu[0]);
      if (this.search_menu[0].calories == '') {
        this.search_menu[0].calories = 0;
      }
      if (this.search_menu[0].productionMappingStatus === false) {
        this.search_menu[0].qty = this.data.qty
        this.search_menu[0].tax_struct_id = tax;

        if (isHappyHourEnable === 'Y') {
          this.search_menu[0] = await this._happyHours(this.restid, this.branchid, this.search_menu[0]);
        }
        var cartProduct = this._productDetails(this.search_menu[0]);
        cartProduct.add = 'add';
        this.cartService.addToCart(cartProduct).then((val) => {
          console.log(val);
          this.cartTotal();
          this.data.search = '';
          this.data.qty = '';
          this.search_menu = [];
          this.form1 = false;
          for (var i = 0; i < this.menus.length; i++) {
            for (var k = 0; k < val.length; k++) {
              if (val[k].product_id == this.menus[i]["id"]) {
                this.menus[i]["qty"] = val[k].count;
              }
            }
          }
        });
        this.length = 0;
      } else {
        let qty: number = await this.productionService._productionItemQty(this.restid, this.branchid, this.search_menu[0].id);
        let checkQty: number = this.data.qty * qty;
        if (this.search_menu[0].ProdEnable === 'Y') {
          if (this.search_menu[0].productionItemCount >= checkQty) {
            this.search_menu[0].productionItemCount = this.search_menu[0].productionItemCount - checkQty;
            this.search_menu[0].qty = this.data.qty;
            this.search_menu[0].tax_struct_id = tax;

            if (isHappyHourEnable === 'Y') {
              this.search_menu[0] = await this._happyHours(this.restid, this.branchid, this.search_menu[0]);
            }
            var cartProduct = this._productDetails(this.search_menu[0]);
            cartProduct.add = 'add';
            this.cartService.addToCart(cartProduct).then((val) => {
              console.log(val);
              this.cartTotal();
              this.data.search = '';
              this.data.qty = '';
              this.search_menu = [];
              this.form1 = false;
              for (var i = 0; i < this.menus.length; i++) {
                for (var k = 0; k < val.length; k++) {
                  if (val[k].product_id == this.menus[i]["id"]) {
                    this.menus[i]["qty"] = val[k].count;
                  }
                }
              }
            });
            this.length = 0;
          } else {
            this.openToast(`${this.search_menu[0].name} - Production Item Count Zero`)
          }
        }
        else {
          if (this.search_menu[0].productionItemCount <= 0) {
            this.openToast(`${this.search_menu[0].name} - Production Item Count Zero`)
          }
          this.search_menu[0].qty = this.data.qty;
          this.search_menu[0].tax_struct_id = tax;
          if (isHappyHourEnable === 'Y') {
            this.search_menu[0] = await this._happyHours(this.restid, this.branchid, this.search_menu[0]);
          }
          var cartProduct = this._productDetails(this.search_menu[0]);
          cartProduct.add = 'add';
          this.cartService.addToCart(cartProduct).then((val) => {
            console.log(val);
            this.cartTotal();
            this.data.search = '';
            this.data.qty = '';
            this.search_menu = [];
            this.form1 = false;
            for (var i = 0; i < this.menus.length; i++) {
              for (var k = 0; k < val.length; k++) {
                if (val[k].product_id == this.menus[i]["id"]) {
                  this.menus[i]["qty"] = val[k].count;
                }
              }
            }
          });
          this.length = 0;
        }
      }
    }
    else {
      this.openToast("Quantity should be greater than zero & Should be numeric!");
    }
  }


  //GET Tax Structure
  async tax_str() {
    this.taxstr = await this.sqlservice.tax_str(this.branchid, this.restid)
    localStorage.setItem('tax_stucture', JSON.stringify(this.taxstr));
  }

  //Taxlist
  async taxlist() {
    var ordertype = localStorage.getItem('ordertype');
    var sql = '';
    var sql = '';
    if (ordertype == 'E') {
      sql = 'AND DineInAply ="Y"';
    }
    else if (ordertype == 'P') {
      sql = 'AND TakeAwayAply="Y"';
    }
    else if (ordertype == 'D') {
      sql = 'AND DeliveryAply="Y"';
    }
    else if (ordertype == 'R') {
      sql = 'AND RoomServiceAply="Y"';
    }
    this.tax_list2 = await this.sqlservice.taxlist2(sql, this.branchid, this.restid);

    localStorage.setItem('taxlist2', JSON.stringify(this.tax_list2));
    this.tax_list = await this.sqlservice.taxlist(sql, this.branchid, this.restid)
    localStorage.setItem('taxlist', JSON.stringify(this.tax_list));
  }

  //While click discount in percentage
  clickper() {
    this.discperc = '';
  }

  clickprice() {
    this.discamnt = '';
  }


  //Discount in Rupees
  clrRS(event: any) {
    this.discamnt = parseFloat(event.target.value);
    var RE = /^\d*(\.\d{1})?\d{0,1}$/;
    if (RE.test(this.discamnt)) {
      if (this.discamnt != 0 && this.discamnt != '' && this.discamnt != null && this.discamnt != undefined)
        this.discby = "R";
        if(this.grandtotal >= 0){
          this.taxcalculation(this.cartdetails);
        
        }else{
          this.openToast('Grand Total value is negitive');
          this.discamnt = 0;
          this.taxcalculation(this.cartdetails);
        }
    }
    else {
      this.openToast('Enter Numeric...');
      this.discamnt = 0;
    }
  }

  //Discount in Percentage
  clrper(event: any) {
    this.discperc = parseFloat(event.target.value);
    var RE = /^\d*(\.\d{1})?\d{0,1}$/;
    if (RE.test(this.discperc)) {
      if (this.discperc > parseFloat(this.maxdiscount)) {
        this.openToast('Entered value greater than Maximum Discount Percentage');
        // this.discperc=0;
        this.discperc = 0;
        this.discamnt = 0;
        this.taxcalculation(this.cartdetails);
      }
      else {
        if (this.discperc != 0 && this.discperc != '' && this.discperc != null && this.discperc != undefined)
          // this.discamnt=0;
          this.discby = "P";
        this.taxcalculation(this.cartdetails);
      }
    }
    else {
      this.openToast('Enter Numeric...');
      this.discperc = 0;
      this.taxcalculation(this.cartdetails);
    }

  }



  //Customize Packing charge
  calcpriceOnKeyPress() {
    this.taxcalculation(this.cartdetails);
  }

  //taxcalculation
  taxcalculation(cartitems) {
    let totalTaxaAmount: number = 0;
    console.log(cartitems);
    this.decimalpoint = localStorage.getItem('decimalpoint');
    var DiscountLessTax = localStorage.getItem('DiscountLessTax');
    var itemwisedisc = localStorage.getItem('itemwisedisc');
    var discperc = this.discperc;
    var disprice = this.discamnt;
    var netdisc = 0;
    var taxhash = {};
    var freetexttaxadded = {};
    var taxhashName = {};
    this.subtotal = 0;
    this.totaldiscountamount = 0;
    var subtot = 0;
    for (var i = 0; i < cartitems.length; i++) {
      this.cartdetails[i].knotes = cartitems[i].knotes = '';
      this.cartdetails[i].remarks = cartitems[i].remarks = '';
      this.cartdetails[i].takeaway = cartitems[i].takeaway = 'N';
      this.cartdetails[i].complimentary = cartitems[i].complimentary = 'N';
      this.cartdetails[i].itewisediscount = cartitems[i].itewisediscount = itemwisedisc;
      this.cartdetails[i].complimentaryprice = cartitems[i].complimentaryprice = '0.00';
      for (var j = 0; j < this.addcart.length; j++) {
        if (cartitems[i].product_id == this.addcart[j].id && cartitems[i].currentstatus == '') {
          this.cartdetails[i].knotes = cartitems[i].knotes = this.addcart[j].knotes;
          this.cartdetails[i].remarks = cartitems[i].remarks = this.addcart[j].remarks;
          this.cartdetails[i].takeaway = cartitems[i].takeaway = this.addcart[j].takeaway;
          this.cartdetails[i].complimentary = cartitems[i].complimentary = this.addcart[j].complimentary;
          this.cartdetails[i].idiscperc = cartitems[i].idiscperc = this.addcart[j].idiscperc;
          this.cartdetails[i].idiscprice = cartitems[i].idiscprice = this.addcart[j].idiscprice;
          this.cartdetails[i].itewisediscount = cartitems[i].itewisediscount = this.addcart[j].itewisediscount;
          if (this.cartdetails[i].idiscperc > 0 || this.cartdetails[i].idiscprice > 0) {
            var item = this.itemdisccal(this.cartdetails[i]);
            this.cartdetails[i].totalPrice = cartitems[i].totalPrice = item.totalprice;
          }
          if (this.cartdetails[i].knotes == '' && this.cartdetails[i].remarks != '') {
            this.cartdetails[i].knoterem = this.cartdetails[i].remarks;
          }
          else if (this.cartdetails[i].remarks == '' && this.cartdetails[i].knotes != '') {
            this.cartdetails[i].knoterem = this.cartdetails[i].knotes;
          }
          else if (this.cartdetails[i].remarks == '' && this.cartdetails[i].knotes == '') {
            this.cartdetails[i].knoterem = '';
          }
          else {
            this.cartdetails[i].knoterem = this.cartdetails[i].knotes + ', ' + this.cartdetails[i].remarks;
          }
          if (this.cartdetails[i].complimentary == 'Y') {
            this.cartdetails[i].complimentaryprice = cartitems[i].complimentaryprice = parseFloat(cartitems[i].totalPrice);
            cartitems[i].totalPrice = '0.00';
          }
          else {
            this.cartdetails[i].complimentaryprice = cartitems[i].complimentaryprice = '0.00';
          }
          if (this.cartdetails[i].takeaway == 'Y') {
            this.cartdetails[i].remarks = cartitems[i].remarks = '(Take-Away)';
          }

        }
      }
      if (this.cartdetails[i].idiscperc > 0 || this.cartdetails[i].idiscprice > 0) {
        var item = this.itemdisccal(this.cartdetails[i]);
        this.cartdetails[i].totalPrice = cartitems[i].totalPrice = item.totalprice;
      }
      if (this.cartdetails[i].knotes == '' && this.cartdetails[i].remarks != '') {
        this.cartdetails[i].knoterem = this.cartdetails[i].remarks;
      }
      else if (this.cartdetails[i].remarks == '' && this.cartdetails[i].knotes != '') {
        this.cartdetails[i].knoterem = this.cartdetails[i].knotes;
      }
      else if (this.cartdetails[i].remarks == '' && this.cartdetails[i].knotes == '') {
        this.cartdetails[i].knoterem = '';
      }
      else {
        this.cartdetails[i].knoterem = this.cartdetails[i].knotes + ', ' + this.cartdetails[i].remarks;
      }
      if (this.cartdetails[i].complimentary == 'Y') {
        this.cartdetails[i].complimentaryprice = cartitems[i].complimentaryprice = parseFloat(cartitems[i].totalPrice);
        cartitems[i].totalPrice = '0.00';
      }
      else {
        this.cartdetails[i].complimentaryprice = cartitems[i].complimentaryprice = '0.00';
      }
      if (this.cartdetails[i].takeaway == 'Y') {
        this.cartdetails[i].remarks = cartitems[i].remarks = '(Take-Away)';
      }



    }

    if (this.discamnt != 0) {
      for (var i = 0; i < cartitems.length; i++) {

        subtot = subtot + cartitems[i].totalPrice;
      }
      if (subtot !== 0) {
        discperc = (this.discamnt * 100) / subtot;
        discperc = parseFloat(discperc).toFixed(this.decimalpoint);
      }
      discperc = (this.discamnt * 100) / subtot;
      discperc = parseFloat(discperc).toFixed(this.decimalpoint);
      // if(discperc>parseFloat(this.maxdiscount))
      // {
      //   this.openToast('Entered value greater than Maximum Discount Percentage');
      //   this.discamnt=0;
      //   this.clickprice();
      // }
    }
    this.discper = discperc;
    this.itemdetails = [];
    this.updateItemDetails = [];
    console.log(cartitems);
    for (var i = 0; i < cartitems.length; i++) {

      if (cartitems[i].count > 0 && cartitems[i].checked == false) {

        var taxamount = 0;
        this.tax_details = [];
        this.updateTax = [];
        var excludeditempricefordiscount = 0;
        var price = cartitems[i].totalPrice;
        this.subtotal = parseFloat(this.subtotal) + parseFloat(price);
        if (cartitems[i].includediscount == 'N')
          excludeditempricefordiscount = parseFloat(price);
        var taxarray = this.getGstTaxPerc(cartitems[i].tax_struct_id);
        var len = taxarray.length;
        var addwithSubtotalAmount = 0;
        var originalprice = cartitems[i].totalPrice;
        var addwithsubtot = 0;
        var custtaxamount = 0;
        var itemTaxAmount = 0;
        var itemwisecharges = 0;
        var itemwiseparcelcharge_enabled = "N";
        var packingcharge = cartitems[i].packingcharge;
        var packingchargetype = cartitems[i].packingchargetype;
        var packingtaxid = cartitems[i].packingtaxid;
        var itemwisecharges = 0;

        for (var j = 0; j < len; j++) {
          var isCustomize = false;
          var taxobj = taxarray[j];
          var taxperc = taxobj.taxperc;
          var taxid = taxobj.taxid;
          var isTax = taxobj.istax;
          var chargeinclddiscount = taxobj.chargeinclddiscount;
          var optionalTax = taxobj.optionaltax;
          var customizeTax = taxobj.customizetax;
          var addwithSubtotal = taxobj.addwithsubtotal;
          var taxmapid = taxobj.taxmapid;
          if (customizeTax != null && customizeTax != "" && customizeTax == 'Y') {
            if (parseFloat(packingcharge) > 0) {

              if (taxid == packingtaxid) {
                (<HTMLInputElement>document.getElementById("custtax_" + taxid)).value = "0";
                if (packingchargetype == "F") {
                  itemwisecharges = itemwisecharges + (parseFloat(cartitems[i].count) * parseFloat(packingcharge));
                  custtaxamount = itemwisecharges;
                  console.log("custtax_" + taxid);
                  (<HTMLInputElement>document.getElementById("custtax_" + taxid)).value = custtaxamount.toString();
                  isCustomize = true;
                  itemwiseparcelcharge_enabled = "Y"
                }
                else {
                  itemwisecharges = itemwisecharges + (parseFloat(price) * parseFloat(packingcharge) / 100);
                  custtaxamount = itemwisecharges;
                  (<HTMLInputElement>document.getElementById("custtax_" + taxid)).value = custtaxamount.toString();

                  isCustomize = true;
                  itemwiseparcelcharge_enabled = "Y";
                }
              }
            }
            else if (itemwiseparcelcharge_enabled == "N") {
              if (freetexttaxadded.hasOwnProperty(taxid)) {
                //do nothing
              }
              else {
                let tax: any = '0'
                tax = (<HTMLInputElement>document.getElementById("custtax_" + taxid)) ?? 0;
                if (tax !== null && tax !== 0) {
                  tax = (<HTMLInputElement>document.getElementById("custtax_" + taxid)).value;
                }
                custtaxamount = parseFloat(tax);
                if (custtaxamount == null || custtaxamount == 0) {
                  custtaxamount = 0;
                }
                else {

                  if (!isNaN(custtaxamount) && custtaxamount > 0) {
                    custtaxamount = custtaxamount;
                    freetexttaxadded[taxid] = "ADDED";
                    isCustomize = true;
                  }
                }

              }
            }
            taxperc = 0;

          }
          var itemcost = 0;
          var itemcostdicount = 0;
          if (isCustomize) {
            itemcost = custtaxamount;
          }
          else {
            //DiscountLess Tax Enable
            if (DiscountLessTax == 'Y') {
              if (discperc > 0) {
                if (itemwiseparcelcharge_enabled == "Y") {
                  netdisc = ((price - excludeditempricefordiscount) * discperc / 100);
                } else {
                  netdisc = ((price - excludeditempricefordiscount - custtaxamount) * discperc / 100);
                  // hide the above original line and created the below line (custtaxamount removed)

                }
                if (isTax == "N" && chargeinclddiscount == "N") {
                  // price = price - netdisc;
                  price = price + addwithsubtot;
                  itemcost = (price * taxperc / 100);
                }
                else {
                  price = price - netdisc;
                  price = price + addwithsubtot;
                  itemcost = (price * taxperc / 100);
                }
              }
              else {
                price = price + addwithsubtot;
                itemcost = (price * taxperc / 100);
              }
            }
            else {
              if (discperc > 0) {
                netdisc = ((price - excludeditempricefordiscount) * discperc / 100);
                price = price + addwithsubtot;
                itemcost = ((price) * taxperc / 100);
              }
              else {
                price = price + addwithsubtot;
                itemcost = (price * taxperc / 100);
              }
            }
          }
          //TAX
          if (taxhash.hasOwnProperty(taxid)) {
            var getitemcost = taxhash[taxid];
            var initemcost = 0;
            getitemcost = parseFloat(getitemcost);
            initemcost = itemcost;
            getitemcost = parseFloat(getitemcost) + initemcost;
            taxhash[taxid] = parseFloat(getitemcost);
          }
          else {
            taxhash[taxid] = itemcost;
            taxhashName[taxid] = taxobj.taxname;
          }
          //Tax with addwith subtotal
          if (addwithSubtotal == 'Y') {
            addwithsubtot = addwithsubtot + itemcost;
          }
          price = originalprice;
          itemTaxAmount = itemTaxAmount + itemcost;
          if (j == len - 1) {
            itemTaxAmount = itemTaxAmount + price;
          }
          taxamount = taxamount + itemcost;

          totalTaxaAmount = totalTaxaAmount + itemcost;

          this.tax_details.push({ restid: this.restid, branchid: this.branchid, orderid: "", ordersummaryid: "", itemid: cartitems[i].product_id, struct_id: cartitems[i].tax_struct_id, taxid: taxid, taxperc: taxperc, taxamount: itemcost, taxmapid: taxmapid, optionalTax: optionalTax, customizeTax: customizeTax });
          if (cartitems[i].currentstatus == "K" && cartitems[i].ordersummaryid !== '' && cartitems[i].orderid !== '') {
            this.updateTax.push({ restid: this.restid, branchid: this.branchid, orderid: cartitems[i].orderid, ordersummaryid: cartitems[i].ordersummaryid, itemid: cartitems[i].product_id, struct_id: cartitems[i].tax_struct_id, taxid: taxid, taxperc: taxperc, taxamount: itemcost, taxmapid: taxmapid, optionalTax: optionalTax, customizeTax: customizeTax});
          }
        }
        if (cartitems[i].currentstatus == "K" && cartitems[i].ordersummaryid !== '' && cartitems[i].orderid !== '' && cartitems[i].modparent == '0' && this.oneuiinstance == 'C') {
          this.updateItemDetails.push({ restid: this.restid, branchid: this.branchid, orderid: cartitems[i].orderid, ordersummaryid: cartitems[i].ordersummaryid, itemid: cartitems[i].product_id, itemqty: cartitems[i].count, itemname: cartitems[i].name, itemprice: cartitems[i].totalPrice, taxDetails: this.updateTax, taxamount: taxamount, struct_id: cartitems[i].tax_struct_id, itemwisecalories: cartitems[i].calories, currentstatus: 'k', remarks: cartitems[i].remarks, knotes: cartitems[i].knotes, itemcomplimentary: cartitems[i].complimentary, complimentaryprice: cartitems[i].complimentaryprice, taenabled: cartitems[i].takeaway, idiscprice: cartitems[i].idiscperc, idescper: cartitems[i].idiscprice, modparent: cartitems[i].modparent, combomenu: cartitems[i].combomenu, combotype: cartitems[i].combotype,tempidiscprice : 0 });
        }
        if (cartitems[i].currentstatus == "N" && cartitems[i].ordersummaryid !== '' && cartitems[i].orderid !== '' && cartitems[i].modparent == '0' && this.oneuiinstance == 'C') {
          this.itemdetails.push({ restid: this.restid, branchid: this.branchid, orderid: cartitems[i].orderid, ordersummaryid: cartitems[i].ordersummaryid, itemid: cartitems[i].product_id, itemqty: cartitems[i].count, itemname: cartitems[i].name, itemprice: cartitems[i].totalPrice, taxDetails: this.updateTax, taxamount: taxamount, struct_id: cartitems[i].tax_struct_id, itemwisecalories: cartitems[i].calories, currentstatus: 'k', remarks: cartitems[i].remarks, knotes: cartitems[i].knotes, itemcomplimentary: cartitems[i].complimentary, complimentaryprice: cartitems[i].complimentaryprice, taenabled: cartitems[i].takeaway, idiscprice: cartitems[i].idiscperc, idescper: cartitems[i].idiscprice, modparent: cartitems[i].modparent, combomenu: cartitems[i].combomenu, combotype: cartitems[i].combotype,tempidiscprice : 0 });
        }
        if (cartitems[i].currentstatus == "" && cartitems[i].modparent == '0' && this.oneuiinstance == 'C')
          this.itemdetails.push({ restid: this.restid, branchid: this.branchid, orderid: "", ordersummaryid: "", itemid: cartitems[i].product_id, itemqty: cartitems[i].count, itemname: cartitems[i].name, itemprice: cartitems[i].totalPrice, taxDetails: this.tax_details, taxamount: taxamount, struct_id: cartitems[i].tax_struct_id, itemwisecalories: cartitems[i].calories, currentstatus: 'K', remarks: cartitems[i].remarks, knotes: cartitems[i].knotes, itemcomplimentary: cartitems[i].complimentary, complimentaryprice: cartitems[i].complimentaryprice, taenabled: cartitems[i].takeaway, idiscprice: cartitems[i].idiscperc, idescper: cartitems[i].idiscprice, modparent: cartitems[i].modparent, combomenu: cartitems[i].combomenu, combotype: cartitems[i].combotype ,tempidiscprice : 0});
        //Add Modifier
        if (cartitems[i].currentstatus == "" && cartitems[i].modparent != "0" && this.oneuiinstance == 'C') {
          this.modparent.push({ restid: this.restid, branchid: this.branchid, orderid: "", ordersummaryid: "", itemid: cartitems[i].product_id, itemqty: cartitems[i].count, itemname: cartitems[i].name, itemprice: cartitems[i].totalPrice, taxDetails: this.tax_details, taxamount: taxamount, struct_id: cartitems[i].tax_struct_id, itemwisecalories: cartitems[i].calories, currentstatus: 'K', remarks: cartitems[i].remarks, knotes: cartitems[i].knotes, itemcomplimentary: cartitems[i].complimentary, complimentaryprice: cartitems[i].complimentaryprice, taenabled: cartitems[i].takeaway, idiscprice: '', idescper: '', modparent: cartitems[i].modparent });
        }
        if ((cartitems[i].currentstatus == "K" && this.oneuiinstance == 'H')) {
          if (cartitems[i].totalPrice !== 0) {
            this.itemdetails.push({ restid: this.restid, branchid: this.branchid, orderid: "", ordersummaryid: "", itemid: cartitems[i].product_id, itemqty: cartitems[i].count, itemname: cartitems[i].name, itemprice: cartitems[i].totalPrice, taxDetails: this.tax_details, taxamount: itemcost, struct_id: cartitems[i].tax_struct_id, itemwisecalories: cartitems[i].calories, currentstatus: 'K', remarks: cartitems[i].remarks, knotes: cartitems[i].knotes, itemcomplimentary: cartitems[i].complimentary, complimentaryprice: cartitems[i].complimentaryprice, taenabled: cartitems[i].takeaway, idiscprice: cartitems[i].idiscperc, idescper: cartitems[i].idiscprice, modparent: cartitems[i].modparent, combomenu: cartitems[i].combomenu, combotype: cartitems[i].combotype, kotstatus: "Y", isHappyHour: 'C' });
          } else {
            this.itemdetails.push({ restid: this.restid, branchid: this.branchid, orderid: "", ordersummaryid: "", itemid: cartitems[i].product_id, itemqty: cartitems[i].count, itemname: cartitems[i].name, itemprice: cartitems[i].totalPrice, taxDetails: this.tax_details, taxamount: itemcost, struct_id: cartitems[i].tax_struct_id, itemwisecalories: cartitems[i].calories, currentstatus: 'K', remarks: cartitems[i].remarks, knotes: cartitems[i].knotes, itemcomplimentary: 'Y', complimentaryprice: cartitems[i].complimentaryprice, taenabled: cartitems[i].takeaway, idiscprice: cartitems[i].idiscperc, idescper: cartitems[i].idiscprice, modparent: cartitems[i].modparent, combomenu: cartitems[i].combomenu, combotype: cartitems[i].combotype, kotstatus: "N", isHappyHour: 'F' });
          }

        } else if (this.oneuiinstance == 'H' && cartitems[i].currentstatus == "") {
          if (cartitems[i].totalPrice !== 0) {
            this.itemdetails.push({ restid: this.restid, branchid: this.branchid, orderid: "", ordersummaryid: "", itemid: cartitems[i].product_id, itemqty: cartitems[i].count, itemname: cartitems[i].name, itemprice: cartitems[i].totalPrice, taxDetails: this.tax_details, taxamount: itemcost, struct_id: cartitems[i].tax_struct_id, itemwisecalories: cartitems[i].calories, currentstatus: 'N', remarks: cartitems[i].remarks, knotes: cartitems[i].knotes, itemcomplimentary: cartitems[i].complimentary, complimentaryprice: cartitems[i].complimentaryprice, taenabled: cartitems[i].takeaway, idiscprice: cartitems[i].idiscperc, idescper: cartitems[i].idiscprice, modparent: cartitems[i].modparent, combomenu: cartitems[i].combomenu, combotype: cartitems[i].combotype, kotstatus: "Y", isHappyHour: 'C' });
          } else {
            this.itemdetails.push({ restid: this.restid, branchid: this.branchid, orderid: "", ordersummaryid: "", itemid: cartitems[i].product_id, itemqty: cartitems[i].count, itemname: cartitems[i].name, itemprice: cartitems[i].totalPrice, taxDetails: this.tax_details, taxamount: itemcost, struct_id: cartitems[i].tax_struct_id, itemwisecalories: cartitems[i].calories, currentstatus: 'N', remarks: cartitems[i].remarks, knotes: cartitems[i].knotes, itemcomplimentary: 'Y', complimentaryprice: cartitems[i].complimentaryprice, taenabled: cartitems[i].takeaway, idiscprice: cartitems[i].idiscperc, idescper: cartitems[i].idiscprice, modparent: cartitems[i].modparent, combomenu: cartitems[i].combomenu, combotype: cartitems[i].combotype, kotstatus: "Y", isHappyHour: 'F' });
          }
        }

        //Add Modifier
        if ((cartitems[i].currentstatus == "" || this.oneuiinstance == 'H') && cartitems[i].modparent != "0") {
          this.modparent.push({ restid: this.restid, branchid: this.branchid, orderid: "", ordersummaryid: "", itemid: cartitems[i].product_id, itemqty: cartitems[i].count, itemname: cartitems[i].name, itemprice: cartitems[i].totalPrice, taxDetails: this.tax_details, taxamount: taxamount, struct_id: cartitems[i].tax_struct_id, itemwisecalories: cartitems[i].calories, currentstatus: 'K', remarks: cartitems[i].remarks, knotes: cartitems[i].knotes, itemcomplimentary: cartitems[i].complimentary, complimentaryprice: cartitems[i].complimentaryprice, taenabled: cartitems[i].takeaway, idiscprice: cartitems[i].idiscperc, idescper: cartitems[i].idiscprice, modparent: cartitems[i].modparent });
        }
        console.log(this.itemdetails);
      }
    }

    if (discperc > 0) {
      this.totaldiscountamount = (this.subtotal * discperc) / 100;
    }
    //Grand Total
    this.grandtotal = 0;

    for (var key in taxhash) {

      this.grandtotal = this.grandtotal + parseFloat(taxhash[key]);
    }
    this.totalTaxAmount = totalTaxaAmount.toFixed(this.decimalpoint)
    this.grandtotal = (this.grandtotal) + (this.subtotal);
    var billroundoff = localStorage.getItem('billroundoff');
    var roundto = localStorage.getItem('roundto');
    if (billroundoff == 'Y') {

      var rndoff = 0;
      var grandtotal = this.grandtotal;
      var totaldiscountamount = this.totaldiscountamount
      if (roundto == '1') {
        this.grandtotal = Math.round(grandtotal - totaldiscountamount);
        rndoff = Math.round((grandtotal - totaldiscountamount)) - (grandtotal - totaldiscountamount);
      }
      else if (roundto == '2') {
        this.grandtotal = Math.round((grandtotal - totaldiscountamount) * 2) / 2;
        rndoff = (Math.round((grandtotal - totaldiscountamount) * 2) / 2) - (grandtotal - totaldiscountamount);
      }
      else if (roundto == '4') {
        this.grandtotal = Math.round((grandtotal - totaldiscountamount) * 4) / 4;
        rndoff = (Math.round((grandtotal - totaldiscountamount) * 4) / 4) - (grandtotal - totaldiscountamount);
      }
      this.roundoff = rndoff.toFixed(this.decimalpoint);
    }
    else {
      var rndoff = 0;
      this.grandtotal = (this.grandtotal - this.totaldiscountamount);
      this.roundoff = rndoff.toFixed(this.decimalpoint);
    }


    console.log(this.roundoff);
    this.subtotal = parseFloat(this.subtotal).toFixed(this.decimalpoint);
    this.grandtotal = parseFloat(this.grandtotal).toFixed(this.decimalpoint);

    for (var i = 0; i < this.tax_list2.length; i++) {
      this.tax_list2[i].taxamount = 0;

      for (var key in taxhash) {

        if (this.tax_list2[i].taxid == key) {
          this.tax_list2[i].taxamount = parseFloat(taxhash[key]).toFixed(this.decimalpoint);
        }
      }
      //this.str_id=this.tax_list2[i].structid;

    }
    //Modifier
    if (this.oneuiinstance === 'C') {
      for (var i = 0; i < this.itemdetails.length; i++) {
        var modifieranitem = [];
        this.itemdetails[i].modifier = [];
        for (var j = 0; j < this.modparent.length; j++) {
          if (this.itemdetails[i].itemid == this.modparent[j].modparent) {
            modifieranitem.push(this.modparent[j]);
            modifieranitem = this.getUniqueListBy(modifieranitem, 'itemid');
            this.itemdetails[i].modifier = modifieranitem
          }
        }
      }
      console.log(this.itemdetails);
    }
    if(this.grandtotal < 0){
      this.openToast('Grand Total value is negitive');
      this.discamnt = 0;
      this.discperc = 0;
      this.taxcalculation(this.cartdetails);
    }
    if (discperc > parseFloat(this.maxdiscount)) {
      this.openToast('Entered value greater than Maximum Discount Percentage');
      this.discperc = 0;
      this.discamnt = 0;
      this.taxcalculation(this.cartdetails);
    }
  }


  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }
  //GET Tax Details for struct_id
  getGstTaxPerc(structid) {
    var taxobj = [];
    for (var i = 0; i < this.tax_list.length; i++) {
      if (this.tax_list[i].structid == structid) {
        taxobj.push(this.tax_list[i]);
      }
    }
    return taxobj;
  }


  //Save Order
  async saveorder(ststype) {
    let token_no
    this.disableButton = true;
    this.present();
    var ordertype = localStorage.getItem('ordertype');
    this.cusname = (localStorage.getItem('custname') != null && localStorage.getItem('custname') != undefined) ? localStorage.getItem('custname') : "";
    this.custaddr = (localStorage.getItem('custaddr') != null && localStorage.getItem('custaddr') != undefined) ? localStorage.getItem('custaddr') : "";
    this.cusnumber = (localStorage.getItem('cusnumber') != null && localStorage.getItem('cusnumber') != undefined) ? localStorage.getItem('cusnumber') : "";
    this.flatno = (localStorage.getItem('flatno') != null && localStorage.getItem('flatno') != undefined) ? localStorage.getItem('flatno') : "";
    this.latitude = (localStorage.getItem('latitude') != null && localStorage.getItem('latitude') != undefined) ? localStorage.getItem('latitude') : "";
    this.longitude = (localStorage.getItem('longitude') != null && localStorage.getItem('longitude') != undefined) ? localStorage.getItem('longitude') : "";
    if (this.cart_items > 0) {
      var ORDER_ID = localStorage.getItem('order_id');
      console.log(ORDER_ID);
      this.orderdetails = [];
      console.log(this.discby);
      var ordertype = localStorage.getItem('ordertype');
      var tableid = (localStorage.getItem('tableid') ? localStorage.getItem('tableid') : 0);
      var billdate = localStorage.getItem('dayenddate');
      var tokenno = "SELECT IFNULL (MAX(CASt(tokenno as INTEGER))+1,1) AS tokenno FROM sr_orders_tbl WHERE restid=" + this.restid + " AND branchid='" + this.branchid + "' AND ordertype != 'E' AND billdate='" + billdate + "'";
      token_no = await this.sqlservice.gettokenno(tokenno)
      console.log(this.itemdetails);
      this.itemdetails.forEach(itemdetails => {
        itemdetails.pos_unitprice = '0.00';
        itemdetails.status = 'A';
        itemdetails.ronumber = '0';
        itemdetails.priority = '0000-00-00 00:00:00';
        itemdetails.kottime = '0000-00-00 00:00:00';
        itemdetails.pickpointtime = '0000-00-00 00:00:00';
        itemdetails.deliverytime = '0000-00-00 00:00:00';
        itemdetails.waiterid = this.captainid;  //Captain ID
        itemdetails.userid = this.userid;
        itemdetails.pickitemviewed = '';
        itemdetails.wtrid = this.waiterid;  //waiter ID
        itemdetails.hosync = 'N';
        itemdetails.itemsaving = '1.000';
        itemdetails.litem = 'N';
        itemdetails.halltype = this.hallType;
        itemdetails.cptnreward = '0.00';
        itemdetails.ltype = 'L';
        itemdetails.htldesk = 'N';
        itemdetails.itemcompleremarks = '';
        itemdetails.comboparent = '';
        itemdetails.modindex = '0';
        itemdetails.ismodifier = 'N';
        itemdetails.prod_act = 'N';
        itemdetails.taxitem = 'Y';
        itemdetails.kotcount = '1';
        itemdetails.chefacktime = null;
        itemdetails.chefuserid = '';
        itemdetails.happyparent = '';
        itemdetails.onlinecombotype = 'S';
        itemdetails.onlinecomboparent = '';
        itemdetails.discrate = '0.00';
        itemdetails.discamt = '0.00';
        itemdetails.itemsavetype = 'N';
        itemdetails.itemdiscamount = '0.00';
        itemdetails.feedbackrate = '0';
        itemdetails.stock_act = 'N';
        itemdetails.taxexmpamt = '';
      })
      //Send to Kitchen
      if (ststype == 'N' || ststype == 'S' || ststype == 'H') {
        this.itemdetails.forEach(itemdetails => {
          itemdetails.kotstatus = 'Y';
        })
        if (ststype == 'H') {
          this.itemdetails.forEach(itemdetails => {
            itemdetails.currentstatus = 'N'
          })
        }
        if (this.ischecked == true) {
          this.orderdetails.push({
            restid: this.restid, branchid: this.branchid, billno: "", discper: this.discper, discprice: this.totaldiscountamount, userid: this.userid, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00", time: this.time, pickupbranchid: "1", transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.waiterid, captainid: this.captainid, noofpeople: this.noofpax,
            tableno: tableid, billedstatus: "N", settlement: "N", custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "I", cancelremarks: "", cancelcategory: 0, deliverydate: "", driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00", delvauthorized: "Y", discapprover: "", discreason: "", discremarks: "", redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y",
            cancelbilladminid: "", paymentmode: "", billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "", delprinted: "N", ccrefid: "0", areacode: "0", paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: "N", roomno: "0", rateus: "", ratecomments: "", notifysent: "N", modkot: "N", approvests: "N", deliveryremarks: "", canceltime: null, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N", custbillissue: "N", cashiersettled: "N", verifykot: "N", reprint: "N", hosync: "N", roundoff: "0.00",
            ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal, htldesk: "N", htlbookid: "", discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0", cardname: "", cardnumber: "", cardtype: "", floorid: "", ordfloorid: this.floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude, longitude: this.longitude, UIComp: 'Y'
          });
        }
        else {
          this.orderdetails.push({
            restid: this.restid, branchid: this.branchid, billno: "", discper: this.discper, discprice: this.totaldiscountamount, userid: this.userid, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00", time: this.time, pickupbranchid: "1", transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.waiterid, captainid: this.captainid, noofpeople: this.noofpax,
            tableno: tableid, billedstatus: "N", settlement: "N", custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "B", cancelremarks: "", cancelcategory: 0, deliverydate: "", driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00", delvauthorized: "Y", discapprover: "", discreason: "", discremarks: "", redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y",
            cancelbilladminid: "", paymentmode: "", billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "", delprinted: "N", ccrefid: "0", areacode: "0", paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: "N", roomno: "0", rateus: "", ratecomments: "", notifysent: "N", modkot: "N", approvests: "N", deliveryremarks: "", canceltime: null, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N", custbillissue: "N", cashiersettled: "N", verifykot: "N", reprint: "N", hosync: "N", roundoff: "0.00",
            ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal, htldesk: "N", htlbookid: "", discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0", cardname: "", cardnumber: "", cardtype: "", floorid: "", ordfloorid: this.floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude, longitude: this.longitude, UIComp: 'N'
          });
        }
        //Online reference master
        if ((ordertype == orderfrom.TAKEAWAY || ordertype == orderfrom.DELIVERY) && this.onlirefid != 0) {
          var onlinereference = JSON.parse(localStorage.getItem('onlinereferencemaster'));
          for (var i = 0; i < onlinereference.length; i++) {
            if (onlinereference[i].id == this.onlirefid) {
              if (onlinereference[i].onliemobile != '' && onlinereference[i].onliemobile != null && onlinereference[i].onliemobile != undefined) {
                this.orderdetails[0].custname = onlinereference[i].custname;
                this.orderdetails[0].custaddr = onlinereference[i].custaddr;
                this.orderdetails[0].custmob = onlinereference[i].onliemobile;
                this.orderdetails[0].custlandmark = onlinereference[i].landmark;
                this.orderdetails[0].custemail = onlinereference[i].custemail;
              }
              this.orderdetails[0].paymodeid = onlinereference[i].paymodeid;
              this.orderdetails[0].pmothers = this.orderdetails[0].totalprice;
              this.orderdetails[0].dueamount = '0';
            }
          }
        }
        //Token NO
        if (ordertype == orderfrom.TAKEAWAY || ordertype == orderfrom.DELIVERY || ordertype == orderfrom.ROOM_SERVICE || ordertype == orderfrom.SELF_SERVICE) {
          this.orderdetails[0].tokenno = token_no;
        }
        // room service
        if (ordertype == orderfrom.ROOM_SERVICE && this.HtlDesk == 'N') {
          this.orderdetails[0].ordertype = 'D';
          this.orderdetails[0].roomservice = 'Y';
          this.orderdetails[0].roomno = this.roomid;
        }
        else if (ordertype == orderfrom.ROOM_SERVICE && this.HtlDesk == 'Y') {
          this.orderdetails[0].ordertype = 'D';
          this.orderdetails[0].roomservice = 'Y';
          this.orderdetails[0].roomno = this.roomid;
          this.orderdetails[0].htldesk = 'Y';
          this.orderdetails[0].htlbookid = this.htlbookid;
          if (this.htlbookname != undefined || this.htlbookname != null)
            this.orderdetails[0].cusname = this.htlbookname;
          if (this.htlbookmobile != undefined || this.htlbookmobile != null)
            this.orderdetails[0].custmob == this.htlbookmobile;

        }
        else {
          this.orderdetails[0].htldesk = 'N';
          this.orderdetails[0].htlbookid = 0;
        }

        //Delivery

        if (ordertype == orderfrom.DELIVERY) {
          if (this.orderdetails[0].custmob == '') {
            this.openToast("Enter Customer Mobile");
            this.dismiss();
            return false;
          }
          else if (this.orderdetails[0].cusname == '') {
            this.openToast("Enter Customer Name");
            this.dismiss();
            return false;
          }
          else if (this.orderdetails[0].custaddr == '') {
            this.openToast("Enter Customer Address");
            this.dismiss();
            return false;
          }
        }
        if (ordertype == orderfrom.ROOM_SERVICE) {
          if (this.orderdetails[0].custmob == '') {
            this.openToast("Enter Customer Mobile");
            this.dismiss();
            return false;
          }
          else if (this.orderdetails[0].cusname == '') {
            this.openToast("Enter Customer Name");
            this.dismiss();
            return false;
          }
        }


        if (ORDER_ID == null || ORDER_ID == "") {
          let dateTime = new Date();
          this.currenttime = formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US', '+0530');
          console.log(this.currenttime);
          for (var i = 0; i < this.orderdetails.length; i++) {
            var prevorderid = localStorage.getItem('prevorderid');

            if (prevorderid == null || prevorderid == undefined || prevorderid == '') {
              var sql = "INSERT INTO sr_orders_tbl (restid,branchid,userid,ordertype,orderstatus,orderprice,totalprice,redeemprice,time,statusrequest,captainid,waiterid,transferstatus,nofpeople,billedstatus,settlement,custaddr,";
              sql += "custname,custmob,custemail,splittype,billtype,paystatus,OnlineRef,CustomerPickUp,discper,discprice,billdate,ordfloorid,tokenno,discby,tableno,roomservice,roomno,delvimmediatesettle,dueamount,paymodeid,pmothers,driverid,createdate,flatno,latitude,longitude,htldesk,htlbookid,UIComp)";
              sql += "VALUES(" + this.restid + ",'" + this.branchid + "'," + this.orderdetails[i].userid + ",'" + this.orderdetails[i].ordertype + "','CD'," + this.orderdetails[i].orderprice + "," + this.orderdetails[i].totalprice + ",0.00," + this.deliverytime + ",'M'," + this.orderdetails[i].waiterid + "," + this.orderdetails[i].captainid + ",'" + this.orderdetails[i].transferstatus + "'," + this.orderdetails[i].noofpeople + ",'";
              sql += this.orderdetails[i].billedstatus + "','" + this.orderdetails[i].settlement + "','" + this.orderdetails[i].custaddr + "','" + this.orderdetails[i].custname + "','" + this.orderdetails[i].custmob + "','" + this.orderdetails[i].custemail + "','" + this.orderdetails[i].splittype + "','" + this.orderdetails[i].billtype + "','C'," + this.orderdetails[i].onlineref + ",'N'," + this.orderdetails[i].discper + "," + this.orderdetails[i].discprice + ",'";
              sql += this.orderdetails[i].billdate + "'," + this.orderdetails[i].ordfloorid + "," + this.orderdetails[i].tokenno + ",'" + this.orderdetails[i].discby + "'," + this.orderdetails[i].tableno + ",'" + this.orderdetails[i].roomservice + "'," + this.orderdetails[i].roomno + ",'Y'," + this.orderdetails[i].dueamount + "," + this.orderdetails[i].paymodeid + ",'" + this.orderdetails[0].pmothers + "','" + this.orderdetails[i].driverid + "','" + this.currenttime + "','" + this.orderdetails[i].flatno + "','" + this.orderdetails[i].latitude + "','" + this.orderdetails[i].longitude + "','" + this.orderdetails[i].htldesk + "','" + this.orderdetails[i].htlbookid + "','" + this.orderdetails[i].UIComp + "')";
            }
            else {
              var sql = "INSERT INTO sr_orders_tbl (orderid,restid,branchid,userid,ordertype,orderstatus,orderprice,totalprice,redeemprice,time,statusrequest,captainid,waiterid,transferstatus,nofpeople,billedstatus,settlement,custaddr,";
              sql += "custname,custmob,custemail,splittype,billtype,paystatus,OnlineRef,CustomerPickUp,discper,discprice,billdate,ordfloorid,tokenno,discby,tableno,roomservice,roomno,delvimmediatesettle,dueamount,paymodeid,pmothers,driverid,createdate,flatno,latitude,longitude,htldesk,htlbookid,UIComp)";
              sql += "VALUES(" + prevorderid + "," + this.restid + ",'" + this.branchid + "'," + this.orderdetails[i].userid + ",'" + this.orderdetails[i].ordertype + "','CD'," + this.orderdetails[i].orderprice + "," + this.orderdetails[i].totalprice + ",0.00," + this.deliverytime + ",'M'," + this.orderdetails[i].waiterid + "," + this.orderdetails[i].captainid + ",'" + this.orderdetails[i].transferstatus + "'," + this.orderdetails[i].noofpeople + ",'";
              sql += this.orderdetails[i].billedstatus + "','" + this.orderdetails[i].settlement + "','" + this.orderdetails[i].custaddr + "','" + this.orderdetails[i].custname + "','" + this.orderdetails[i].custmob + "','" + this.orderdetails[i].custemail + "','" + this.orderdetails[i].splittype + "','" + this.orderdetails[i].billtype + "','C'," + this.orderdetails[i].onlineref + ",'N'," + this.orderdetails[i].discper + "," + this.orderdetails[i].discprice + ",'";
              sql += this.orderdetails[i].billdate + "'," + this.orderdetails[i].ordfloorid + "," + this.orderdetails[i].tokenno + ",'" + this.orderdetails[i].discby + "'," + this.orderdetails[i].tableno + ",'" + this.orderdetails[i].roomservice + "'," + this.orderdetails[i].roomno + ",'Y'," + this.orderdetails[i].dueamount + "," + this.orderdetails[i].paymodeid + ",'" + this.orderdetails[0].pmothers + "','" + this.orderdetails[i].driverid + "','" + this.currenttime + "','" + this.orderdetails[i].flatno + "','" + this.orderdetails[i].latitude + "','" + this.orderdetails[i].longitude + "','" + this.orderdetails[i].htldesk + "','" + this.orderdetails[i].htlbookid + "','" + this.orderdetails[i].UIComp + "')";
              localStorage.setItem('prevorderid', '');
            }
          }

        }
        else {
          for (var i = 0; i < this.orderdetails.length; i++) {
            var sql = "UPDATE sr_orders_tbl SET nofpeople=" + this.orderdetails[i].noofpeople + ",orderprice=" + this.orderdetails[i].orderprice + ",totalprice=" + this.orderdetails[i].totalprice + ",driverid='" + this.orderdetails[i].driverid + "',";
            sql += "waiterid=" + this.orderdetails[i].captainid + ",captainid=" + this.orderdetails[i].waiterid + ",custname='" + this.orderdetails[i].custname + "',custaddr='" + this.orderdetails[i].custaddr + "',custmob='" + this.orderdetails[i].custmob + "',";
            sql += "custemail='" + this.orderdetails[i].custemail + "',discper=" + this.orderdetails[i].discper + ",discprice=" + this.orderdetails[i].discprice + ",discby='" + this.orderdetails[i].discby + "',";
            sql += "roomservice='" + this.orderdetails[i].roomservice + "',roomno=" + this.orderdetails[i].roomno + ",dueamount=" + this.orderdetails[i].dueamount + ",paymodeid=" + this.orderdetails[i].paymodeid + ",pmothers='" + this.orderdetails[0].pmothers + "',flatno='" + this.orderdetails[i].flatno + "',latitude='" + this.orderdetails[i].latitude + "',longitude='" + this.orderdetails[i].longitude + "',UIComp = '" + this.orderdetails[i].UIComp + "',billtype = '" + this.orderdetails[i].billtype + "'";
            sql += " WHERE orderid=" + ORDER_ID + " AND restid=" + this.restid + " AND branchid='" + this.branchid + "'";
          }


        }
      }
      //Finalize & Bill
      else if (ststype == 'Y') {
        this.itemdetails.forEach(itemdetails => {
          itemdetails.kotstatus = 'Y';
        });
        if (this.ischecked == true) {
          this.orderdetails.push({
            restid: this.restid, branchid: this.branchid, billno: "", userid: this.userid, discper: this.discper, discprice: this.totaldiscountamount, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00", time: this.time, pickupbranchid: "1",
            transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.waiterid, captainid: this.captainid, noofpeople: this.noofpax, tableno: tableid, billedstatus: "Y", settlement: "N",
            custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "I", cancelremarks: this.cancelRemarks, cancelcategory: this.cancelCategory, deliverydate: "", driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00",
            delvauthorized: "Y", discapprover: this.discApprover, discreason: this.discReason ?? '0', discremarks: this.discRemarks, redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y", cancelbilladminid: this.cancelbilladminid, paymentmode: "", billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "", delprinted: "N", ccrefid: "0", areacode: "0",
            paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: "N", roomno: "0", rateus: "", ratecomments: "", notifysent: "N", modkot: "N", approvests: "N", deliveryremarks: "", canceltime: this.cancelTime, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N", custbillissue: "N", cashiersettled: "N",
            verifykot: "N", reprint: "N", hosync: "N", roundoff: this.roundoff, ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal, htldesk: "N", htlbookid: "", discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0", cardname: "",
            cardnumber: "", cardtype: "", floorid: "", ordfloorid: this.floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude, longitude: this.longitude, taxamount: this.totalTaxAmount
          });
        }
        else {
          this.orderdetails.push({
            restid: this.restid, branchid: this.branchid, billno: "", userid: this.userid, discper: this.discper, discprice: this.totaldiscountamount, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00", time: this.time, pickupbranchid: "1",
            transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.waiterid, captainid: this.captainid, noofpeople: this.noofpax, tableno: tableid, billedstatus: "Y", settlement: "N",
            custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "B", cancelremarks: this.cancelRemarks, cancelcategory: this.cancelCategory, deliverydate: "", driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00",
            delvauthorized: "Y", discapprover: this.discApprover, discreason: this.discReason ?? '0', discremarks: this.discRemarks, redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y", cancelbilladminid: this.cancelbilladminid, paymentmode: "", billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "",
            delprinted: "N", ccrefid: "0", areacode: "0", paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: "N", roomno: "0", rateus: "", ratecomments: "", notifysent: "N", modkot: "N", approvests: "N", deliveryremarks: "", canceltime: this.cancelTime, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N",
            custbillissue: "N", cashiersettled: "N", verifykot: "N", reprint: "N", hosync: "N", roundoff: this.roundoff, ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal, htldesk: "N", htlbookid: "", discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0",
            cardname: "", cardnumber: "", cardtype: "", floorid: "", ordfloorid: this.floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude, longitude: this.longitude, taxamount: this.totalTaxAmount
          });
        }

        if ((ordertype == orderfrom.TAKEAWAY || ordertype == orderfrom.DELIVERY) && this.onlirefid != 0) {
          var onlinereference = JSON.parse(localStorage.getItem('onlinereferencemaster'));
          for (var i = 0; i < onlinereference.length; i++) {
            if (onlinereference[i].id == this.onlirefid) {
              if (onlinereference[i].onliemobile != '' && onlinereference[i].onliemobile != null && onlinereference[i].onliemobile != undefined) {
                this.orderdetails[0].custname = onlinereference[i].custname;
                this.orderdetails[0].custaddr = onlinereference[i].custaddr;
                this.orderdetails[0].custmob = onlinereference[i].onliemobile;
                this.orderdetails[0].custlandmark = onlinereference[i].landmark;
                this.orderdetails[0].custemail = onlinereference[i].custemail;
              }
              this.orderdetails[0].paymodeid = onlinereference[i].paymodeid;
              this.orderdetails[0].pmothers = this.orderdetails[0].totalprice;
              this.orderdetails[0].dueamount = '0';
              if (onlinereference[i].autodriverassign == 2 && ordertype == 'D') {
                this.orderdetails[0].driverid = onlinereference[i].onlinerefdriver;
                this.orderdetails[0].drivername = onlinereference[i].drivername;
                let dateTime = new Date();
                this.currenttime = this.datePipe.transform(dateTime, 'yyyy-MM-dd hh:mm:ss');
                this.orderdetails[0].deliverystart = this.currenttime;
                this.orderdetails[0].settlement = 'Y';
                this.orderdetails[0].settlementtimeta = this.currenttime;
              }
            }
          }
        }
        if (ordertype == orderfrom.TAKEAWAY || ordertype == orderfrom.DELIVERY || ordertype == orderfrom.ROOM_SERVICE || ordertype == orderfrom.SELF_SERVICE) {
          this.orderdetails[0].tokenno = token_no;
        }
        if (ordertype == orderfrom.ROOM_SERVICE && this.HtlDesk == 'N') {
          this.orderdetails[0].ordertype = 'D';
          this.orderdetails[0].roomservice = 'Y';
          this.orderdetails[0].roomno = this.roomid;
        }
        else if (ordertype == orderfrom.ROOM_SERVICE && this.HtlDesk == 'Y') {
          this.orderdetails[0].ordertype = 'D';
          this.orderdetails[0].roomservice = 'Y';
          this.orderdetails[0].roomno = this.roomid;
          this.orderdetails[0].htldesk = 'Y';
          this.orderdetails[0].htlbookid = this.htlbookid;
          if (this.htlbookname != undefined || this.htlbookname != null)
            this.orderdetails[0].custname = this.htlbookname;
          if (this.htlbookmobile != undefined || this.htlbookmobile != null)
            this.orderdetails[0].custmob == this.htlbookmobile;
        }
        if (ordertype == orderfrom.DELIVERY) {
          if (this.orderdetails[0].custmob == '') {
            this.openToast("Enter Customer Mobile");
            this.dismiss();
            return false;
          }
          else if (this.orderdetails[0].cusname == '') {
            this.openToast("Enter Customer Name");
            this.dismiss();
            return false;
          }
          else if (this.orderdetails[0].custaddr == '') {
            this.openToast("Enter Customer Address");
            this.dismiss();
            return false;
          }
        }
        if (ordertype == orderfrom.DELIVERY) {
          if (this.orderdetails[0].custmob == '') {
            this.openToast("Enter Customer Mobile");
            this.dismiss();
            return false;
          }
          else if (this.orderdetails[0].cusname == '') {
            this.openToast("Enter Customer Name");
            this.dismiss();
            return false;
          }
        }
        if (ORDER_ID == null || ORDER_ID == "") {
          let dateTime = new Date();
          this.currenttime = formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US', '+0530');
          console.log(this.currenttime);
          for (var i = 0; i < this.orderdetails.length; i++) {
            var prevorderid = localStorage.getItem('prevorderid');

            if (prevorderid == null || prevorderid == undefined || prevorderid == '') {
              var sql = "INSERT INTO sr_orders_tbl (restid,branchid,userid,ordertype,orderstatus,orderprice,totalprice,redeemprice,time,statusrequest,captainid,waiterid,transferstatus,nofpeople,billedstatus,settlement,custaddr,";
              sql += "custname,custmob,custemail,splittype,billtype,paystatus,OnlineRef,CustomerPickUp,discper,discprice,billdate,ordfloorid,tokenno,discby,tableno,roomservice,roomno,delvimmediatesettle,dueamount,paymodeid,pmothers,createdate,billedtime,driverid,drivername,deliverystart,settlementtimeta,roundoff,flatno,latitude,longitude,htldesk,htlbookid,taxamount,discapprover,discreason,discremarks,cancelremarks,cancelcategory,cancelbilladminid,canceltime)";
              sql += "VALUES(" + this.restid + ",'" + this.branchid + "'," + this.orderdetails[i].userid + ",'" + this.orderdetails[i].ordertype + "','CD'," + this.orderdetails[i].orderprice + "," + this.orderdetails[i].totalprice + ",0.00,'" + this.deliverytime + "','M'," + this.orderdetails[i].waiterid + "," + this.orderdetails[i].captainid + ",'" + this.orderdetails[i].transferstatus + "'," + this.orderdetails[i].noofpeople + ",'";
              sql += this.orderdetails[i].billedstatus + "','" + this.orderdetails[i].settlement + "','" + this.orderdetails[i].custaddr + "','" + this.orderdetails[i].custname + "','" + this.orderdetails[i].custmob + "','" + this.orderdetails[i].custemail + "','" + this.orderdetails[i].splittype + "','" + this.orderdetails[i].billtype + "','C'," + this.orderdetails[i].onlineref + ",'N'," + this.orderdetails[i].discper + "," + this.orderdetails[i].discprice + ",'";
              sql += this.orderdetails[i].billdate + "'," + this.orderdetails[i].ordfloorid + "," + this.orderdetails[i].tokenno + ",'" + this.orderdetails[i].discby + "'," + this.orderdetails[i].tableno + ",'" + this.orderdetails[i].roomservice + "'," + this.orderdetails[i].roomno + ",'Y'," + this.orderdetails[i].dueamount + "," + this.orderdetails[i].paymodeid + ",'" + this.orderdetails[0].pmothers + "','" + this.currenttime + "','" + this.currenttime + "',";
              sql += "'" + this.orderdetails[i].driverid + "','" + this.orderdetails[i].drivername + "','" + this.orderdetails[i].deliverystart + "','" + this.orderdetails[0].settlementtimeta + "'," + this.orderdetails[0].roundoff + ",'" + this.orderdetails[i].flatno + "','" + this.orderdetails[i].latitude + "','" + this.orderdetails[i].longitude + "','" + this.orderdetails[i].htldesk + "','" + this.orderdetails[i].htlbookid + "',";
              sql += "" + this.orderdetails[i].taxamount + "," + this.orderdetails[i].discapprover + ",'" + this.orderdetails[i].discreason + "','" + this.orderdetails[i].discremarks + "','" + this.orderdetails[i].cancelremarks + "','" + this.orderdetails[i].cancelcategory + "','" + this.orderdetails[i].cancelbilladminid + "','" + this.orderdetails[i].canceltime + "')";

            }
            else {
              var sql = "INSERT INTO sr_orders_tbl (orderid,restid,branchid,userid,ordertype,orderstatus,orderprice,totalprice,redeemprice,time,statusrequest,captainid,waiterid,transferstatus,nofpeople,billedstatus,settlement,custaddr,";
              sql += "custname,custmob,custemail,splittype,billtype,paystatus,OnlineRef,CustomerPickUp,discper,discprice,billdate,ordfloorid,tokenno,discby,tableno,roomservice,roomno,delvimmediatesettle,dueamount,paymodeid,pmothers,createdate,billedtime,driverid,drivername,deliverystart,settlementtimeta,roundoff,flatno,latitude,longitude,htldesk,htlbookid,taxamount,discapprover,discreason,discremarks,cancelremarks,cancelcategory,cancelbilladminid,canceltime)";
              sql += "VALUES(" + prevorderid + "," + this.restid + ",'" + this.branchid + "'," + this.orderdetails[i].userid + ",'" + this.orderdetails[i].ordertype + "','CD'," + this.orderdetails[i].orderprice + "," + this.orderdetails[i].totalprice + ",0.00,'" + this.deliverytime + "','M'," + this.orderdetails[i].waiterid + "," + this.orderdetails[i].captainid + ",'" + this.orderdetails[i].transferstatus + "'," + this.orderdetails[i].noofpeople + ",'";
              sql += this.orderdetails[i].billedstatus + "','" + this.orderdetails[i].settlement + "','" + this.orderdetails[i].custaddr + "','" + this.orderdetails[i].custname + "','" + this.orderdetails[i].custmob + "','" + this.orderdetails[i].custemail + "','" + this.orderdetails[i].splittype + "','" + this.orderdetails[i].billtype + "','C'," + this.orderdetails[i].onlineref + ",'N'," + this.orderdetails[i].discper + "," + this.orderdetails[i].discprice + ",'";
              sql += this.orderdetails[i].billdate + "'," + this.orderdetails[i].ordfloorid + "," + this.orderdetails[i].tokenno + ",'" + this.orderdetails[i].discby + "'," + this.orderdetails[i].tableno + ",'" + this.orderdetails[i].roomservice + "'," + this.orderdetails[i].roomno + ",'Y'," + this.orderdetails[i].dueamount + "," + this.orderdetails[i].paymodeid + ",'" + this.orderdetails[0].pmothers + "','" + this.currenttime + "','" + this.currenttime + "',";
              sql += "'" + this.orderdetails[i].driverid + "','" + this.orderdetails[i].drivername + "','" + this.orderdetails[i].deliverystart + "','" + this.orderdetails[0].settlementtimeta + "'," + this.orderdetails[0].roundoff + ",'" + this.orderdetails[i].flatno + "','" + this.orderdetails[i].latitude + "','" + this.orderdetails[i].longitude + "','" + this.orderdetails[i].htldesk + "','" + this.orderdetails[i].htlbookid + "',";
              sql += "" + this.orderdetails[i].taxamount + "," + this.orderdetails[i].discapprover + ",'" + this.orderdetails[i].discreason + "','" + this.orderdetails[i].discremarks + "','" + this.orderdetails[i].cancelremarks + "','" + this.orderdetails[i].cancelcategory + "','" + this.orderdetails[i].cancelbilladminid + "','" + this.orderdetails[i].canceltime + "')";
              localStorage.setItem('prevorderid', '');
            }
          }
        }
        else {
          for (var i = 0; i < this.orderdetails.length; i++) {
            var sql = "UPDATE sr_orders_tbl SET nofpeople=" + this.orderdetails[i].noofpeople + ",orderprice=" + this.orderdetails[i].orderprice + ",totalprice=" + this.orderdetails[i].totalprice + ",billedstatus='" + this.orderdetails[i].billedstatus + "',";
            sql += "waiterid=" + this.orderdetails[i].captainid + ",captainid=" + this.orderdetails[i].waiterid + ",custname='" + this.orderdetails[i].custname + "',custaddr='" + this.orderdetails[i].custaddr + "',custmob='" + this.orderdetails[i].custmob + "',";
            sql += "custemail='" + this.orderdetails[i].custemail + "',discper=" + this.orderdetails[i].discper + ",discprice=" + this.orderdetails[i].discprice + ",discby='" + this.orderdetails[i].discby + "',";
            sql += "roomservice='" + this.orderdetails[i].roomservice + "',roomno=" + this.orderdetails[i].roomno + ",dueamount=" + this.orderdetails[i].dueamount + ",paymodeid=" + this.orderdetails[i].paymodeid + ",pmothers='" + this.orderdetails[0].pmothers + "',";
            sql += "driverid='" + this.orderdetails[i].driverid + "',drivername='" + this.orderdetails[i].drivername + "',deliverystart='" + this.orderdetails[i].deliverystart + "',settlementtimeta='" + this.orderdetails[0].settlementtimeta + "',";
            sql += "roundoff =" + this.orderdetails[0].roundoff + ",flatno='" + this.orderdetails[i].flatno + "',latitude='" + this.orderdetails[i].latitude + "',longitude='" + this.orderdetails[i].longitude + "',taxamount = " + this.orderdetails[i].taxamount + ",";
            sql += "discapprover = " + this.orderdetails[i].discapprover + ",discreason = '" + this.orderdetails[i].discreason + "',discremarks = '" + this.orderdetails[i].discremarks + "',cancelremarks = '" + this.orderdetails[i].cancelremarks + "',cancelcategory = '" + this.orderdetails[i].cancelcategory + "',";
            sql += "cancelbilladminid = '" + this.orderdetails[i].cancelbilladminid + "',canceltime = '" + this.orderdetails[i].canceltime + "',billtype = '" + this.orderdetails[i].billtype + "'";
            sql += " WHERE orderid=" + ORDER_ID + " AND restid=" + this.restid + " AND branchid='" + this.branchid + "'";
          }

          console.log(sql);
        }


      }
      console.log(sql);
      let orderid;
      this.sqlservice.saveorder(sql, this.branchid, this.restid, ORDER_ID, prevorderid).then((res) => {
        console.log(res);
        orderid = res;
        this.order_id = res;
        let dateTime = new Date();
        this.currenttime = formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US', '+0530');
      }).then(() => {
        this.itemdetails.forEach(itemdetails => {
          itemdetails.modifier.forEach(modifier => {
            if (modifier.itemqty > 0) {
              modifier.pos_unitprice = '0.00';
              modifier.status = 'A';
              modifier.ronumber = '1';
              modifier.priority = '0000-00-00 00:00:00';
              modifier.kottime = '0000-00-00 00:00:00';
              modifier.pickpointtime = '0000-00-00 00:00:00';
              modifier.deliverytime = '0000-00-00 00:00:00';
              modifier.waiterid = this.captainid;  //Captain ID
              modifier.userid = this.userid;
              modifier.pickitemviewed = '';
              modifier.wtrid = this.waiterid;  //waiter ID
              modifier.hosync = 'N';
              modifier.itemsaving = '1.000';
              modifier.litem = 'N';
              modifier.halltype = this.hallType;
              modifier.cptnreward = '0.00';
              modifier.ltype = 'L';
              modifier.htldesk = 'N';
              modifier.itemcompleremarks = '';
              modifier.combotype = 'S';
              modifier.comboparent = '';
              modifier.modindex = '0';
              modifier.ismodifier = 'N';
              modifier.prod_act = 'N';
              modifier.taxitem = 'Y';
              modifier.kotcount = '1';
              modifier.chefacktime = null;
              modifier.chefuserid = '';
              modifier.happyparent = '';
              modifier.onlinecombotype = 'S';
              modifier.onlinecomboparent = '';
              modifier.kotstatus = "Y";
              modifier.discrate = '0.00';
              modifier.discamt = '0.00';
              modifier.itemsavetype = 'N';
              modifier.itemdiscamount = '0.00';
              modifier.feedbackrate = '0';
              modifier.stock_act = 'N';
              modifier.taxexmpamt = '';
            }
          })
          if (itemdetails.combomenu.length > 0) {
            itemdetails.combomenu.forEach(combomenu => {
              combomenu.itemqty = itemdetails.itemqty;
              combomenu.itemwisecalories = combomenu.calories;
              combomenu.pos_unitprice = '0.00';
              combomenu.status = 'A';
              combomenu.ronumber = '1';
              combomenu.priority = '0000-00-00 00:00:00';
              combomenu.kottime = '0000-00-00 00:00:00';
              combomenu.pickpointtime = '0000-00-00 00:00:00';
              combomenu.deliverytime = '0000-00-00 00:00:00';
              combomenu.waiterid = this.captainid;  //Captain ID
              combomenu.userid = this.userid;
              combomenu.pickitemviewed = '';
              combomenu.wtrid = this.waiterid;  //waiter ID
              combomenu.hosync = 'N';
              combomenu.itemsaving = '1.000';
              combomenu.litem = 'N';
              combomenu.halltype = this.hallType;
              combomenu.itemcomplimentary = 'Y';
              combomenu.cptnreward = '0.00';
              combomenu.ltype = 'L';
              combomenu.htldesk = 'N';
              combomenu.currentstatus = 'K';
              combomenu.itemcompleremarks = '';
              combomenu.combotype = 'C';
              combomenu.comboparent = '';
              combomenu.modindex = '0';
              combomenu.ismodifier = 'N';
              combomenu.prod_act = 'N';
              combomenu.taxitem = 'Y';
              combomenu.kotcount = '1';
              combomenu.chefacktime = null;
              combomenu.chefuserid = '';
              combomenu.happyparent = '';
              combomenu.onlinecombotype = 'S';
              combomenu.onlinecomboparent = '';
              combomenu.kotstatus = "Y";
              combomenu.discrate = '0.00';
              combomenu.discamt = '0.00';
              combomenu.itemsavetype = 'N';
              combomenu.itemdiscamount = '0.00';
              combomenu.feedbackrate = '0';
              combomenu.stock_act = 'N';
              combomenu.taxexmpamt = '';
              combomenu.taenabled = itemdetails.taenabled
            })
          }
        })
        const ORDER_SUMMERY: any = [];
        const ORDER_TAX: any = [];
        const MODIFIER_ITEM: any = [];
        const COMBO_ITEM: any = [];
        const MOD_TAX: any = [];
        let ordersummaryid: any = 0;
        let ostaxid: any = 0;


        var sql = 'SELECT IFNULL (MAX(CASt(ordersummaryid as INTEGER))+1,1) AS ordersummaryid FROM sr_order_smry_tbl WHERE srestid=' + this.restid + ' AND sbranchid="' + this.branchid + '"';
        this.sqlservice.ordersum_id(sql).then(res => {
          ordersummaryid = localStorage.getItem("prevordersumryid");
          ordersummaryid = Number(ordersummaryid)
          if (ordersummaryid === null || ordersummaryid === 0 || ordersummaryid === undefined || ordersummaryid === "" || ordersummaryid === 'undefined') {
            ordersummaryid = res
          }
        }).then(() => {
          var sql = 'SELECT IFNULL (MAX(CASt(ostaxid as INTEGER))+1,1) AS ostaxid FROM sr_order_smry_tax_tbl  WHERE strestid=' + this.restid + ' AND stbranchid="' + this.branchid + '"';
          this.sqlservice.ordersum_tax_id(sql).then(res => {
            ostaxid = localStorage.getItem("prevordertaxid");
            ostaxid = Number(ostaxid);
            if (ostaxid === null || ostaxid === 0 || ostaxid === undefined || ostaxid === "" || ostaxid === 'undefined') {
              ostaxid = res
            }
          }).then(() => {
            this.itemdetails.forEach(itemdetails => {
              itemdetails.idiscprice = itemdetails.idiscprice ?? 0.00;
              itemdetails.idescper = itemdetails.idescper ?? 0.00;
              let tempItemDiscPrice = (itemdetails.itemprice/100) * this.orderdetails[0].discper;
              this.orderdetails[0].discprice += Number(itemdetails.idescper)
              let modParent = ordersummaryid;
              ORDER_SUMMERY.push([`INSERT INTO sr_order_smry_tbl(orderid,ordersummaryid,srestid,sbranchid,itemid,itemprice,pos_unitprice,itemqty,kotstatus,remarks,waiterid,wtrid,litem,
                ltype,cptnreward,ismodifier,knotes,idiscper,idiscprice,itemcomplementary,complementaryprice,taxitem,structid,
                currentstatus,prod_act,ronumber,priority,kottime,pickpointtime,deliverytime,kotcount,taenabled,halltype,
                itemwisecalories,itemsaving,modparent,taxamount,discrate,discamt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
                  ?,?,?,?,?,?,?,?,?,?,?,?,?)`, [orderid, ordersummaryid, this.restid, this.branchid, itemdetails.itemid, 
                    itemdetails.itemprice, itemdetails.pos_unitprice, itemdetails.itemqty, itemdetails.kotstatus, 
                    itemdetails.remarks, itemdetails.waiterid, itemdetails.wtrid, itemdetails.litem, itemdetails.ltype, 
                    itemdetails.cptnreward, itemdetails.ismodifier, itemdetails.knotes,0,tempItemDiscPrice, itemdetails.itemcomplimentary, itemdetails.complimentaryprice, itemdetails.taxitem,
                     itemdetails.struct_id, itemdetails.currentstatus, itemdetails.prod_act, itemdetails.ronumber, 
                     itemdetails.priority, itemdetails.kottime, itemdetails.pickpointtime, itemdetails.deliverytime, 
                     itemdetails.kotcount, itemdetails.taenabled, itemdetails.halltype, itemdetails.itemwisecalories, 
                     itemdetails.itemsaving, itemdetails.modparent, itemdetails.taxamount,itemdetails.idiscprice,itemdetails.idescper]]) 
                     
              itemdetails.taxDetails.forEach(taxdetails => {
                ORDER_TAX.push([`INSERT INTO sr_order_smry_tax_tbl(ostaxid,orderid,ordersummaryid,itemid,taxmapid,structid,taxid,taxperc,taxamount,optionaltaxapply,customizetaxapply,strestid,stbranchid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [ostaxid, orderid, ordersummaryid, taxdetails.itemid, taxdetails.taxmapid, taxdetails.struct_id, taxdetails.taxid, taxdetails.taxperc, taxdetails.taxamount, taxdetails.optionalTax, taxdetails.customizeTax, this.restid, this.branchid]])
                ostaxid = ostaxid + 1;
              })
              itemdetails.modifier.forEach(modifier => {
                ordersummaryid = ordersummaryid + 1;
                modifier.idiscprice = itemdetails.idiscprice ?? 0.00;
                modifier.idescper = itemdetails.idescper ?? 0.00;
                if (modifier.itemqty > 0) {
                  MODIFIER_ITEM.push([`INSERT INTO sr_order_smry_tbl(orderid,ordersummaryid,srestid,sbranchid,itemid,itemprice,pos_unitprice,itemqty,kotstatus,remarks,waiterid,wtrid,litem,ltype,cptnreward,ismodifier,knotes,idiscper,idiscprice,itemcomplementary,complementaryprice,taxitem,structid,currentstatus,prod_act,ronumber,priority,kottime,pickpointtime,deliverytime,kotcount,taenabled,halltype,itemwisecalories,itemsaving,modparent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [orderid, ordersummaryid, this.restid, this.branchid, modifier.itemid, modifier.itemprice, modifier.pos_unitprice, modifier.itemqty, modifier.kotstatus, modifier.remarks, modifier.waiterid, modifier.wtrid, modifier.litem, modifier.ltype, modifier.cptnreward, modifier.ismodifier, modifier.knotes, modifier.idescper, modifier.idiscprice, modifier.itemcomplimentary, modifier.complimentaryprice, modifier.taxitem, modifier.struct_id, modifier.currentstatus, modifier.prod_act, modifier.ronumber, modifier.priority, modifier.kottime, modifier.pickpointtime, modifier.deliverytime, modifier.kotcount, modifier.taenabled, modifier.halltype, modifier.itemwisecalories, modifier.itemsaving, modParent]])
                }
                modifier.taxDetails.forEach(tax => {
                  ostaxid = ostaxid + 1;
                  MOD_TAX.push([`INSERT INTO sr_order_smry_tax_tbl(ostaxid,orderid,ordersummaryid,itemid,taxmapid,structid,taxid,taxperc,taxamount,optionaltaxapply,customizetaxapply,strestid,stbranchid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [ostaxid, orderid, ordersummaryid, tax.itemid, tax.taxmapid, tax.struct_id, tax.taxid, tax.taxperc, tax.taxamount, tax.optionalTax, tax.customizeTax, this.restid, this.branchid]])
                });
              })
              if (itemdetails.combomenu.length > 0) {
                itemdetails.combomenu.forEach(combomenu => {
                  ordersummaryid = ordersummaryid + 1;
                  COMBO_ITEM.push([`INSERT INTO sr_order_smry_tbl(orderid,ordersummaryid,srestid,sbranchid,itemid,itemprice,pos_unitprice,itemqty,kotstatus,remarks,waiterid,wtrid,litem,ltype,cptnreward,ismodifier,knotes,idiscper,idiscprice,itemcomplementary,complementaryprice,taxitem,structid,currentstatus,prod_act,ronumber,priority,kottime,pickpointtime,deliverytime,kotcount,taenabled,halltype,itemwisecalories,itemsaving,comboparent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [orderid, ordersummaryid, this.restid, this.branchid, combomenu.menuid, combomenu.price, combomenu.pos_unitprice, combomenu.itemqty, combomenu.kotstatus, combomenu.waiterid, combomenu.wtrid, combomenu.litem, combomenu.ltype, combomenu.cptnreward, combomenu.ismodifier, '', 0, 0, combomenu.itemcomplimentary, 0, 'N', 0, combomenu.currentstatus, combomenu.prod_act, combomenu.ronumber, combomenu.priority, combomenu.kottime, combomenu.pickpointtime, combomenu.deliverytime, combomenu.kotcount, combomenu.taenabled, combomenu.halltype, combomenu.itemwisecalories, combomenu.itemsaving, ordersummaryid]])
                })
              }
              ordersummaryid = ordersummaryid + 1;
            })
            localStorage.setItem('prevordersumryid', '');
            localStorage.setItem('prevordertaxid', '');
          }).then(() => {
            this.sqlservice.Batch_query(ORDER_SUMMERY).then(res => {
              console.log("Order Summery Inserted......")
            }).catch(error => {
              console.error(error);
            })
          }).then(() => {
            this.sqlservice.Batch_query(ORDER_TAX).then(res => {
              console.log("Tax Inserted......")
            }).catch(error => {
              console.error(error);
            })
          }).then(() => {
            this.sqlservice.Batch_query(MODIFIER_ITEM).then(res => {
              console.log("Modifier Inserted......");
              this.sqlservice.Batch_query(MOD_TAX).then(res => {
                console.log("Modifier Tax Inserted......");
              }).catch(error => {
                console.error(error);
              })
            }).catch(error => {
              console.error(error);
            })
          }).then(() => {
            this.sqlservice.Batch_query(COMBO_ITEM).then(res => {
              console.log("Combo Inserted......")
            }).catch(error => {
              console.error(error);
            })
          }).then(() => {
            var StockDedTyp = localStorage.getItem("stockdedtyp");
            if (StockDedTyp != null && StockDedTyp == "B")
              this.dostockdetection(orderid, this.branchid, this.restid, this.itemdetails);
            let productionCountEnable = localStorage.getItem('productionCountEnable');
            if (productionCountEnable === 'Y') {
              this.productionService._doProduction(this.branchid, this.restid, this.itemdetails);
            }
            if (ordertype == orderfrom.DELIVERY) {
              if (ORDER_ID == null || ORDER_ID == "") {
                this.ordertoadlog(orderid);
              } else {
                this.ordertoadlog(ORDER_ID);
              }
            }
            if (ordertype == orderfrom.DELIVERY) {
              this.redeem_points(this.cusnumber, this.grandtotal, this.rewardpoint);
            }
            if (ststype == 'Y') {
              var billno = this.generatebillno(orderid, this.restid, this.branchid);
              var autoassign = this.drivbal(orderid, this.restid, this.branchid);
              if (this.discperc !== '' && this.discamnt !== '') {
                this.updateItemDetails.forEach(async items => {
                  let updateSumSql: string = `UPDATE sr_order_smry_tbl SET taxamount = ${items.taxamount} WHERE itemid = '${items.itemid}' AND orderid ='${items.orderid}' AND ordersummaryid ='${items.ordersummaryid}' AND  srestid = '${this.restid}' AND sbranchid ='${this.branchid}' `;
                  await this.sqlservice.updateorder(updateSumSql);
                  items.taxDetails.forEach(async element => {
                    let updateTaxSql: string = `UPDATE sr_order_smry_tax_tbl SET taxamount = ${element.taxamount} WHERE itemid = '${element.itemid}' AND orderid ='${element.orderid}' AND ordersummaryid ='${element.ordersummaryid}' AND  strestid = '${this.restid}' AND stbranchid ='${this.branchid}' AND taxid = ${element.taxid}`;
                    await this.sqlservice.updateorder(updateTaxSql);
                  });
                });
              }
              
              this.dismiss();
            }

            this.cartService.removeAllCartItems();
            this.cartItems = 0;
            this.openToast('Order Placed Successfully...! Order ID is ' + this.order_id);
            if (ststype == 'N' || ststype == 'Y' || ststype == 'S' || ststype == 'H') {
              if (ststype == 'N') {
                this.dismiss();
                if (this.Platform.is("cordova")) {
                  if (this.kotBillStatus == 'Network') {
                    this.printerservice.sendKOTForTCP(orderid, this.itemdetails, this.orderdetails, this.floorname, this.kotIP, 'N');
                  } else if (this.kotBillStatus == 'USB') {
                    this.printerservice.getKOTPrint(orderid, this.itemdetails, this.orderdetails, this.floorname, 'N');
                  } else if (this.kotBillStatus == 'Bluetooth') {
                    this.kot(orderid, 'N');
                  }
                } else {
                  //  let navigationExtras: NavigationExtras = {
                  //   queryParams: {
                  //     orderid:orderid,
                  //     itemdetails: JSON.stringify(this.itemdetails),
                  //     orderdetails:JSON.stringify(this.orderdetails),
                  //     ststype:ststype,
                  //     floorname:this.floorname,
                  //     restid:this.restid,
                  //     branchid:this.branchid
                  //   }
                  // };
                  // this.router.navigate(['kotbill'], navigationExtras);
                  this.kotPrint(orderid, ststype);
                }
              }
            }
            localStorage.removeItem('custname');
            localStorage.removeItem('custaddr');
            localStorage.removeItem('cusnumber');
            localStorage.removeItem('latitude');
            localStorage.removeItem('longitude');
            localStorage.removeItem('flatno');
            if (ststype == 'N' || ststype == 'S' || ststype == 'H') {
              localStorage.setItem('orderid', this.order_id);
              localStorage.setItem('order_id', this.order_id);
              this.dismiss();
              this.ionViewDidEnter();
            }
            else if (ststype == 'Y') {
              localStorage.setItem('orderid', '');
              localStorage.setItem('order_id', '');
              this.dismiss();
            }
          })
        })
      })
    }
    else {
      this.dismiss();
      this.openToast('Please add atleast One Item');
    }

  }
  splitbill() {
    if (this.cartdetails.length > 0) {
      if (this.order_type == 'E') {
        var orderid = this.ORDER_ID;
        var order_id = localStorage.getItem('order_id');
        let navigationExtras: NavigationExtras = {
          queryParams: {
            orderid: orderid,
            order_id: order_id,
            restid: this.restid,
            branchid: this.branchid,
            tableno: this.tablename
          }
        };
        this.router.navigate(['splitbill'], navigationExtras);
      }
      else {
        this.openToast('Split Bill Support Only Dine In Order...')
      }
    }
    else {
      this.openToast('No Running Order...')
    }
  }
  splitbill_mob() {
    var orderid = localStorage.getItem('orderid');
    var order_id = localStorage.getItem('order_id');
    let navigationExtras: NavigationExtras = {
      queryParams: {
        orderid: orderid,
        order_id: order_id,
        restid: this.restid,
        branchid: this.branchid,
        tableno: this.tablename,
        ordertype: this.order_type
      }
    };
    this.router.navigate(['settings'], navigationExtras);
  }


  //PRINT KOT
  kot(orderid, cancelKOT: string) {
    var ordertype = localStorage.getItem('ordertype');
    var tablename = localStorage.getItem('tablename');
    var order_type = '';
    var restdetails = `SELECT a.branchname,a.fssaino,a.emailid,a.addr1,a.mobile1 AS mobile, b.restaurantname,b.gstaxno,a.phone1, c.orderid,c.billno,
    c.ordertype,c.custname,c.custaddr,c.custmob,c.custlandmark,c.tokenno,c.billedtime,c.discby,c.discper,c.discprice,c.tableno,c.totalprice,
    c.billtype,c.onlineref,c.roundoff,c.ordfloorid,c.agentname,d.descr AS refname,f.descr AS floorname
    FROM sr_orders_tbl c LEFT JOIN sr_onlinereferal_mstr d ON c.onlineref = d.id AND c.restid=d.restid AND c.branchid=d.branchid
    INNER JOIN sr_tablefloor_mstr f  ON  c.ordfloorid = f.id AND c.restid=f.restid AND c.branchid=f.branchid
    INNER JOIN  sr_branches_tbl a  ON f.restid=a.restid AND f.branchid=a.branchid
    INNER JOIN  sr_restaurants_tbl b ON a.restid=b.restid WHERE  a.branchid='${this.branchid}' AND a.restid=${this.restid} AND c.orderid=${orderid}`;
    this.sqlservice.restdetails(restdetails).then((res) => {
      var rest_details = res;

      if (ordertype == 'E') {
        order_type = rest_details[0].floorname + '- Dine-In';
      }
      else if (ordertype == 'P') {
        order_type = rest_details[0].floorname + '- TakeAway';
      }
      else if (ordertype == 'D') {
        order_type = rest_details[0].floorname + '- Delivery';
      }
      else {
        order_type = rest_details[0].floorname + ' - Self-Service';
      }

      if (ordertype == 'E') {
        if (cancelKOT === 'Y') {
          var data = "\n Cancel KOT";
        } else {
          data = "";
        }
        data = order_type + "\n Table NO :" + tablename + "\n Order ID :" + this.order_id;
      }
      else {
        if (cancelKOT === 'Y') {
          var data = "\n Cancel KOT";
        } else {
          data = "";
        }
        data = order_type + "\n Token NO :" + rest_details[0].tokenno + "\n Order ID :" + this.order_id;
      }

      if (this.captainid != '0') {
        var captainlist = JSON.parse(localStorage.getItem('captainlist'));
        for (var i = 0; i < captainlist.length; i++) {
          if (this.captainid == captainlist[i].id)
            data += "\nCaptain Name : " + captainlist[i].cname;
        }

      }
      if (this.waiterid != '0') {
        var waiterlist = JSON.parse(localStorage.getItem('waiter'));
        for (var i = 0; i < waiterlist.length; i++) {
          if (this.waiterid == waiterlist[i].empcode)
            data += "\nWaiter Name : " + waiterlist[i].wname;
        }

      }
      data += "\n-------------------------------";
      data += "\nItem Name                   QTY";
      data += "\n-------------------------------\n";
      for (var i = 0; i < this.itemdetails.length; i++) {
        var knoterem = '';
        var modifier = this.itemdetails[i].modifier;
        var combomenu = this.itemdetails[i].combomenu;
        console.log(modifier);
        console.log(combomenu);
        if (this.itemdetails[i].combotype != 'M') {
          if (this.itemdetails[i].remarks == '(Take-Away)')
            this.itemdetails[i].remarks = '';
          if (this.itemdetails[i].knotes != '' && this.itemdetails[i].remarks == '') {
            knoterem = this.itemdetails[i].knotes;
          }
          else if (this.itemdetails[i].knotes == '' && this.itemdetails[i].remarks != '') {
            knoterem = this.itemdetails[i].remarks;
          }
          else if (this.itemdetails[i].knotes == '' && this.itemdetails[i].remarks == '') {
            knoterem = '';
          }
          else {
            knoterem = this.itemdetails[i].knotes + ', ' + this.itemdetails[i].remarks;
          }
          if (knoterem == '')
            data += this.itemdetails[i].itemname + "\n";
          else
            data += this.itemdetails[i].itemname + '(' + knoterem + ')' + "\n";
          if (this.itemdetails[i].taenabled == 'Y')
            data += "(TakeAway)" + "\n";
          data += "                            " + this.itemdetails[i].itemqty + "\n";
          if (modifier.length > 0) {
            for (var j = 0; j < modifier.length; j++) {
              data += "*" + modifier[j].itemname + "\n";
              data += "                            " + modifier[j].itemqty + "\n";
            }
          }
        }
        else {
          for (var j = 0; j < combomenu.length; j++) {
            data += combomenu[j].name + "\n";
            data += "                            " + combomenu[j].itemqty + "\n";
          }
        }
      }
      if (rest_details[0].onlineref != "" && rest_details[0].onlineref != 0) {
        var onlinereferencemaster = JSON.parse(localStorage.getItem('onlinereferencemaster'));
        for (var k = 0; k < onlinereferencemaster.length; k++) {
          if (onlinereferencemaster[k].id == rest_details[0].onlineref) {
            data += "OnlineRef # : " + onlinereferencemaster[k].descr + "\n";
          }
        }
      }
      this.datas = data;
      this.selectedPrinter = localStorage.getItem("btmacaddresss");
      // this.listPrinter();
      this.sendToBluetoothPrinter(this.kotIP, this.datas);
    });
  }

  //MAIN BILL
  /*(orderid)
  {
    this.orderdet=[];
    this.ordertax=[];
    var tablename=localStorage.getItem('tablename');
    this.datas='';
      var restdetails="SELECT a.branchname,a.emailid,a.addr1,a.mobile1 AS mobile, b.restaurantname, a.phone1, c.orderid,c.billno,c.ordertype,c.custname,c.custaddr,c.custmob,c.custlandmark,c.tokenno,c.billedtime,c.discby,c.discper,c.discprice FROM  sr_branches_tbl a, sr_restaurants_tbl b, sr_orders_tbl c WHERE a.restid=b.restid AND a.restid=c.restid AND a.branchid=c.branchid AND a.branchid='"+this.branchid+"' AND a.restid="+this.restid+" AND c.orderid="+orderid;

      this.sqlservice.restdetails(restdetails).then((res) => {
        var rest_details=res;
        localStorage.setItem('restaurantname',rest_details[0].restname);
        console.log(rest_details);
        var orderdetails="SELECT a.ordersummaryid,a.itemprice,a.itemqty,b.name,a.currentstatus,a.kotstatus FROM sr_order_smry_tbl a,sr_menumstr_tbl b WHERE a.itemid=b.menuid AND a.sbranchid='"+this.branchid+"' AND a.srestid="+this.restid+" AND a.orderid="+orderid;
        this.sqlservice.orderdetails(orderdetails).then((res) => {
          this.orderdet=res;
          var ordertax="SELECT a.ordersummaryid,a.itemid,a.taxid,a.taxperc,SUM(a.taxamount) as taxamount FROM sr_order_smry_tax_tbl a WHERE a.orderid="+orderid+" GROUP BY a.taxid";
          this.sqlservice.ordertax(ordertax).then((res) => {
           this.ordertax=res;
           //console.log(this.ordertax);
           var taxarray=[];
           var taxlist=[];
           taxarray=JSON.parse(localStorage.getItem('taxlist'));
             for(var i=0; i<this.ordertax.length;i++)
             {
                for(var j=0; j<taxarray.length; j++)
                {
                    if(this.ordertax[i].taxid == taxarray[j].taxid)
                    {
                        this.ordertax[i].taxname=taxarray[j].taxname;
                        //taxlist.push({taxname:taxarray[j].taxname,taxperc:this.ordertax[i].taxperc,taxamount:this.ordertax[i].taxamount});
                    }
                }
             }
             console.log(taxlist);
             var data=rest_details[0].restname+"\n";
            data +=rest_details[0].address+"\n";
            data +="Phone : "+rest_details[0].phone+"\n";
            data +="*** Bill No - "+rest_details[0].billno+" *** \n";
            if(rest_details[0].ordertype == 'E')
            {
                data +="Table No # : "+tablename+"\n";
                data +="Dine-In \n";
            }
            else
            {
                data +="Token No # : "+rest_details[0].tokenno+"\n";
                data +="TakeAway \n";
            }
            data +="Customer Name :"+rest_details[0].custname+"\n";
            data +="Cashier : "+localStorage.getItem('Name')+"\n";
            data +="Date : "+rest_details[0].billedtime+"\n";

            data +="--------------------------------\n";
            data +="Item Name        Price  QTY  SUB\n";
            data +="--------------------------------\n";
            this.price=0;
           this.subtotal=0;
            var taxamount=0;
            this.grandtotal=0;
            var qty=0;
            for(var i=0; i<this.orderdet.length; i++)
            {
              this.price=parseFloat(this.orderdet[i].itemqty) * parseFloat(this.orderdet[i].itemprice);
                data +=this.orderdet[i].name+"     \n";
                data+="              "+parseFloat(this.orderdet[i].itemprice).toFixed(2)+"  "+parseInt(this.orderdet[i].itemqty)+"  "+parseFloat(this.price).toFixed(2)+"\n";
                this.subtotal=this.subtotal+this.price;
                qty=qty+this.orderdet[i].itemqty;
            }
            data +="--------------------------------\n";
            data +="Sub Total               : "+parseFloat(this.subtotal).toFixed(2)+"\n";
            for(var i=0; i<this.ordertax.length; i++)
            {
              if(this.ordertax[i].taxperc >0)
              data +=this.ordertax[i].taxname+" "+parseFloat(this.ordertax[i].taxperc).toFixed(2)+"%              : "+parseFloat(this.ordertax[i].taxamount).toFixed(2)+"\n";
              else
              data +=this.ordertax[i].taxname+"           : "+parseFloat(this.ordertax[i].taxamount).toFixed(2)+"\n";
              taxamount=taxamount+this.ordertax[i].taxamount;
            }
            if(rest_details[0].discby!=null)
            {
            if(rest_details[0].discby=="P")
            data +="Discount "+rest_details[0].discper+"%            : "+parseFloat(rest_details[0].discprice).toFixed(2)+"\n";
            else
            data +="Discount                : "+parseFloat(rest_details[0].discprice).toFixed(2)+"\n";
            }
            this.grandtotal=this.subtotal+taxamount-rest_details[0].discprice;
            data +="--------------------------------\n";
            data +="Grand Total             : "+parseFloat(this.grandtotal).toFixed(2)+"\n\n";
            data +="Total Items-"+this.orderdet.length+",No. of Quantity-"+qty+"\n";
            data +="--------------------------------\n";
            //data +="     www.foodenginepos.com";
            this.datas=data;

       console.log(this.datas);
        this.selectedPrinter="02:02:C6:4C:5E:0C";
        this.sendToBluetoothPrinter(this.selectedPrinter,this.datas);
      });
      });
    });
  }*/

  //GENERATE BILL NO
  generatebillno(orderid, restid, branchid) {
    var billnoreset = localStorage.getItem('billnoreset');
    var orderdetails = 'SELECT restid,branchid,ordertype,ordfloorid,sesid,roomservice,userid,billno,billdate FROM sr_orders_tbl WHERE orderid =' + orderid;

    this.sqlservice.getorderdetails(orderdetails).then((res) => {
      console.log(res);
      let dateTime = new Date();
      var date = this.datePipe.transform(dateTime, 'yyyy-MM-dd');
      var billdate = date;
      var billno = res[0].billno;
      var floorid = res[0].floorid;
      var ordertype = res[0].ordertype;
      var roomservice = res[0].roomservice;
      var sesid = res[0].sesid;
      var sql = 'SELECT acfloor FROM sr_tablefloor_mstr a,sr_orders_tbl b WHERE a.id=b.ordfloorid AND a.restid=b.restid AND a.branchid=b.branchid AND orderid=' + orderid;

      this.sqlservice.acfloor(sql).then((res) => {
        console.log(res);
        var acfloor = res;
        var dayend = 'SELECT MAX(dayenddate) as dayend FROM sr_dayend_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
        this.sqlservice.dayenddate(dayend).then((res) => {
          var dayenddate = res;

          if (billnoreset == 'D') {
            var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE billdate =  "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '"';
          }
          else if (billnoreset == 'C') {
            if (billno == null || billno == '' || billno == 0 || billno == undefined) {
              var Bill = 'SELECT (contbillnoseq)+1 as billno FROM  sr_configuration_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else {

            }
          }
          else if (billnoreset == 'O') {
            if (ordertype == 'E') {
              var Bill = 'SELECT (billnoseq)+1 as billno FROM  sr_tablefloor_mstr WHERE restid=' + restid + ' AND branchid="' + branchid + '" LIMIT 1';
            }
            else if (ordertype == 'P') {
              var Bill = 'SELECT (contbillnoseq)+1 as billno FROM  sr_configuration_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (ordertype == 'S') {
              var Bill = 'SELECT (selfbillnoseq)+1 as billno FROM  sr_configuration_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (ordertype == 'D' && roomservice == 'N') {
              var Bill = 'SELECT (delvbillnoseq)+1 as billno FROM  sr_configuration_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (ordertype == 'D' && roomservice == 'Y') {
              var Bill = 'SELECT (roomservbillnoseq)+1 as billno FROM  sr_configuration_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
            }
          }
          else if (billnoreset == 'B') {
            if (ordertype == 'E') {
              var Bill = 'SELECT (billnoseq)+1 as billno FROM  sr_tablefloor_mstr WHERE restid=' + restid + ' AND branchid="' + branchid + '" AND id=' + floorid;
            }
            else if (ordertype == 'P') {
              var Bill = 'SELECT (contbillnoseq)+1 as billno FROM  sr_configuration_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (ordertype == 'S') {
              var Bill = 'SELECT (selfbillnoseq)+1 as billno FROM  sr_configuration_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (ordertype == 'D' && roomservice == 'N') {
              var Bill = 'SELECT (delvbillnoseq)+1 as billno FROM  sr_configuration_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (ordertype == 'D' && roomservice == 'Y') {
              var Bill = 'SELECT (roomservbillnoseq)+1 as billno FROM  sr_configuration_tbl WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
            }
          }
          else if (billnoreset == 'H') {
            if (ordertype == 'E') {
              var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="E"  AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '" AND  ordfloorid=' + floorid;
            }
            else if (ordertype == 'P') {
              var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="P"  AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (ordertype == 'S') {
              var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="S"  AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (ordertype == 'D' && roomservice == 'N') {
              var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="D" AND roomservice="N"  AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (ordertype == 'D' && roomservice == 'Y') {
              var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="D" AND roomservice="Y"  AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '"';
            }
          }
          else if (billnoreset == 'A') {
            var Bill = 'SELECT (adminbillnoseq)+1 as billno FROM sr_admins_tbl WHERE userid=' + this.userid + ' AND restid=' + restid + ' AND branchid="' + branchid + '"';
          }
          else if (billnoreset == 'M') {
            //Dayend
            var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE billdate = date("' + dayenddate + '","+1 day") AND  userid=' + this.userid;
          }
          else if (billnoreset == 'S') {
            var sessiondetail = 'SELECT COUNT(*),IFNULL(sessionid,1) FROM sr_session_mstr a WHERE TIME("now","localtime") BETWEEN starttime AND endtime AND a.restid=' + restid + ' AND a.branchid= "' + branchid + '"';
            this.sqlservice.sessionid(sessiondetail).then((res) => {
              console.log(res);
              var sessionid = res;
              if (ordertype == 'E') {
                var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="E" AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '" AND  sesid=' + sessionid;
              }
              else if (ordertype == 'P') {
                var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="P" AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '" AND  sesid=' + sessionid;
              }
              else if (ordertype == 'S') {
                var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="S" AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '" AND  sesid=' + sessionid;
              }
              else if (ordertype == 'D' && roomservice == 'N') {
                var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="D" AND roomservice="N"  AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '" AND  sesid=' + sessionid;
              }
              else if (ordertype == 'D' && roomservice == 'Y') {
                var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE ordertype="D" AND roomservice="Y"  AND billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '" AND  sesid=' + sessionid;
              }

            });
          }
          else if (billnoreset == 'F') {
            if (acfloor == 'Y') {
              var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl a WHERE billdate ="' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '" AND ordfloorid=' + floorid;
            }
            else {
              var Bill = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) as billno FROM sr_orders_tbl a,sr_session_mstr b WHERE billdate = "' + billdate + '" AND restid=' + restid + ' AND branchid="' + branchid + '  AND ordfloorid=' + floorid + ' AND sesid' + sesid + ' AND TIME(a.createdate) BETWEEN b.starttime AND b.endtime'
            }
          }
          else {
            if (ordertype == 'E') {
              var Bill = 'SELECT (ContBillNoSeq)+1 as billno FROM  sr_configuration_tbl WHERE restid =' + restid + ' AND branchid="' + branchid + '"';
              //UPDATE sr_configuration_tbl SET ContBillNoSeq=@Bill WHERE restid =@rid AND branchid =@bid';
            }
            else {
              var Bill = 'SELECT (DelvBillNoSeq)+1 as billno FROM  sr_configuration_tbl WHERE restid =' + restid + ' AND branchid="' + branchid + '"';
            }
          }
          console.log(Bill);
          this.sqlservice.billno(Bill).then((res) => {
            var newbillno = res;
            console.log(res);
            if (billnoreset == 'C') {
              if (billno == null || billno == '' || billno == 0 || billno == undefined) {
                var updatebillno = 'UPDATE sr_configuration_tbl SET ContBillNoSeq=' + res + ' WHERE  restid=' + restid + ' AND branchid="' + branchid + '"';
              }
            }
            else if (billnoreset == 'O') {
              if (ordertype == 'E') {
                var updatebillno = 'UPDATE sr_tablefloor_mstr SET BillNoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '" LIMIT 1';
              }
              else if (ordertype == 'P') {
                var updatebillno = 'UPDATE sr_configuration_tbl SET ContBillNoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '" LIMIT 1';
              }
              else if (ordertype == 'S') {
                var updatebillno = 'UPDATE sr_configuration_tbl SET SelfBillNoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '" LIMIT 1';
              }
              else if (ordertype == 'D' && roomservice == 'N') {
                var updatebillno = 'UPDATE sr_configuration_tbl SET DelvBillNoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '" LIMIT 1';
              }
              else if (ordertype == 'D' && roomservice == 'Y') {
                var updatebillno = 'UPDATE sr_configuration_tbl SET RoomServBillnoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '" LIMIT 1';
              }
            }
            else if (billnoreset == 'B') {
              if (ordertype == 'E') {
                var updatebillno = 'UPDATE sr_tablefloor_mstr SET BillNoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '" AND id=' + floorid;
              }
              else if (ordertype == 'P') {
                var updatebillno = 'UPDATE sr_configuration_tbl SET ContBillNoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '"';
              }
              else if (ordertype == 'S') {
                var updatebillno = 'UPDATE sr_configuration_tbl SET SelfBillNoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '"';
              }
              else if (ordertype == 'D' && roomservice == 'N') {
                var updatebillno = 'UPDATE sr_configuration_tbl SET DelvBillNoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '"';
              }
              else if (ordertype == 'D' && roomservice == 'Y') {
                var updatebillno = 'UPDATE sr_configuration_tbl SET RoomServBillnoSeq=' + res + ' WHERE restid =' + restid + ' AND branchid="' + branchid + '"';
              }
            }
            else if (billnoreset == 'A') {
              var updatebillno = 'UPDATE sr_admins_tbl SET AdminBillnoSeq=' + res + ' WHERE userid=' + this.userid + ' AND restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            else if (billnoreset == 'N') {
              if (ordertype == 'E') {
                var updatebillno = 'UPDATE sr_configuration_tbl SET ContBillNoSeq=' + res + ' WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
              }
              else {
                var updatebillno = 'UPDATE sr_configuration_tbl SET DelvBillNoSeq=' + res + ' WHERE restid=' + restid + ' AND branchid="' + branchid + '"';
              }
            }
            else {
              var updatebillno = 'SELECT IFNULL (MAX(CASt(billno as INTEGER))+1,1) AS billno FROM sr_orders_tbl WHERE billdate = ' + billdate + ' AND restid=' + restid + ' AND branchid="' + branchid + '"';
            }
            console.log(updatebillno);
            let dateTime = new Date();
            this.currenttime = formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US', '+0530')

            this.sqlservice.updatebillno(updatebillno).then((res) => {
              console.log(res);
              var billnoorder = `UPDATE sr_orders_tbl SET BillNo='${newbillno}',BilledTime='${this.currenttime}',
              discprice = ${this.orderdetails[0].discprice}  
              WHERE OrderID='${orderid}' AND IFNULL(BillNo,"")=""`;
              this.sqlservice.updateorder(billnoorder).then((res) => {
                console.log(res);
                var billroundoff = localStorage.getItem('billroundoff');
                var roundto = localStorage.getItem('roundto');
                //  this.ionViewDidEnter();
                if (this.Platform.is('cordova')) {
                  if (this.width > 500) {
                    if (this.mainbillstatus == 'USB') {
                      this.printerservice.getMainBill(this.restid, this.branchid, this.order_id, '', 'N', this.remarks, this.mainip, this.mainbillstatus);
                    }
                    else if (this.mainbillstatus == 'Network') {
                      this.printerservice.getMainBill(this.restid, this.branchid, this.order_id, '', 'N', this.remarks, this.mainip, this.mainbillstatus);
                    } else if (this.mainbillstatus == 'Bluetooth') {
                      this.cartService.mainbill(orderid, this.restid, this.branchid, '', billroundoff, roundto);
                    }
                    localStorage.setItem('orderid', '');
                    localStorage.setItem('order_id', '');
                    this.cartService.removeAllCartItems();
                    if (this.isAuttosettlement == 'Y' && (ordertype == 'E' || ordertype == 'P'||ordertype == 'S')) {
                      this.autosettle(this.orderdetails, orderid, this.restid, this.branchid);
                      localStorage.setItem('tableid', '0');
                      this.cartService.removeAllCartItems();
                      this.tablevalue = undefined;
                      if (ordertype == 'E') {
                        if (this.tableComponent !== undefined) {
                          this.tableComponent.clear();
                        }
                      }
                      this.noofpax = 1;
                      this.waiterid = 0;
                      this.captainid = 0;
                      this.discby = "P";
                      this.discperc = "0";
                      this.discamnt = "0";
                      this.cartItems = 0;
                      this.ngOnInit();
                      this.ionViewDidEnter();
                      this.cartdetails = [];
                      this.orderdetails = [];
                      this.itemdetails = [];
                    } else {
                      if (ordertype === 'P') {
                        let navigationExtras: NavigationExtras = {
                          queryParams: {
                            orderid: this.order_id
                          }
                        };
                        this.router.navigate(['settlement'], navigationExtras);
                      } else {
                        this.router.navigate(['newdashboard']);
                      }
                    }

                  }
                } else {
                  if (ordertype == 'S') {
                    this.router.navigate(['newdashboard'])
                  } else {
                    let navigationExtras: NavigationExtras = {
                      queryParams: {
                        orderid: this.order_id,
                        restid: this.restid,
                        branchid: this.branchid,
                        ordertype: this.order_type,
                        orderdetails: JSON.stringify(this.orderdetails)
                      }
                    };
                    localStorage.removeItem('custname');
                    localStorage.removeItem('custaddr');
                    localStorage.removeItem('cusnumber');
                    localStorage.setItem('onlinerfid', '0');
                    this.router.navigate(['mainbill'], navigationExtras);
                  }
                }
              });
            });
          });
        });
      });
    });
  }
  //This will print
  printStuff(data) {
    var myText = "Hello hello hello \n\n\n This is a test \n\n\n";
    this.sendToBluetoothPrinter(this.selectedPrinter, data);

  }

  sendToBluetoothPrinter(macAddress, data_string) {
    let subscription = this.btSerial.connect(macAddress).subscribe(data => {
      if (data) {
        this.btSerial.write(data_string).then(_ => {
         
          this.disconnectBluetoothPrinter()
        }, (data) => {
          console.log("Catch error ")
        });
      } else {
        Promise.resolve(false);
      }
    });

  }

  searchBluetoothPrinter() {
    this.list = this.btSerial.list();
    return this.btSerial.list();
  }

  connectToBluetoothPrinter(macAddress) {
    return this.btSerial.connect(macAddress);
  }

  disconnectBluetoothPrinter() {
    return this.btSerial.disconnect();
  }

  //pencil in popup
  pencil(item) {
    console.log(item);
    this.itemwisedata = item;
    this.itemwisedet = 1;
    this.itemwisedisc = localStorage.getItem('itemwisedisc');
    this.itemcomp = localStorage.getItem('allowitemwisecomplementry');
    var knotes = "SELECT id,descr FROM sr_kitchennotes_tbl WHERE restid=" + this.restid + " AND branchid='" + this.branchid + "' ORDER BY displayorder ASC";
    this.sqlservice.knotes(knotes).then((res) => {
      this.kitchennotes = res;
      console.log(this.kitchennotes);

    });
  }
  pencil1(item) {
    console.log(item)
    var itemwisedisc = localStorage.getItem('itemwisedisc');
    var itemcomp = localStorage.getItem('allowitemwisecomplementry');

    var knotes = "SELECT id,descr FROM sr_kitchennotes_tbl WHERE restid=" + this.restid + " AND branchid='" + this.branchid + "' ORDER BY displayorder ASC";
    this.sqlservice.knotes(knotes).then((res) => {
      var kitnotes = JSON.parse(JSON.stringify(res));
      var html = '<select id="Knotes">';
      if (item.knotes == undefined)
        html += '<option value="0">Select Knotes</option>';
      else
        html += '<option value="0">' + item.knotes + '</option>'
      for (var i = 0; i < kitnotes.length; i++) {
        if (item.knotes != kitnotes[i].descr)
          html += '<option value="' + kitnotes[i].id + '">' + kitnotes[i].descr + '</option>';
      }
      html += '</select>';
      // var html1='<ion-item  lines="none" style="margin-left:-17px"><ion-label>Complimentary</ion-label><ion-toggle [(ngModel)]="complimentary" disabled="true"></ion-toggle></ion-item>';
      //  html1 +='<ion-item   lines="none" style="margin-left:-17px"><ion-label>Take Away</ion-label><ion-toggle [(ngModel)]="takeaway" disabled="true"></ion-toggle></ion-item>';
      var html1 = '';
      var n = true;
      if (itemcomp == 'Y') {
        html1 += `<ion-row>
                  <ion-col class="ion-margin-top">Complimentary</ion-col>
                  <ion-col class="ion-margin-top" style="text-align: center;"><ion-checkbox  [(ngModel)]="n" name="complimentary" color="secondary" id="complimentary"></ion-checkbox></ion-col>
                  </ion-row>`;
      }
      if (this.cust == 'E')
        html1 += '<ion-row> <ion-col class="ion-margin-top">Take Away</ion-col><ion-col class="ion-margin-top"><ion-checkbox  name="takeaway" color="secondary" id="takeaway" value="off"></ion-checkbox ></ion-row>';
      //     html1 +='<ion-row> <ion-col class="ion-margin-top">Remarks:</ion-col><ion-col> <ion-input name="remarks" style="color: black"; data-placeholder="Search" id="remarks" value="'+item.remarks+'"> </ion-input></ion-col></ion-row>';
      // if(itemwisedisc=='Y')
      // {
      //   html1 +=`<ion-row><ion-col class="ion-margin-top">Item Wise Discount</ion-col></ion-row><ion-input name="discountamt" type="tel" id="idiscprice" minlength="1" maxlength="3" value="`+item.idiscprice+`">Item Wise Discount : </ion-input>
      //   <ion-input name="discountper" id="idiscperc" value="`+item.idiscperc+`">Item Wise Discount % :</ion-input>`;
      // }

      this.presentfilter('Knotes', html, html1, item);
    });

  }

  pencil2(item) {
    console.log(item)
    var itemwisedisc = localStorage.getItem('itemwisedisc');
    var itemcomp = localStorage.getItem('allowitemwisecomplementry');

    var knotes = "SELECT id,descr FROM sr_kitchennotes_tbl WHERE restid=" + this.restid + " AND branchid='" + this.branchid + "' ORDER BY displayorder ASC";
    this.sqlservice.knotes(knotes).then((res) => {
      var kitnotes = JSON.parse(JSON.stringify(res));
      var html = '<select id="Knotes">';
      if (item.knotes == undefined)
        html += '<option value="0">Select Knotes</option>';
      else
        html += '<option value="0">' + item.knotes + '</option>'
      for (var i = 0; i < kitnotes.length; i++) {
        if (item.knotes != kitnotes[i].descr)
          html += '<option value="' + kitnotes[i].id + '">' + kitnotes[i].descr + '</option>';
      }
      html += '</select>';
      // var html1='<ion-item  lines="none" style="margin-left:-17px"><ion-label>Complimentary</ion-label><ion-toggle [(ngModel)]="complimentary" disabled="true"></ion-toggle></ion-item>';
      //  html1 +='<ion-item   lines="none" style="margin-left:-17px"><ion-label>Take Away</ion-label><ion-toggle [(ngModel)]="takeaway" disabled="true"></ion-toggle></ion-item>';
      var html1 = '';
      var n = true;
      if (itemcomp == 'Y') {
        html1 += `<ion-row>
                  <ion-col class="ion-margin-top">Complimentary</ion-col>
                  <ion-col><ion-checkbox  [(ngModel)]="n" name="complimentary" color="secondary" id="complimentary"></ion-checkbox>
                  </ion-row>`;
      }
      if (this.cust == 'E')
        html1 += '<ion-row> <ion-col class="ion-margin-top">Take Away</ion-col><ion-col><ion-toggle name="takeaway" color="secondary" id="takeaway" value="off"  ></ion-toggle></ion-row>';
      html1 += '<ion-input name="remarks" style="color: black"; data-placeholder="Search" id="remarks" value="' + item.remarks + '">Remarks: </ion-input>';
      if (itemwisedisc == 'Y') {
        html1 += `<ion-input name="discountamt" type="tel" id="idiscprice" minlength="1" maxlength="3" value="` + item.idiscprice + `">Item Wise Discount : </ion-input>
        <ion-input name="discountper" id="idiscperc" value="`+ item.idiscperc + `">Item Wise Discount % :</ion-input>`;
      }
      var ordertype = localStorage.getItem('ordertype');
      var tax = 0;
      tax = this._taxAmount(ordertype, tax, this.search_menu[0]);
      item.tax_struct_id = tax;
      item = this._productDetails(item);
      this.presentfilter1('Knotes', html, html1, item);
    });

  }

  idiscpric() {
    console.log('item wise discount');
  }
  async presentfilter(title, msg, msg1, item) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      subHeader: title,
      message: msg + '<br>' + msg1,
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Done!',
          handler: (data: any) => {
            var itemwisedisc = localStorage.getItem('itemwisedisc');
            var itemcomp = localStorage.getItem('allowitemwisecomplementry');
            if (itemcomp == 'Y') {
              var complimentary = ((document.getElementById("complimentary")) as HTMLSelectElement).getAttribute('aria-checked');
            }
            if (this.order_type == 'E') {
              var takeaway = ((document.getElementById("takeaway")) as HTMLSelectElement).getAttribute('aria-checked');
            }
            var remarks = ((document.getElementById("remarks")) as HTMLSelectElement).value;
            var Knotes = ((document.getElementById("Knotes")) as HTMLSelectElement).value;
            if (itemwisedisc == 'Y') {
              var idiscprice = ((document.getElementById("idiscprice")) as HTMLSelectElement).value;
              var idiscperc = ((document.getElementById("idiscperc")) as HTMLSelectElement).value;
            }
            if (Knotes == 'Select Knotes') {
              Knotes = '';
            }
            item.knotes = Knotes ? Knotes : '';

            item.remarks = remarks ? remarks : '';
            item.complimentary = (complimentary == 'true') ? 'Y' : 'N';
            item.takeaway = (takeaway == 'true') ? 'Y' : 'N';
            item.idiscprice = idiscprice ? idiscprice : '0.00';
            item.idiscperc = idiscperc ? idiscperc : '0.00';
            // item.qty = this.data.qty;
            if (parseInt(item.idiscprice) > 0 && parseInt(item.idiscperc) > 0) {
              this.openToast('Kindly Give Discount in Percentage Or Rupees');
              return false;
            }
            else if (parseInt(item.idiscprice) > 0 || parseInt(item.idiscperc) > 0)
              item.itewisediscount = "Y";
            else {
              var RE = /^\d*(\.\d{1})?\d{0,1}$/;
              if (!RE.test(item.idiscprice) || !RE.test(item.idiscperc)) {
                this.openToast('Enter Numeric...');
                item.idiscprice = '0.00';
                item.idiscperc = '0.00';
                return false;
              }

              item.itewisediscount = "N";
            }



            if (item.itewisediscount == 'Y') {
              //var items=this.itemdisccal(item);
              var discprice = item.idiscprice;
              var discperc = item.idiscperc;
              var qty = item.qty;
              if (parseFloat(qty) == 0) {
                qty = this.data.qty;
              }
              item.totalprice = parseFloat(item.price) * parseFloat(qty);
              var newprice = item.totalprice;
              var price = 0;
              if (discprice != "" && discprice != undefined) {
                if (parseFloat(discprice) > 0 && parseFloat(newprice) > 0) {
                  item.idiscperc = (parseFloat(discprice) / parseFloat(newprice) * 100).toFixed(2);
                  price = parseFloat(discprice);
                }
              }
              if (discprice == "" || discperc == "" || parseInt(newprice) == 0) {
                item.idiscprice = '0.00';
                item.idiscperc = '0.00';
              }
              if (discperc != "" && discperc != undefined) {
                if (parseFloat(discperc) > 0 && parseFloat(newprice) > 0) {
                  item.idiscprice = ((parseFloat(newprice) * parseFloat(discperc)) / 100).toFixed(2);
                  price = item.idiscprice;
                }
              }
              if (newprice != undefined && newprice != "") {
                item.totalprice = newprice - price;
                item.totalprice = parseFloat(item.totalprice).toFixed(2);
              }
              if (discperc > parseFloat(this.maxdiscount) || item.idiscperc > parseFloat(this.maxdiscount)) {
                this.openToast("Discount Price Greater than Max Allowed Discount");
                item.idiscprice = '0.00';
                item.idiscperc = '0.00';
                return false;
              }
              var items = item;
            }

            else
              var items = item;
            console.log(items);
            if (items.complimentary == 'Y' && parseInt(items.idiscperc) > 0) {
              this.openToast("Kindly Give Either Complimentary or Discount");
              return false;
            }
            if (items.takeaway === 'Y') {
              var qty = item.qty;
              if (parseFloat(qty) == 0) {
                qty = this.data.qty;
              }
              items.price = items.parcelprice;
              items.totalPrice = items.parcelprice;
              this.cartdetails.find(item => item.id == items.id).price = items.parcelprice;
              this.cartdetails.find(item => item.id == items.id).totalPrice = items.parcelprice;
            }
            this.addcart.push(items);
            for (var i = 0; i < this.menus.length; i++) {
              if (this.menus[i].id == items.id) {
                this.menus[i].remarks = items.remarks;
                this.menus[i].complimentary = items.complimentary;
                this.menus[i].takeaway = items.takeaway;
                this.menus[i].idiscprice = items.idiscprice;
                this.menus[i].idiscperc = items.idiscperc;
              }
            }
            this.taxcalculation(this.cartdetails);
            var cartProduct = this._productDetails(items);
            this.cartService.addToCart(cartProduct).then((val) => {
              console.log(val);
              this.cartTotal();
            });
          }
        }
      ]
    }).then(res => {
      console.log(res);
      res.present();
    });

    // await alert.present();
  }
  async presentfilter1(title, msg, msg1, item) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      subHeader: title,
      message: msg + '<br>' + msg1,

      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Done!',
          handler: (data: any) => {
            var itemwisedisc = localStorage.getItem('itemwisedisc');
            var itemcomp = localStorage.getItem('allowitemwisecomplementry');
            if (itemcomp == 'Y') {
              var complimentary = ((document.getElementById("complimentary")) as HTMLSelectElement).getAttribute('aria-checked');
            }
            if (this.order_type == 'E') {
              var takeaway = ((document.getElementById("takeaway")) as HTMLSelectElement).getAttribute('aria-checked');
            }
            var remarks = ((document.getElementById("remarks")) as HTMLSelectElement).value;
            var Knotes = ((document.getElementById("Knotes")) as HTMLSelectElement).value;
            if (itemwisedisc == 'Y') {
              var idiscprice = ((document.getElementById("idiscprice")) as HTMLSelectElement).value;
              var idiscperc = ((document.getElementById("idiscperc")) as HTMLSelectElement).value;
            }
            if (Knotes == 'Select Knotes') {
              Knotes = '';
            }
            item.knotes = Knotes ? Knotes : '';

            item.remarks = remarks ? remarks : '';
            item.complimentary = (complimentary == 'true') ? 'Y' : 'N';
            item.takeaway = (takeaway == 'true') ? 'Y' : 'N';
            item.idiscprice = idiscprice ? idiscprice : '0.00';
            item.idiscperc = idiscperc ? idiscperc : '0.00';
            item.qty = this.data.qty;
            if (parseInt(item.idiscprice) > 0 && parseInt(item.idiscperc) > 0) {
              this.openToast('Kindly Give Discount in Percentage Or Rupees');
              return false;
            }
            else if (parseInt(item.idiscprice) > 0 || parseInt(item.idiscperc) > 0)
              item.itewisediscount = "Y";
            else {
              var RE = /^\d*(\.\d{1})?\d{0,1}$/;
              if (!RE.test(item.idiscprice) || !RE.test(item.idiscperc)) {
                this.openToast('Enter Numeric...');
                item.idiscprice = '0.00';
                item.idiscperc = '0.00';
                return false;
              }

              item.itewisediscount = "N";
            }



            if (item.itewisediscount == 'Y') {
              //var items=this.itemdisccal(item);
              var discprice = item.idiscprice;
              var discperc = item.idiscperc;
              var qty = item.qty;
              item.totalprice = parseFloat(item.price) * parseFloat(qty);
              var newprice = item.totalprice;
              var price = 0;
              if (discprice != "" && discprice != undefined) {
                if (parseFloat(discprice) > 0 && parseFloat(newprice) > 0) {
                  item.idiscperc = (parseFloat(discprice) / parseFloat(newprice) * 100).toFixed(2);
                  price = parseFloat(discprice);
                }
              }
              if (discprice == "" || discperc == "" || parseInt(newprice) == 0) {
                item.idiscprice = '0.00';
                item.idiscperc = '0.00';
              }
              if (discperc != "" && discperc != undefined) {
                if (parseFloat(discperc) > 0 && parseFloat(newprice) > 0) {
                  item.idiscprice = ((parseFloat(newprice) * parseFloat(discperc)) / 100).toFixed(2);
                  price = item.idiscprice;
                }
              }
              if (newprice != undefined && newprice != "") {
                item.totalprice = newprice - price;
                item.totalprice = parseFloat(item.totalprice).toFixed(2);
              }
              if (discperc > parseFloat(this.maxdiscount) || item.idiscperc > parseFloat(this.maxdiscount)) {
                this.openToast("Discount Price Greater than Max Allowed Discount");
                item.idiscprice = '0.00';
                item.idiscperc = '0.00';
                return false;
              }
              var items = item;
            }

            else
              var items = item;
            console.log(items);
            if (items.complimentary == 'Y' && parseInt(items.idiscperc) > 0) {
              this.openToast("Kindly Give Either Complimentary or Discount");
              return false;
            }
            if (items.takeaway === 'Y') {
              items.price = items.parcelprice;
              items.totalPrice = items.parcelprice;
              // this.cartdetails.find(item => item.id == items.id).price = items.parcelprice;
              // this.cartdetails.find(item => item.id == items.id).totalPrice = items.parcelprice;
            }
            this.addcart.push(items);
            for (var i = 0; i < this.menus.length; i++) {
              if (this.menus[i].id == items.id) {
                this.menus[i].remarks = items.remarks;
                this.menus[i].complimentary = items.complimentary;
                this.menus[i].takeaway = items.takeaway;
                this.menus[i].idiscprice = items.idiscprice;
                this.menus[i].idiscperc = items.idiscperc;
              }
            }
            this.clear();
            this.taxcalculation(this.cartdetails);
            var cartProduct = this._productDetails(items);
            this.cartService.addToCart(cartProduct).then((val) => {
              console.log(val);
              this.cartTotal();
            });
          }
        }
      ]
    }).then(res => {
      console.log(res);
      res.present();
    });

    // await alert.present();
  }

  //Itemwise Discount
  itemdisccal(item) {
    var discprice = item.idiscprice;
    var discperc = item.idiscperc;
    var qty = item.count;
    item.totalprice = parseFloat(item.singlePrice) * parseFloat(qty);
    var newprice = item.totalprice;
    var price = 0;
    if (discprice != "" && discprice != undefined) {
      if (parseFloat(discprice) > 0 && parseFloat(newprice) > 0) {
        item.idiscperc = (parseFloat(discprice) / parseFloat(newprice) * 100).toFixed(2);
        price = parseFloat(discprice);
      }
    }
    if (discprice == "" || discperc == "" || parseInt(newprice) == 0) {
      item.idiscprice = '0.00';
      item.idiscperc = '0.00';
    }
    if (discperc != "" && discperc != undefined) {
      if (parseFloat(discperc) > 0 && parseFloat(newprice) > 0) {
        item.idiscprice = ((parseFloat(newprice) * parseFloat(discperc)) / 100).toFixed(2);
        price = item.idiscprice;
      }
    }
    if (newprice != undefined && newprice != "") {
      item.totalprice = newprice - price;
      item.totalprice = parseFloat(item.totalprice).toFixed(2);
    }
    if (discperc > parseFloat(this.maxdiscount) || item.idiscperc > parseFloat(this.maxdiscount)) {
      this.openToast("Discount Price Greater than Max Allowed Discount");
      item.idiscprice = '0.00';
      item.idiscperc = '0.00';
      return false;
    }

    return item;

  }

  //check for delete an item
  deleteitem(details) {
    this.checkitem = [];
    for (var i = 0; i < details.length; i++) {
      if (details[i].checked == true) {
        if (!this.checkitem.includes(details[i])) {
          this.checkitem.push(details[i]);
        }
      }
    }
    if (this.checkitem.length > 0) {
      for (let j = 0; j < details.length; j++) {
        for (let i = 0; i < this.checkitem.length; i++) {
          if (this.checkitem[i].ordersummaryid === details[j].modparent) {
            details[j].checked = true;
            if (!this.checkitem.includes(this.checkitem[i])) {
              this.checkitem.push(details[j]);
            }
          }
        }
      }
    }
    this.taxcalculation(this.cartdetails);
  }

  custdetails() {
    this.router.navigate(['customerd']);

  }

  //Delete an item Cancel KOT
  delete() {
    var orderid = localStorage.getItem("order_id");
    var cancelkot = localStorage.getItem('cancelkot');
    var custkotauth = localStorage.getItem('custkotauth');
    var delotpauth = localStorage.getItem('delotpauth');
    let username = localStorage.getItem('Name');
    let UserID = localStorage.getItem('UserID');
    if (cancelkot == 'N' && custkotauth == 'N' && delotpauth == 'N') {
      this.openToast("You do not have permission to delete this Item...!");
    }
    else {
      if (delotpauth == 'Y') {
        let data = ({ restid: this.restid, branchid: this.branchid, orderid: orderid, status: 'D' });
        this.apiService.getOTPForReprint(data).subscribe(
          (result: any) => {
            if (result.statusCode === 201) {
              this.otpForConcelKot = result.data.otp;
            } else {
              this.otpForConcelKot = null;
            }
          },
          (error) => {
            console.error(error);
          })
        this.adminotp('Delete Verification', orderid, UserID, username);
      }
      else if (custkotauth == 'Y') {
        this.sqlservice.approveadmin(this.restid, this.branchid).then((val) => {
          console.log(val);
          var adminlist = JSON.parse(JSON.stringify(val));
          var html = '<select id="admin" >';
          for (var i = 0; i < adminlist.length; i++) {
            html += '<option value=' + adminlist[i].userid + ' selected>' + adminlist[i].name + '</option>';
          }
          html += '</select>';
          this.adminverification('Delete Verification', html, adminlist);
        });


      }
      else if (cancelkot == 'Y') {
        this.deleteanitem(UserID, username);
      }
    }
  }

  //Admin verification
  async adminverification(title, msg, adminlist) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: msg,
      inputs: [
        {
          name: 'password',
          value: '',
          type: 'password',
          placeholder: 'Enter the password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {

            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            console.log(data.password);
            var e = (document.getElementById("admin")) as HTMLSelectElement;
            var sel = e.selectedIndex;
            var opt = e.options[sel];
            var CurValue = (opt).value;

            var admin = 0;
            var pass = '';
            for (var i = 0; i < adminlist.length; i++) {
              if (CurValue == adminlist[i].name) {
                admin = adminlist[i].userid;
                pass = adminlist[i].password;
              }
            }
            console.log(admin);
            if (admin == 0) {
              this.openToast('Please Select Approver...!');
            }
            else if (data.password == null || data.password == undefined || data.password == "") {
              this.openToast('Please Enter Password...!');
            }
            else {
              if (data.password != '' && data.password == pass) {
                this.deleteanitem(admin, CurValue);
              }
              else {
                this.openToast('Please Enter Correct Password...!');
              }
            }

          }
        }
      ]
    });

    await alert.present();
  }

  async adminotp(title, orderid, UserID, username) {
    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'otp',
          placeholder: 'Enter OTP',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Validate',
          handler: data => {
            console.log(this.otpForConcelKot);
            if (this.otpForConcelKot === data.otp) {
              this.deleteanitem(UserID, username);
            } else {
              this.openToast('Please Enter Correct OTP...!');
            }
          }
        }
      ]
    })
    await alert.present();
  }

  //Delete an Items from Table
  deleteanitem(id, name) {
    var reason = "SELECT categoryid,descr FROM sr_categorymstr_tbl WHERE type=6 AND restid=" + this.restid + " AND branchid='" + this.branchid + "'";
    this.sqlservice.reasoncancelotp(reason).then((res) => {
      console.log(res);
      var reason = JSON.parse(JSON.stringify(res));
      var html = '<select id="reason" >';
      for (var i = 0; i < reason.length; i++) {
        html += '<option value=' + reason[i].id + ' selected>' + reason[i].descr + '</option>';
      }
      html += '</select>';
      this.getremarks('Delete', html, reason, id, name);

    });
  }


  //GET REASON & REMARKS FOR CANCEL KOT
  async getremarks(title, msg, reason, id, name) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: msg,
      inputs: [
        {
          name: 'remarks',
          value: '',
          type: 'text',
          placeholder: 'Enter Remarks'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {

            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async data => {
            console.log(data.remarks);
            this.loadOrderDetails();
            var e = (document.getElementById("reason")) as HTMLSelectElement;
            var sel = e.selectedIndex;
            var opt = e.options[sel];
            var CurValue = (opt).value;
            console.log(CurValue);
            var catid = 0;
            for (var i = 0; i < reason.length; i++) {
              if (CurValue == reason[i].descr) {
                catid = reason[i].id;

              }
            }
            var remarks = data.remarks + "," + CurValue;
            data.remarks = data.remarks.replace(/[^a-zA-Z0-9 ]/,'');
            let cancelKOTRemarks = data.remarks;
            var sql = "";
            if (this.oneuiinstance === "H") {
              let AdminType = localStorage.getItem('AdminType');
              let data = ({ restid: this.restid, branchid: this.branchid, username: this.username, userid: this.userid, itemDetails: this.checkitem, admintype: AdminType, reason: cancelKOTRemarks });
              this.apiService.deletkot(data).subscribe((value) => {
                let data = value;
                for (let i = 0; i < this.checkitem.length; i++) {
                  this.cartdetails.splice(this.cartdetails.findIndex(a => a.ordersummaryid === this.checkitem[i].ordersummaryid), 1);
                }
                this.cartdetails = [];
                this.cartService.removeAllCartItems();
                this.cartItems = 0;
                this.ionViewDidEnter();
              })
            } else {
              for (var i = 0; i < this.checkitem.length; i++) {
                this.checkitem[i].itemname = this.checkitem[i].name;
                this.checkitem[i].itemqty = this.checkitem[i].count;
                this.checkitem[i].modifier = [];
                sql = "INSERT INTO sr_deletehstry_tbl(orderid,ordersummaryid,itemprice,itemqty,remarks,createdby,deletedby,creatorname) ";
                sql += "VALUES(" + this.checkitem[i].orderid + ",'" + this.checkitem[i].product_id + "'," + this.checkitem[i].singlePrice + ",";
                sql += this.checkitem[i].count + ",'" + remarks + "'," + id + "," + id + ",'" + name + "')";

                this.sqlservice.deletehstry(sql).then(async (res) => {

                  var StockDedTyp = localStorage.getItem("stockdedtyp");
                  if (StockDedTyp != null && StockDedTyp == "B")
                    this.dostockreversion(this.checkitem[0].orderid, this.branchid, this.restid, this.checkitem);
                  await this.productionService._doProductionDeduction(this.branchid, this.restid, this.checkitem);
                });
                var deleteitem = "DELETE FROM sr_order_smry_tbl WHERE ordersummaryid=" + this.checkitem[i].ordersummaryid;
                this.sqlservice.deleteitem(deleteitem).then((res) => {
                  console.log(res);
                });
                var deletetax = "DELETE FROM sr_order_smry_tax_tbl WHERE ordersummaryid=" + this.checkitem[i].ordersummaryid;
                this.sqlservice.deleteitem(deletetax).then((res) => {
                  console.log(res);
                  this.todaysorder();
                });
                this.cartdetails.splice(this.cartdetails.findIndex(a => a.ordersummaryid === this.checkitem[i].ordersummaryid), 1);
                let initialValue = 0;
                this.cart_items = this.cartdetails.length;
                this.cartItems = this.cartdetails.reduce((previousValue, currentValue) => previousValue + Number(currentValue.count), initialValue)
              }
              if (!this.Platform.is("cordova")) {
                if (this.kotBillStatus == 'Network') {
                  this.printerservice.sendKOTForTCP(this.checkitem[0].orderid, this.checkitem, this.orderdetails, this.floorname, this.kotIP, 'Y');
                } else if (this.kotBillStatus == 'USB') {
                  this.printerservice.getKOTPrint(this.checkitem[0].orderid, this.checkitem, this.orderdetails, this.floorname, 'Y');
                } else {
                  this.cancelKOTForBluetooth(this.checkitem[0].orderid, this.checkitem);
                }
              }
              var updateorder = "UPDATE sr_orders_tbl SET orderprice=" + this.subtotal + ",totalprice=" + this.grandtotal + " WHERE orderid=" + this.checkitem[0].orderid;
              await this.sqlservice.updateorder(updateorder)
              this.ionViewDidEnter();
              var itemcnt = "select orderid from sr_order_smry_tbl WHERE orderid=" + this.checkitem[0].orderid;
              this.sqlservice.itemcnt(itemcnt).then((res1) => {
                console.log(res1);
                if (res1 == 0) {
                  var updateorder = "UPDATE sr_orders_tbl SET billtype='U',billedstatus='Y',settlement='Y',cancelremarks='All Items Cancelled',orderprice=" + this.subtotal + ",totalprice=" + this.grandtotal + " WHERE orderid=" + this.checkitem[0].orderid;
                  this.sqlservice.updateorder(updateorder).then((res) => {
                  this.neworder();
                  });
                }
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  //Menu Resize
  menuresize() {
    console.log(this.data.menuview);
    if (this.data.menuview == 1) {
      this.data.menuview = 2;
    }
    else {
      this.data.menuview = 1;
    }
  }

  //checkorder
  checkorder(orderid, ordertype, tableno, floorid) {
    var cartlist = 0;
    console.log(this.cartdetails);
    for (var i = 0; i < this.cartdetails.length; i++) {
      if (this.cartdetails[i].currentstatus == '' && this.cartdetails[i].count > 0) {
        cartlist++;

      }
    }
    if (cartlist > 0) {
      this.clearcart_order("Are you sure, want to clear cart?", orderid, ordertype, tableno);

    }
    else {
      localStorage.setItem('orderid', orderid);
      localStorage.setItem('order_id', orderid);
      localStorage.setItem('ordertype', ordertype);
      localStorage.setItem('tableid', tableno);
      localStorage.setItem('FloorId', floorid);
      this.cartdetails = [];
      this.cartService.removeAllCartItems();
      this.cartItems = 0;
      this.ionViewDidEnter();
    }
  }

  async clearcart_order(title, orderid, ordertype, tableno) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      subHeader: title,
      buttons: [
        {
          text: 'No',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Yes',
          handler: (data: any) => {
            localStorage.setItem('orderid', orderid);
            localStorage.setItem('order_id', orderid);
            localStorage.setItem('ordertype', ordertype);
            localStorage.setItem('tableid', tableno);
            this.cartdetails = [];
            this.cartService.removeAllCartItems();
            this.cartItems = 0;
            this.ionViewDidEnter();
          }
        }
      ]
    })

    await alert.present();
  }

  //All Menus
  allmenus() {
    this.modifier = [];
    this.variancemenu = [];
    this.comboitems = [];
    var sql = "SELECT a.MenuID,a.Name,a.price,IFNULL(a.parcelprice,'0.00') AS parcelprice,a.calories,a.combotype,";
    sql += "IFNULL(a.acprice,'0.00')AS acprice,a.itemparent,IFNULL(a.roomprice,'0.00') AS roomprice,";
    sql += "IFNULL(a.deliveryprice,'0.00') AS delivprice,a.AcDineInTax,a.NonAcDineInTax,a.TAwayTax,";
    sql += "a.DelivTax,a.RoomServTax,IFNULL(a.happyprice,'0.00') AS happyprice,IFNULL(a.happyacprice,'0.00') AS happyacprice,";
    sql += " IFNULL(a.IncludeDiscount,'Y') AS includediscount,IFNULL(a.OtherTaxID,0) AS othertaxid,";
    sql += "(a.FloorId) floorid,IFNULL(a.barcode,'') AS barcode,a.Itemallowdecimalqty,IFNULL(p.packingcharge,'0') AS packingcharge, ";
    sql += "IFNULL(p.packingchargetype,'F') packingchargetype,IFNULL(p.taxid,'0') AS packingtaxid,IFNULL(a.selfsprice,'0.00') AS selfsprice,a.selfstax  AS selfstax,a.ProdEnable";
    sql += " FROM sr_menumstr_tbl a";
    sql += " LEFT JOIN sr_menu_parcelcharge_tbl p ON p.parcelchargeid=a.PackagingChargeID AND a.restid=p.restid AND a.branchid=p.branchid";
    sql += " WHERE a.itemlevel='2'AND a.restid=" + this.restid + " AND a.branchid='" + this.branchid + "'";
    this.sqlservice.menusearch(sql).then(async (res) => {

      this.modifier = [];
      this.variancemenu = [];
      this.comboitems = [];
      for (var i = 0; i < res.length; i++) {
        //Modifier
        if (res[i].combotype == 'F') {
          res[i].productionItemCount = await this.productionService._productionItemCount(this.restid, this.branchid, res[i].id);
          res[i].productionMappingStatus = await this.productionService._checkMappedItem(this.restid, this.branchid, res[i].id);
          res[i].productionItemCount = await this.productionService._productionItemCount(this.restid, this.branchid, res[i].id);
          res[i].productionMappingStatus = await this.productionService._checkMappedItem(this.restid, this.branchid, res[i].id);
          this.modifier.push(res[i]);
        }
        else if (res[i].combotype == 'V') {
          var sql = "SELECT b.menuid AS menuparentid,a.MenuID,a.Name,a.price,IFNULL(a.parcelprice,'0.00') AS parcelprice,a.calories,a.combotype,";
          sql += "IFNULL(a.acprice,'0.00')AS acprice,a.itemparent,IFNULL(a.roomprice,'0.00') AS roomprice,";
          sql += "IFNULL(a.deliveryprice,'0.00') AS delivprice,a.AcDineInTax,a.NonAcDineInTax,a.TAwayTax,";
          sql += "a.DelivTax,a.RoomServTax,IFNULL(a.happyprice,'0.00') AS happyprice,IFNULL(a.happyacprice,'0.00') AS happyacprice,";
          sql += " IFNULL(a.IncludeDiscount,'Y') AS includediscount,IFNULL(a.OtherTaxID,0) AS othertaxid,";
          sql += "(a.FloorId) floorid,IFNULL(a.barcode,'') AS barcode,a.Itemallowdecimalqty,IFNULL(p.packingcharge,'0') AS packingcharge, ";
          sql += "IFNULL(p.packingchargetype,'F') packingchargetype,IFNULL(p.taxid,'0') AS packingtaxid,IFNULL(a.selfsprice,'0.00') AS selfsprice,a.selfstax  AS selfstax,a.ProdEnable";
          sql += " FROM sr_menumstr_tbl a,sr_menuvariant_mapping_tbl b";
          sql += " LEFT JOIN sr_menu_parcelcharge_tbl p ON p.parcelchargeid=a.PackagingChargeID AND a.restid=p.restid AND a.branchid=p.branchid";
          sql += " WHERE b.menuvariantid=a.menuid AND a.itemlevel='2'AND a.restid=" + this.restid + " AND a.branchid='" + this.branchid + "' AND b.menuid='" + res[i].id + "'";

          this.sqlservice.variancemenus(sql).then((data) => {
            this.variancemenu = [];
            if (data !== undefined) {
              for (var j = 0; j < data.length; j++) {
                this.variancemenu.push(data[j]);
              }
            }
          });
        }
        else if (res[i].combotype == 'M') {
          var sql = "SELECT b.menuid AS menuparentid,a.MenuID,a.Name,a.price,IFNULL(a.parcelprice,'0.00') AS parcelprice,a.calories,a.combotype,";
          sql += "IFNULL(a.acprice,'0.00')AS acprice,a.itemparent,IFNULL(a.roomprice,'0.00') AS roomprice,";
          sql += "IFNULL(a.deliveryprice,'0.00') AS delivprice,a.AcDineInTax,a.NonAcDineInTax,a.TAwayTax,";
          sql += "a.DelivTax,a.RoomServTax,IFNULL(a.happyprice,'0.00') AS happyprice,IFNULL(a.happyacprice,'0.00') AS happyacprice,";
          sql += " IFNULL(a.IncludeDiscount,'Y') AS includediscount,IFNULL(a.OtherTaxID,0) AS othertaxid,";
          sql += "(a.FloorId) floorid,IFNULL(a.barcode,'') AS barcode,a.Itemallowdecimalqty,IFNULL(p.packingcharge,'0') AS packingcharge, ";
          sql += "IFNULL(p.packingchargetype,'F') packingchargetype,IFNULL(p.taxid,'0') AS packingtaxid,IFNULL(a.selfsprice,'0.00') AS selfsprice,a.selfstax  AS selfstax";
          sql += " FROM sr_menumstr_tbl a,sr_comboitems_tbl b";
          sql += " LEFT JOIN sr_menu_parcelcharge_tbl p ON p.parcelchargeid=a.PackagingChargeID AND a.restid=p.restid AND a.branchid=p.branchid";
          sql += " WHERE b.catmenuid=a.menuid AND a.itemlevel='2'AND a.restid=" + this.restid + " AND a.branchid='" + this.branchid + "' AND b.menuid='" + res[i].id + "'";
          this.sqlservice.comboitems(sql).then((data) => {
            this.comboitems = [];
            for (var j = 0; j < data.length; j++) {
              this.comboitems.push(data[j]);
            }
          });
        }
      }
    });
  }

  //Modifer,Variance,addons & combo Popup
  addonspopup(menu) {
    if (this.modifier.length >= 1) {
      const key: string = 'id';
      this.modifier = this.productionService._removeDublicates(this.modifier, key);
      for (var i = 0; i < this.modifier.length; i++) {
        this.modifier[i].modparent = menu.id;
        this.modifier[i].qty = 1;
        this.modifier[i].checked = false;
      }
    }
    if (this.width > 500) {
      if (this.modparent.length > 0) {
        for (let i = 0; i < this.modparent.length; i++) {
          if (menu.id === this.modparent[i].modparent && this.modparent[i].currentstatus !== 'K') {
            this.modifier.filter(item => item.id === this.modparent[i].itemid).map(value => {
              value.checked = true;
              value.qty = this.modparent[i].itemqty;
            })
          }
        }
      }
      this.addons = 1;
    } else {
      this.presentModal(this.modifier, 'Modifier')
    }
  }

  add_on(event, menu) {
    if (event.detail.checked == true) {
      menu.checked = true;
      this.addon.push(menu);
    }
    else {
      menu.checked = false;
      let index = this.addon.findIndex(x => x.id == menu.id);
      this.addon.splice(index, 1);
    }

  }

  //clrqtymod
  clrqtymod(menu) {
    for (var i = 0; i < this.modifier.length; i++) {
      if (this.modifier[i].id == menu.id) {
        this.modifier[i].qty = '';
      }
    }
  }



  //Variance
  variance_on(event, product) {
    this.cartProduct = {};
    this.addon = [];
    this.cartProduct = product;
    this.addon.push(this.cartProduct);

  }

  //addvariance
  addvariance(product) {
    var cartProduct = {};
    for (var i = 0; i < this.variance.length; i++) {
      if (this.variance[i].menuid == product.menuid) {

        var ordertype = localStorage.getItem('ordertype');
        var tax = 0;
        if (ordertype == 'E') {
          tax = product.nonacdineintax;
        }
        else if (ordertype == 'P') {
          tax = product.tawaytax;
        }
        else if (ordertype == 'D') {
          tax = product.delivtax;
        }
        else if (ordertype == 'R') {
          tax = product.roomservtax;
        }
        else if (ordertype == 'S') {
          tax = product.selfstax;
        }
        var productPrice = product.qty * parseFloat(product.price);
        if (product.calories == '') {
          product.calories = 0;
        }
        var calories = product.qty * parseInt(product.calories);
        cartProduct = {
          product_id: product.menuid,
          name: product.name,
          count: product.qty,
          singlePrice: product.price,
          totalPrice: productPrice,
          tax_struct_id: tax,
          packingcharge: product.packingcharge,
          packingchargetype: product.packingchargetype,
          packingtaxid: product.packingtaxid,
          includediscount: product.includediscount,
          calories: calories,
          add: '',
          checked: false,
          currentstatus: "",
          modparent: "0",
          combomenu: []
        };

      }
    }
    this.cartService.getCartItems().then((val) => {
      if (val) {
        val.unshift(cartProduct);
        this.storage.set(CART_KEY, val);
      }
      else {
        this.storage.set(CART_KEY, [cartProduct]);
      }

    });
    this.cartService.getCartItems().then((val) => {

      console.log(val);
      this.addon = [];
      this.addons = 0;
      this.variancelist = val;
      this.cartTotal();

    });

  }

  //closepopup
  closepopup() {
    this.addon = [];
    this.addons = 0;
  }

  //Add Modifier Against item
  addmodifier() {
    console.log(this.addon);
    var ordertype = localStorage.getItem('ordertype');
    var tax = 0;

    this.cartService.getCartItems().then((val) => {
      if (val) {
        for (var i = 0; i < this.addon.length; i++) {
          var product = this.addon[i];
          tax = this._taxAmount(ordertype, tax, product);
          product.tax_struct_id = tax;
          product.add = '';
          if (product.calories == '') {
            product.calories = 0;
          }
          var cartProduct = this._productDetails(product);
          let index = val.findIndex(x => x.product_id == cartProduct.modparent);
          val.splice(index + 1, 0, cartProduct);
          console.log(val);
          this.storage.set(CART_KEY, val);
        }
        this.addon = [];
        this.addons = 0;
      }
    });
    this.cartService.getCartItems().then((val) => {
      if (val) {
        console.log(val);
        this.cartTotal();
      }
    });

  }

  settings() {
    this.router.navigate(['settings']);
  }
  home() {
    this.router.navigate(['newdashboard'])
  }

  //Count DineIn ordertype from floormaster
  countordertype() {
    var sql = "SELECT COUNT(order_type) as count FROM sr_tablefloor_mstr WHERE order_type='E' AND restid=" + this.restid + " AND branchid='" + this.branchid + "'";
    this.sqlservice.fetchdet(sql).then((data) => {
      console.log(data);
      this.countfloor_dinein = data[0].count;
    });
  }

  //Clear qty value while click qty textbox
  searchqty() {
    this.data.qty = '';
  }

  //Default Font color for onlinereference mastr
  onlinrefclr(name) {
    if (name != '' && name != undefined) {
      var refname = name.toUpperCase();
      if (refname == 'SWIGGY') {
        return 'swiggy';
      }
      else if (refname == 'ZOMATO') {
        return 'zomato';
      }
      else {
        return 'noref';
      }
    }
    else {
      return 'noref';
    }

  }

  //Query in driver balance table
  drivbal(orderid, restid, branchid) {
    let dateTime = new Date();
    var curdate = this.datePipe.transform(dateTime, 'yyyy-MM-dd');
    var sql = "SELECT * FROM sr_orders_tbl WHERE orderid=" + orderid + " AND restid=" + restid + " AND branchid='" + branchid + "'";
    this.sqlservice.fetchdet(sql).then((data) => {
      console.log(data);
      if (data[0].driverid != 0) {
        var updsetsql = "INSERT INTO sr_driverbal_tbl(restid,branchid,transactiondate,orderid,empcode,amount,remarks,cashreceived)";
        updsetsql += "VALUES (" + restid + ",'" + branchid + "','" + curdate + "'," + orderid + ",'" + data[0].driverid + "','" + data[0].totalprice + "','AutoSettled','Y')";
        console.log(updsetsql)
        this.sqlservice.updrivdet(updsetsql).then((res) => {
          console.log(res);
        });
      }
      //this.countfloor_dinein=data[0].count;
    });
  }


  //Toast
  async openToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 300,
      position: 'top'
    });
    toast.present();
  }
  //Key Press Event
  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 46 && !pattern.test(inputChar)) {
      event.preventDefault();
    }

  }

  presentModal(data, method) {
    console.log(data);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": JSON.stringify(data),
        "method": method
      }
    };
    this.router.navigate(['modal'], navigationExtras);


  }
  ordertoadlog(orderid) {
    var lastmileconfig = "SELECT lastmile FROM sr_configuration_tbl WHERE  restid=" + this.restid + " AND branchid='" + this.branchid + "'";
    this.sqlservice.lastconfig(lastmileconfig).then((lastmile) => {
      if (lastmile == "Y") {
        var sql = "SELECT statusrequest,driverid,custmob,totalprice,custaddr,custname,custlandmark,latitude,longitude,billdate,billremarks,time FROM sr_orders_tbl WHERE orderid=" + orderid + " AND restid=" + this.restid + " AND branchid='" + this.branchid + "'";
        this.sqlservice.adlogorderdet(sql).then((data) => {
          for (var i = 0; i < data.length; i++) {
            var statusrequest = data[i].statusrequest;
            var statusrequest = data[i].statusrequest;
            var driverid = data[i].driverid;
            var custmob = data[i].custmob;
            var totalprice = data[i].totalprice;
            var custaddr = data[i].custaddr;
            var custname = data[i].custname;
            var custlandmark = data[i].custlandmark;
            var latitude = data[i].latitude;
            var longitude = data[i].longitude;
            var billdate = data[i].billdate;
            var time = data[i].time;
            var billremarks = (data[i].billremarks == "") ? "NULL" : data[i].billremarks;
          }
          var sql1 = "select timing from sr_delivery_timing_tbl where restid=" + this.restid + " AND branchid='" + this.branchid + "' and id='" + time + "' ";
          this.sqlservice.dayendaut3(sql1).then((res) => {
            var delivtimer = res[0].timing;
            if (statusrequest == "W" || statusrequest == "M" || statusrequest == "C") {
              var jsondata = JSON.stringify({ "restid": this.restid, "branchid": this.branchid, "orderid": orderid, "driverid": driverid, "custmob": custmob, "totalprice": totalprice, "custaddr": custaddr, "custname": custname, "custlandmark": custlandmark, "latitude": latitude, "longitude": longitude, "billdate": billdate, "billremarks": billremarks, "delivtimer": delivtimer });
              this.apiService.adlogorder(jsondata).subscribe(res => {

              });
            }
          });
        });
      }
    });
  }
  set_deliverytime() {
    this.sqlservice.set_time(this.restid, this.branchid).then(res => {
      this.deliverytime = res ?? 1;
      if (res.length > 0) {
        this.delivery_time = this.deliverytime_arr[0];
      }
    })
  }
  deliverytime_list() {
    this.sqlservice.time_list(this.restid, this.branchid).then(res => {
      this.deliverytime_arr = res ?? [];
      for (var i = 0; i < this.deliverytime_arr.length; i++) {
        this.deliverytime = this.deliverytime_arr[i];
      }
    })
  }
  select_timing(event: {
    component: IonicSelectableComponent,
    value: any
  }) {

    this.deliverytime = event.value.id;

  }
  get_reward_data() {
    var sql = "SELECT rewardpoint,minrewardpoint,rewardval,maxdiscount FROM sr_branches_tbl WHERE restid = " + this.restid + " AND branchid = '" + this.branchid + "'";
    this.sqlservice.get_reward_data(sql).then(data => {
      this.rewardpoint = data[0].rewardpoint
    })

  }
  redeem_points(phoneno, totalprice, rewardpoint) {
    let redeempoint: number = 0;
    var sql = "SELECT redeempoints FROM sr_custmaster_tbl WHERE restid =" + this.restid + " AND branchid = '" + this.branchid + "' AND custmobile = '" + phoneno + "'";
    this.sqlservice.get_redeem(sql).then(data => {
      redeempoint = data;
      redeempoint = redeempoint + (totalprice / rewardpoint);
      let update_sql = 'UPDATE sr_custmaster_tbl SET redeempoints=' + redeempoint + ' WHERE restid =' + this.restid + ' AND branchid="' + this.branchid + '" AND custmobile = "' + phoneno + '"';
      this.sqlservice.updateorder(update_sql).then((res) => {
        let data = res;
      })
    });
  }
  roomlst() {
    var roomlistsql = "SELECT DISTINCT id AS id,descr AS name FROM sr_room_mstr WHERE id IS NOT NULL";
    this.sqlservice.dayendaut3(roomlistsql).then((res) => {
      if (res !== undefined && res.length > 0) {
        this.rooms = res;
        this.roomvalues = this.rooms[0];
        this.roomid = res[0].id;
      }
    });
  }
  select_room(event: {
    component: IonicSelectableComponent,
    value: any
  }) {

    this.roomid = event.value.id;

  }
  hotelckn() {
    var hotelsql = "SELECT HtlDesk,HtlIP,foodenginestoreid FROM sr_configuration_tbl where restid=" + this.restid + " and branchid='" + this.branchid + "'";
    this.sqlservice.dayendaut3(hotelsql).then((res) => {
      this.HtlDesk = res[0].HtlDesk;
      this.HtlIP = res[0].HtlIP;
      this.foodenginestoreid = res[0].foodenginestoreid;

    });
  }
  checkroomno() {
    this.apiService.chkroomno(this.HtlIP, this.roomid, this.foodenginestoreid).subscribe(res => {
      this.openToast(res.msg);
      if (res.status == "YES") {
        if (res.resno == null || res.resno == "") {
          this.openToast("Hotel Booking Id was not identified,so you couldn't proceed to place roomservice order");
          return false;
        }
        this.htlbookid = res.resno
        this.htlbookname = res.name
        this.htlbookmobile = res.mobile
      }
      else {
        this.roomid = "";
      }
    });
  }
  Hsaveorder(ststype) {
    this.present();
    let saveitem: string;
    let savetype: string;
    let ordertype: string = localStorage.getItem('ordertype');
    let { orderid, tableid, admintype, username, restaurentname }: { ordertype: string; orderid: number; tableid: string | number; admintype: string; username: string; restaurentname: string } = this.local_data();
    let { roomservice, roomno, htldesk, htlbookid }: { roomservice: string; roomno: number; htldesk: string, htlbookid: string; } = this.Hoteltype(ordertype);
    let floorid = this.getFloorId();
    this.discamnt = Math.round(this.discamnt);
    if (orderid == 0) {
      orderid = this.ORDER_ID;
    }

    if (ordertype !== orderfrom.DINE_IN) {
      this.captainid = this.waiterid.toString();
    }
    var stockdedtyp = localStorage.getItem("stockdedtyp");
    if (ststype == 'N' || ststype == 'S') {
      ({ saveitem, savetype } = this.savetypes(ordertype, saveitem, savetype));
      if (this.discby == 'R') {
        this.discperc = '0';
      }
      if (ststype == 'S') {
        savetype = 'S';
        saveitem = 'NK';
      }
      this.itemStatus();
      if (this.ischecked == true) {
        this.orderdetails = ({
          orderid: orderid, restid: this.restid, branchid: this.branchid, username: username, billno: "", discper: this.discperc, discprice: this.discamnt, userid: this.userid, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00",
          time: this.time, pickupbranchid: "1", transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.captainid, captainid: this.waiterid, noofpeople: this.noofpax,
          tableNo: tableid, billedstatus: "N", settlement: "N", custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "B", complementary: "N", uicomp: "Y", cancelremarks: "", cancelcategory: "", deliverydate: "",
          driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00", delvauthorized: "Y", discapprover: "", discreason: "", discremarks: "", redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y", cancelbilladminid: "", paymentmode: "",
          billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "", delprinted: "N", ccrefid: "0", areacode: "0", paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: roomservice, roomno: roomno, rateus: "", ratecomments: "", notifysent: "N", modkot: this.modifiykot, approvests: "N",
          deliveryremarks: "", canceltime: null, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N", custbillissue: "N", cashiersettled: "N", verifykot: "N", reprint: "N", hosync: "N", roundoff: "0.00", ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal,
          htldesk: htldesk, htlbookid: htlbookid, discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0", cardname: "", cardnumber: "", cardtype: "", floorid: floorid, ordfloorid: floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude,
          longitude: this.longitude, itemDetails: this.itemdetails, deliverytime: this.deliverytime, savetype: savetype, billedtime: this.currenttime, kotstatus: 'Y', admintype: admintype, saveitem: saveitem, ststype: ststype, restaurentname: restaurentname, stockdedtyp: stockdedtyp, dynamicprinter: this.printerId,
          happyHourID: this.happyHourId, isHappyHourEnable: this.isHappyHourEnable, happyHourTypeID: this.happyHourTypeID
        });
      } else {
        this.orderdetails = ({
          orderid: orderid, restid: this.restid, branchid: this.branchid, username: username, billno: "", discper: this.discperc, discprice: this.discamnt, userid: this.userid, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00",
          time: this.time, pickupbranchid: "1", transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.captainid, captainid: this.waiterid, noofpeople: this.noofpax,
          tableNo: tableid, billedstatus: "N", settlement: "N", custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "B", complementary: "N", uicomp: "N", cancelremarks: "", cancelcategory: "", deliverydate: "",
          driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00", delvauthorized: "Y", discapprover: "", discreason: "", discremarks: "", redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y", cancelbilladminid: "", paymentmode: "",
          billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "", delprinted: "N", ccrefid: "0", areacode: "0", paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: roomservice, roomno: roomno, rateus: "", ratecomments: "", notifysent: "N", modkot: this.modifiykot, approvests: "N",
          deliveryremarks: "", canceltime: null, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N", custbillissue: "N", cashiersettled: "N", verifykot: "N", reprint: "N", hosync: "N", roundoff: "0.00", ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal,
          htldesk: htldesk, htlbookid: htlbookid, discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0", cardname: "", cardnumber: "", cardtype: "", floorid: floorid, ordfloorid: floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude,
          longitude: this.longitude, itemDetails: this.itemdetails, deliverytime: this.deliverytime, savetype: savetype, billedtime: this.currenttime, kotstatus: 'Y', admintype: admintype, saveitem: saveitem, ststype: ststype, restaurentname: restaurentname, stockdedtyp: stockdedtyp, dynamicprinter: this.printerId,
          happyHourID: this.happyHourId, isHappyHourEnable: this.isHappyHourEnable, happyHourTypeID: this.happyHourTypeID
        });
      }
    }
    if (ststype == 'Y') {
      ({ saveitem, savetype, ordertype } = this.savetypes(ordertype, saveitem, savetype));
      if (this.discby == 'R') {
        this.discperc = '0';
      }
      this.itemStatus();
      let modoid = 0;
      if (this.ismodify == 'Y') {
        modoid = Number(orderid);
      }
      if (this.ischecked == true) {
        this.orderdetails = ({
          orderid: orderid, restid: this.restid, branchid: this.branchid, username: username, billno: "", discper: this.discperc, discprice: this.discamnt, userid: this.userid, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00",
          time: this.time, pickupbranchid: "1", transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.captainid, captainid: this.waiterid, noofpeople: this.noofpax,
          tableNo: tableid, billedstatus: "N", settlement: "N", custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "B", complementary: "Y", cancelremarks: "", cancelcategory: "", deliverydate: "",
          driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00", delvauthorized: "Y", discapprover: "", discreason: "", discremarks: "", redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y", cancelbilladminid: "", paymentmode: "",
          billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "", delprinted: "N", ccrefid: "0", areacode: "0", paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: roomservice, roomno: roomno, rateus: "", ratecomments: "", notifysent: "N", modkot: this.modifiykot, approvests: "N",
          deliveryremarks: "", canceltime: null, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N", custbillissue: "N", cashiersettled: "N", verifykot: "N", reprint: "N", hosync: "N", roundoff: "0.00", ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal,
          htldesk: htldesk, htlbookid: htlbookid, discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0", cardname: "", cardnumber: "", cardtype: "", floorid: floorid, ordfloorid: floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude,
          longitude: this.longitude, itemDetails: this.itemdetails, deliverytime: this.deliverytime, savetype: savetype, billedtime: this.currenttime, kotstatus: 'N', admintype: admintype, saveitem: saveitem, ststype: ststype, restaurentname: restaurentname, stockdedtyp: stockdedtyp, dynamicprinter: this.printerId,
          happyHourID: this.happyHourId, isHappyHourEnable: this.isHappyHourEnable, happyHourTypeID: this.happyHourTypeID, modoid: modoid
        });

      } else {
        this.orderdetails = ({
          orderid: orderid, restid: this.restid, branchid: this.branchid, username: username, billno: "", discper: this.discperc, discprice: this.discamnt, userid: this.userid, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00",
          time: this.time, pickupbranchid: "1", transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.captainid, captainid: this.waiterid, noofpeople: this.noofpax,
          tableNo: tableid, billedstatus: "N", settlement: "N", custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "B", complementary: "N", cancelremarks: "", cancelcategory: "", deliverydate: "",
          driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00", delvauthorized: "Y", discapprover: "", discreason: "", discremarks: "", redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y", cancelbilladminid: "", paymentmode: "",
          billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "", delprinted: "N", ccrefid: "0", areacode: "0", paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: roomservice, roomno: roomno, rateus: "", ratecomments: "", notifysent: "N", modkot: this.modifiykot, approvests: "N",
          deliveryremarks: "", canceltime: null, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N", custbillissue: "N", cashiersettled: "N", verifykot: "N", reprint: "N", hosync: "N", roundoff: "0.00", ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal,
          htldesk: htldesk, htlbookid: htlbookid, discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0", cardname: "", cardnumber: "", cardtype: "", floorid: floorid, ordfloorid: floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude,
          longitude: this.longitude, itemDetails: this.itemdetails, deliverytime: this.deliverytime, savetype: savetype, billedtime: this.currenttime, kotstatus: 'N', admintype: admintype, saveitem: saveitem, ststype: ststype, restaurentname: restaurentname, stockdedtyp: stockdedtyp, dynamicprinter: this.printerId,
          happyHourID: this.happyHourId, isHappyHourEnable: this.isHappyHourEnable, happyHourTypeID: this.happyHourTypeID, modoid: modoid
        });
      }
    }
    this.apiService.saveorder(this.orderdetails).subscribe(res => {
      if (res.code == 200 || res.status == 'success') {
        this.openToast('Order Placed Successfully...! Order ID is ' + res.orderid);
        localStorage.removeItem('custname');
        localStorage.removeItem('custaddr');
        localStorage.removeItem('cusnumber');
        localStorage.removeItem('latitude');
        localStorage.removeItem('longitude');
        localStorage.removeItem('flatno');
        localStorage.setItem('modifykot', 'N');
        localStorage.setItem('orderid', '');
        localStorage.setItem('order_id', '');
        if (this.tableComponent !== undefined) {
          this.tableComponent.clear();
        }
        this.cartService.removeAllCartItems().then(() => {
          this.cartTotal();
        })
        this.dismiss();
        if (ststype === 'Y') {
          if (this.order_type === 'P') {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                orderid: res.orderid
              }
            };
            this.router.navigate(['settlement'], navigationExtras);
          } else {
            this.router.navigate(['newdashboard']);
          }
        } else {
          this.router.navigate(['newdashboard']);
        }
      }
      else if (res.code == 400) {
        this.openToast("Error in Placing Order")
        this.dismiss();

      }
    })
  }
  private itemStatus() {
    this.itemdetails.forEach(element => {
      if (element.currentstatus === 'N') {
        element.kotstatus = 'N';
      } else {
        element.kotstatus = 'Y';
      }
      if (element.modparent != "0") {
        this.modifiykot = 'Y';
        element.itemStatus = 'C';
      } else {
        element.itemStatus = 'P';
      }
    });
  }

  private _printerDetails(ordertype: string, dinePrinter: string, takeawayPrinter: string, deliveryPrinter: string) {
    if (ordertype === orderfrom.DINE_IN) {
      dinePrinter = this.printerId;
      takeawayPrinter = '0';
      deliveryPrinter = '0';
    } else if (ordertype === orderfrom.TAKEAWAY) {
      dinePrinter = '0';
      takeawayPrinter = this.printerId;
      deliveryPrinter = '0';
    } else if (ordertype === orderfrom.DELIVERY) {
      dinePrinter = '0';
      takeawayPrinter = '0';
      deliveryPrinter = this.printerId;
    }
    return { dinePrinter, takeawayPrinter, deliveryPrinter };
  }

  private local_data() {
    let ordertype: string = localStorage.getItem('ordertype');
    let orderid: number = Number(localStorage.getItem('orderid'));
    if (orderid == 0) {
      orderid = Number(localStorage.getItem('order_id'));
    }
    let admintype: string = localStorage.getItem('AdminType');
    let username: string = localStorage.getItem('username');
    let restaurentname: string = localStorage.getItem('restname')
    let tableid = (localStorage.getItem('tableid') ? localStorage.getItem('tableid') : 0);
    this.cusname = (localStorage.getItem('custname') != null && localStorage.getItem('custname') != undefined) ? localStorage.getItem('custname') : "";
    this.custaddr = (localStorage.getItem('custaddr') != null && localStorage.getItem('custaddr') != undefined) ? localStorage.getItem('custaddr') : "";
    this.cusnumber = (localStorage.getItem('cusnumber') != null && localStorage.getItem('cusnumber') != undefined) ? localStorage.getItem('cusnumber') : "";
    this.flatno = (localStorage.getItem('flatno') != null && localStorage.getItem('flatno') != undefined) ? localStorage.getItem('flatno') : "";
    this.latitude = (localStorage.getItem('latitude') != null && localStorage.getItem('latitude') != undefined) ? localStorage.getItem('latitude') : "";
    this.longitude = (localStorage.getItem('longitude') != null && localStorage.getItem('longitude') != undefined) ? localStorage.getItem('longitude') : "";
    return { ordertype, orderid, tableid, admintype, username, restaurentname };
  }

  private savetypes(ordertype: string, saveitem: string, savetype: string) {
    if (ordertype == 'E') {
      saveitem = 'K';
      savetype = 'Y';
    } else if (ordertype == 'P' || ordertype == 'D' || ordertype == 'R') {
      saveitem = 'TK';
      savetype = 'N';
    } else if (ordertype == 'S') {
      saveitem = '';
      savetype = 'YN';
    } else if (ordertype == 'R') {
      ordertype = 'D'
    }
    return { saveitem, savetype, ordertype };
  }
  private getFloorId() {
    let floorid = 1;
    let ordertype: string = localStorage.getItem('ordertype');
    let floorwiseTakeawayDelivery = localStorage.getItem('floorwiseTakeawayDelivery');
    if (floorwiseTakeawayDelivery === 'Y' && (ordertype === orderfrom.DELIVERY || ordertype === orderfrom.TAKEAWAY)) {
      floorid = this.floorid;
    }
    return floorid;
  }
  private Hoteltype(ordertype: string) {
    let roomservice: string = "N";
    let roomno: number = Number(this.roomid);
    let htldesk: string = this.HtlDesk;
    let htlbookid: string = this.htlbookid;
    if (ordertype == 'R' && this.HtlDesk == 'N') {
      ordertype = 'D';
      roomservice = 'Y';
      roomno = Number(this.roomid);
    }
    else if (ordertype == 'R' && this.HtlDesk == 'Y') {
      ordertype = 'D';
      roomservice = 'Y';
      roomno = Number(this.roomid);
      htldesk = 'Y';
      htlbookid = this.htlbookid;
      if (this.htlbookname != undefined || this.htlbookname != null)
        this.cusname = this.htlbookname;
      if (this.htlbookmobile != undefined || this.htlbookmobile != null)
        this.cusnumber == this.htlbookmobile;
    }
    return { ordertype, roomservice, roomno, htldesk, htlbookid };
  }
  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }
  async dismiss() {
    this.isLoading = false;
    // if (this.isLoading) {
    return await this.loadingController.dismiss().then(
      () => console.log('dismissed'),
      (error) => console.error("Error in dismiss" + error));
    // }
  }
  dostockreversion(orderid, branchid, restid, itemdetails) {
    for (let i = 0; i < itemdetails.length; i++) {
      var sql = "SELECT  a.quantity,a.qtyprice,a.ingredientid,openingstock,closingstock,consumption FROM  `sr_itemingredients_tbl` a LEFT JOIN sr_ingredients_currentqty_tbl b ON a.IngredientID = b.IngredientID AND a.restid=b.restid AND a.branchid=b.branchid WHERE a.restid=" + restid + " AND a.branchid='" + branchid + "' AND menuid='" + itemdetails[i].product_id + "' ";
      this.sqlservice.dayendaut3(sql).then((res) => {
        for (let j = 0; j < res.length; j++) {
          var ingredentlist = [];
          ingredentlist.push(res[j]);
          var stockquantity = res[j].Quantity;
          var stockqtyprice = res[j].qtyprice;
          var stockingredientid = res[j].IngredientID;
          var openingstock = res[j].OpeningStock;
          var closingstock = res[j].ClosingStock;
          var consumption = res[j].consumption;
          var curentingredientid = res[j].IngredientID;
          var totquantity = itemdetails[i].count * stockquantity;
          var totalconsumtion = parseFloat(consumption) - totquantity;
          var totalclosingstock = closingstock + totquantity;

          var updatesql = "Update sr_ingredients_currentqty_tbl set closingstock=" + totalclosingstock + ",consumption=" + totalconsumtion + " Where restid=" + restid + " AND branchid='" + branchid + "' AND IngredientID=" + curentingredientid + " ";
          this.sqlservice.updateorder(updatesql).then((res) => {
            console.log(res);
          });
          var updatesql = "Update sr_ingredients_tbl set stockavailable=" + totalclosingstock + " Where restid=" + restid + " AND branchid='" + branchid + "' AND IngredientID=" + curentingredientid + " ";
          this.sqlservice.updateorder(updatesql).then((res) => {
            console.log(res);
          });
        }
      })
    }
  }
  cloudstocksync() {
    var sql = "Select closingstock,consumption,IngredientID FROM sr_ingredients_currentqty_tbl where restid=" + this.restid + " And branchid='" + this.branchid + "' And consumption!=0";
    this.sqlservice.dayendaut3(sql).then((res) => {
      this.stockconsumation = res;
      var id = "";
      if (res != undefined && res != null) {
        for (let i = 0; i < res.length; i++) {
          id += res[i].IngredientID + ",";
        }
        id = id.slice(0, -1)
        this.stockconsumation = JSON.stringify(res);
        console.log(this.stockconsumation);
        var data = JSON.stringify({ restid: this.restid, branchid: this.branchid, stockconsulist: this.stockconsumation, ingredientid: id });
        this.apiService.cloud_stock_sync(data).subscribe(res => {
          if (res.code == 200) {
            var ingreid = res.ingredientid;
            var sql = "update sr_ingredients_currentqty_tbl set consumption=0 where restid=" + this.restid + " And branchid='" + this.branchid + "' And IngredientID IN(" + ingreid + ")"
            this.sqlservice.updrivdet(sql).then((res) => {
            })
          }
          else {

          }
        });
      }
      else {

      }
    })
  }
  loadtable(orderid) {
    var cartitems = [];
    var cartvalue = [];
    var data = JSON.stringify({ restid: this.restid, branchid: this.branchid, "oid": orderid })
    console.log(data);
    this.apiService.getbillingorders(data).subscribe(res => {
      this.ORDER_ID = orderid;
      console.log(res);
      this.ordereddet = JSON.parse(res.orderdetails);
      if (this.ordereddet[0].UiComp === 'Y') {
        this.ischecked = true;
      }
      this.discby = this.ordereddet[0].discby;
      if (this.discby == 'P')
        this.discperc = this.ordereddet[0].discper;
      else if (this.discby == 'R')
        this.discamnt = this.ordereddet[0].discprice;
      for (var i = 0; i < this.ordereddet.length; i++) {

        cartvalue.push(this.ordereddet[i]);
        var cart = this.existingorder(this.ordereddet[i], orderid);
        cartitems.push(cart);


      }
      this.storage.set(CART_KEY, cartitems);
      this.cartService.getCartItems().then((val) => {
        console.log(val);
        val = true;
        localStorage.setItem('orderid', '');
        this.cartTotal();
      });
    });

  }
  dostockdetection(orderid, branchid, restid, itemdetails) {
    for (let i = 0; i < itemdetails.length; i++) {
      var sql = "SELECT  a.quantity,a.qtyprice,a.ingredientid,openingstock,closingstock,consumption FROM  `sr_itemingredients_tbl` a LEFT JOIN sr_ingredients_currentqty_tbl b ON a.IngredientID = b.IngredientID AND a.restid=b.restid AND a.branchid=b.branchid WHERE a.restid=" + restid + " AND a.branchid='" + branchid + "' AND menuid='" + itemdetails[i].itemid + "' ";
      this.sqlservice.dayendaut3(sql).then((res) => {
        for (let j = 0; j < res.length; j++) {
          var ingredentlist = [];
          ingredentlist.push(res[j]);
          var stockquantity = res[j].Quantity;
          var stockqtyprice = res[j].qtyprice;
          var stockingredientid = res[j].IngredientID;
          var openingstock = res[j].OpeningStock;
          var closingstock = res[j].ClosingStock;
          var consumption = res[j].consumption;
          var curentingredientid = res[j].IngredientID;
          var totquantity = itemdetails[i].itemqty * stockquantity;
          var totalconsumtion = consumption + totquantity;
          var totalclosingstock = parseFloat(closingstock) - totquantity;
          var updatesql = "Update sr_ingredients_currentqty_tbl set closingstock=" + totalclosingstock + ",consumption=" + totalconsumtion + " Where restid=" + restid + " AND branchid='" + branchid + "' AND IngredientID=" + curentingredientid + " ";
          this.sqlservice.updateorder(updatesql).then((res) => {
            console.log(res);
          });
          var updatesql = "Update sr_ingredients_tbl set stockavailable=" + totalclosingstock + " Where restid=" + restid + " AND branchid='" + branchid + "' AND IngredientID=" + curentingredientid + " ";
          this.sqlservice.updateorder(updatesql).then((res) => {
            console.log(res);
            var hosynceveryorder = localStorage.getItem("hosynceveryorder");
            if (hosynceveryorder == "Y") {
              //this.cloudstocksync()
            }
          });
        }
      })
    }
  }
  doChangeOrder(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if (event.value.ordertype == 'E') {
      this.openToast('Please Select Table Number');
      this.isdinein = true;
      this.tempfloor = event.value;
      this.table(event.value.fid);
      this.changefloorlist = this.floor1.filter(value => value.fid !== event.value.fid);
      this.changeorder = null;
    } else {
      this.setData(event);
    }
  }
  private setData(event: { component: IonicSelectableComponent; value: any; }) {
    this.floorid = event.value.fid;
    this.order_type = event.value.ordertype;
    this.floorname = event.value.descr;
    this.floorvalue = event.value;
    localStorage.setItem('FloorId', this.floorid.toString());
    localStorage.setItem('orderid', '');
    localStorage.setItem('order_id', '');
    localStorage.setItem('tableid', '0');
    localStorage.setItem('ordertype', this.order_type);

    this.isdinein = false;
    this.changefloorlist = this.floor1.filter(value => value.fid !== event.value.fid);
    this.changeorder = null;
    this.cust = this.order_type;
    if (this.order_type === 'D') {
      this.router.navigate(['customerd']);
    }
    this.tableComponent.clear();
    this.captainComponent.clear();
    this.waiterComponent.clear();
    this.onlinecomponent.clear();
    this.ionViewDidEnter();
  }

  dochangeordertable(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    localStorage.setItem('tableid', event.value.id);
    localStorage.setItem('tablename', event.value.tno);
    var dayenddate = localStorage.getItem('dayenddate');
    var tablesql = "select count(*) as count ,orderid from sr_orders_tbl where restid=" + this.restid + " AND branchid='" + this.branchid + "' AND billedstatus='Y' AND Settlement='N' And TableNo=" + event.value.id + " AND billdate='" + dayenddate + "' Limit 0,1;";
    this.sqlservice.dayendaut3(tablesql).then((res) => {
      var count = res[0].count;
      var orderid = res[0].orderid;
      if (orderid != undefined && count > 0) {
        this.openToast("Please close the settlement...")
      }
      else {
        var tablesql = "select count(*) as count ,orderid,billedstatus from sr_orders_tbl where restid=" + this.restid + " AND branchid='" + this.branchid + "' AND billedstatus='N'  And TableNo=" + event.value.id + " AND billdate='" + dayenddate + "' Limit 0,1;";
        this.sqlservice.dayendaut3(tablesql).then((res) => {
          var count = res[0].count;
          var orderid = res[0].orderid;
          if (count > 0 && orderid != null) {
            this.openToast("It's Running order table...")
          }
          else {
            this.floorid = this.tempfloor.fid;
            this.order_type = this.tempfloor.ordertype;
            this.floorname = this.tempfloor.descr;
            this.floorvalue = this.tempfloor
            this.cust = this.order_type;
            localStorage.setItem('tableid', event.value.id);
            localStorage.setItem('tablename', event.value.tno);
            localStorage.setItem('orderid', '');
            localStorage.setItem('order_id', '');
            localStorage.setItem('FloorId', this.floorid.toString());
            localStorage.setItem('ordertype', this.order_type);
            this.isdinein = false;
            this.changefloorlist = this.floor1.filter(value => value.fid !== event.value.fid);
            this.changeorder = null;
            this.waiterComponent.clear();
            this.onlinecomponent.clear();
            this.ionViewDidEnter();
          }
        });
      }
    })
  }
  @HostListener('document:keydown.escape', ['$event'])
  onKeydown(e) {
    this.home();
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let keypressed = event.keyCode;
    if (keypressed === 40) {
      if (this.keycount <= this.category.length - 1) {
        ++this.keycount
        this.menudetail(this.category[this.keycount - 1].id);
        let key = document.getElementById("category");
        key.focus();
        this.dismiss();
      }
    }
    if (keypressed === 38) {
      if (this.keycount >= 1) {
        --this.keycount
        this.menudetail(this.category[this.keycount - 1].id);
        let key = document.getElementById("category");
        key.focus();
        this.dismiss();
      }
    }
  }
  myMouseClicked(event: MouseEvent) {
    this.menussearch = [];
    this.data.search = '';
    if (this.width > 500) {
      this.menu.enable(false);
      this.menutoggle = 0;
    }
  }
  dynamic_printers() {
    let data = ({ restid: this.restid, branchid: this.branchid });
    this.apiService.printers(data).subscribe(res => {
      this.printers = res;
      this.printers.unshift(({ descr: '-Select-', printID: '0', printName: '-Select-' }));
    })
  }
  selectPrinter(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.printerId = event.value.printID;
    localStorage.setItem(this.floorname, this.printerId);
  }

  private async _getCaptionAndWaiterID(restid, branchid, orderid) {
    const SQL: string = `SELECT captainid,waiterid,UIComp,discby,discprice,discper FROM sr_orders_tbl WHERE restid = ${restid} AND branchid = '${branchid}' AND orderid = '${orderid}'`;
    const responce = await this.sqlservice.dayendaut3(SQL);
    if (responce === undefined) {
      this.waiterid = responce[0]?.captainid ?? 0;
      this.captainid = responce[0]?.waiterid ?? 0;
      this.discby = responce[0]?.discby ?? "P";
      this.discperc = responce[0]?.discper ?? "0";
      this.discamnt = responce[0]?.discprice ?? "0";
      if (responce[0]?.UIComp === 'Y') {
        this.ischecked = true;
      }
    }
  }
  private async _happyHours(restid: number, branchid: string, product: any) {
    const { happyHourID, happyHourTypeID }: { happyHourID: number, happyHourTypeID: number } = await this.happyhour._getHappyHourID(restid, branchid);
    this.isHappyHourEnable = "Y";
    this.happyHourId = happyHourID?.toString() || '0'
    this.happyHourTypeID = happyHourTypeID?.toString() || '0';
    if (happyHourTypeID === 1) {
      let itemParentID = await this.happyhour._happyHourBuyOneGetOneItemParent(happyHourID);
      let menuid = "";
      itemParentID.forEach(value => {
        if (value.MenuID === product.itemparent) {
          menuid = value.MenuID;
        }
      });
      if (menuid === product.itemparent) {
        await this._BuyOneGetOneUpdate(product);
      }

    } else if (happyHourTypeID === 2) {
      let { discountPersentage, minimumDiscountAmount }:
        { discountPersentage: number, minimumDiscountAmount: number } = await this.happyhour._happyHourItemDiscount(restid, branchid, happyHourID);
      if (Number(this.grandtotal) !== 0) {
        this.grandtotal = this.grandtotal
      } else {
        this.grandtotal = product.price * Number(product.qty)
      }
      if (Number(this.grandtotal) >= minimumDiscountAmount) {
        this.discby = 'P';
        this.discperc = discountPersentage;
      } else {
        this.discby = 'P';
        this.discperc = 0;
      }
    } else if (happyHourTypeID === 3) {
      let price = 0;
      price = await this._happyHourPrice(restid, branchid, product.id);
      if (price !== 0) {
        product.price = price
        product.singlePrice = product.price;
        product.totalPrice = product.price * product.qty;
      }
    }
    return product;
  }

  private async _BuyOneGetOneUpdate(product: any) {
    let productPrice = product.price;
    let singlePrice = product.singlePrice;
    let totalPrice = product.totalPrice;
    product = this._productDetails(product)
    product.price = 0;
    product.singlePrice = 0;
    product.totalPrice = 0;
    product.knotes = '';
    product.remarks = '';
    product.takeaway = 'N';
    product.complimentary = 'Y';
    product.idiscperc = ''
    product.idiscprice = ''
    product.itewisediscount = 'Y';
    product.count = product.qty;
    product.qty = product.qty;
    product.add = product.add;
    product.totalprice = product.totalPrice.toFixed(2);
    product.ishappyhour = 'F';
    product.product_id = product.id
    this.addcart.push(product);
    await this.cartService.addToCart(product);
    this.cartTotal();
    product.price = productPrice;
    product.singlePrice = singlePrice;
    product.totalPrice = totalPrice;
    product.knotes = '';
    product.remarks = '';
    product.takeaway = 'N';
    product.complimentary = 'N';
    product.idiscperc = '';
    product.idiscprice = '';
    product.itewisediscount = 'Y';
    product.ishappyhour = 'C'
    product.totalprice = totalPrice
  }
  private async _happyHourPrice(restid: number, branchid: string, menuid: any) {
    let isAcFloor: string;
    let tablelist: any = []
    const happyPriceSQL = `SELECT happyprice,happyacprice FROM sr_menumstr_tbl WHERE restid = ${restid} AND branchid = '${branchid}' AND menuid = '${menuid}'`;
    const happyprice = await this.sqlservice._getValues(happyPriceSQL);
    let tempTableList = localStorage.getItem('tablelist');
    if (tempTableList === undefined || tempTableList === "undefined") {
      isAcFloor = "N"
    } else {
      tablelist = JSON.parse(tempTableList);
      isAcFloor = tablelist.filter(value => this.tablename === value.tno).map(x => x.actable);
    }
    if (isAcFloor == "Y" || this.acfloor == "Y") {
      return happyprice[0]?.happyacprice;
    } else {
      return happyprice[0]?.happyprice;
    }

  }
  cancelbill(type, message) {
    var sql = "SELECT categoryid,descr FROM sr_categorymstr_tbl WHERE restid='" + this.restid + "' AND branchid='" + this.branchid + "' AND type=2";
    this.sqlservice.reasoncancelotp(sql).then((res) => {
      console.log(res);
      var reason = JSON.parse(JSON.stringify(res));
      var html = '<select id="reason" >';
      html +=`<option value="" disabled selected hidden>Select the reason</option>`
      for (var i = 0; i < reason.length; i++) {
        html += '<option value=' + reason[i].id + ' selected>' + reason[i].descr + '</option>';
      }
      html += '</select>';
      console.log(html);
      this.sqlservice.approveadmin(this.restid, this.branchid).then((val) => {
        console.log(val);
        let adminlist: any[] = val;
        var html1 = '<div class="ion-margin-top"><select id="admin" >';
        for (var i = 0; i < adminlist.length; i++) {
          html1 += '<option value=' + adminlist[i].userid + ' selected>' + adminlist[i].name + '</option>';
        }
        html1 += '</select></div>';
        this.discount(message, html, html1, reason, adminlist, type);
      });
    });
  }

  async discount(title, html, html1, reasonlist, adminlist, type) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: html + '<br>' + html1,
      inputs: [{
        name: 'password',
        value: '',
        type: 'password',
        placeholder: 'Enter the password'
      },
      {
        name: 'remarks',
        value: '',
        type: 'text',
        placeholder: 'Enter Remarks'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: data => {
        }
      }, {
        text: 'Ok',
        handler: data => {
          var e = (document.getElementById("admin")) as HTMLSelectElement;
          var sel = e.selectedIndex;
          var opt = e.options[sel];
          var CurValue = (opt).value;
          var admin = 0;
          var pass = '';
          adminlist.filter(value => value.name === CurValue).map(x => {
            admin = x.userid;
            pass = x.password;
          })
          var e1 = (document.getElementById("reason")) as HTMLSelectElement;
          var sel1 = e1.selectedIndex;
          var opt1 = e1.options[sel1];
          var returnvalue = 0;
          if(opt1 !== undefined){
            var CurValue = (opt1).value;
          }else{
            returnvalue = 1;
            this.openToast('Please Select Reason...!');
          }
          var reasonid = 0;
          reasonlist.filter(value => value.descr === CurValue).map(x => reasonid = x.id);
        
          if (admin == 0) {
            this.openToast('Please Select Approver...!');
            returnvalue = 1;
          }
          else if (data.password == null || data.password == undefined || data.password == "") {
            this.openToast('Please Enter Password...!');
            returnvalue = 1;
          }
          else {
            if (data.password != '' && data.password == pass) {
              returnvalue = 0;
            }
            else {
              this.openToast('Please Enter Correct Password...!');
              returnvalue = 1;
            }
          }
          if (reasonid == 0) {
            this.openToast('Please Select Reason...!');
            returnvalue = 1;
          }
          if (data.remarks == "" || data.remarks == undefined || data.remarks == null) {
            this.openToast('Please Enter Remarks...!');
            returnvalue = 1;
          }
          data.remarks = data.remarks.replace(/[^a-zA-Z0-9 ]/,'');
          if (returnvalue == 0) {
            let dateTime = new Date();
            var currenttime = this.datePipe.transform(dateTime, 'yyyy-MM-dd h:mm:ss');
            if (type === 'C') {
              this.cancelRemarks = data.remarks;
              this.cancelCategory = reasonid;
              this.cancelbilladminid = admin;
              this.cancelTime = currenttime;
              this.remarks = data.remarks;
            } else {
              this.discRemarks = data.remarks;
              this.discReason = reasonid;
              this.discApprover = admin;
              this.remarks = data.remarks;
            }
            if (this.oneuiinstance === 'C') {
              this.saveorder('Y');
            } else {
              this.Hsaveorder('Y');
            }

          }
        }
      }
      ]
    });

    await alert.present();
  }
  save() {
    this.discperc = Number(this.discperc);
    this.discamnt = Number(this.discamnt);
    let authbill = localStorage.getItem('authbill');
    if (authbill !== 'N') {
      if (this.discperc !== 0 || this.discamnt !== 0) {
        if (authbill === 'O') {
          this.otpVerification('D');
        } else {
          this.cancelbill('D', 'Discount Verification');
        }

      } else if (this.ischecked === true) {
        if (authbill === 'O') {
          this.otpVerification('C');
        } else {
          this.cancelbill('C', 'Complimentary  Verification');
        }
      } else {
        if (this.oneuiinstance === 'C') {
          this.saveorder('Y');
        } else {
          this.Hsaveorder('Y');
        }

      }
    } else {
      if (this.oneuiinstance === 'C') {
        this.saveorder('Y');
      } else {
        this.Hsaveorder('Y');
      }
    }
  }
  trackBy(index: number, menu: any): number {
    return index;
  }
  showTax() {
    this.show = true;
    let id = document.getElementById('close');
    // id.style.height = "215px";   
  }
  closeTax() {
    this.show = false;
    let id = document.getElementById('close');
    // id.style.height = "315px";
  }
  async custModal() {
    const modal = await this.modalController.create({
      component: CustomerdPage,
      componentProps: {
        tempWidth: 400
      }
    });
    return await modal.present();
  }
  async runningOrderModal() {
    const modal = await this.modalController.create({
      component: RunningOrderPage,
      componentProps: {
        "todayorder": JSON.stringify(this.todayorder)
      }
    });
    modal.onDidDismiss().then((modelData) => {

      if (modelData.data !== undefined) {
        this.checkorder(modelData.data.orderid, modelData.data.ordertype, modelData.data.tableno, modelData.data.floorid)
      }
    });
    return await modal.present();
  }
  async clearItem(product) {
    product.add = '';
    let qty = 0;
    let isHappyHourEnable = localStorage.getItem('isHappyHourEnable');
    if (product.productionMappingStatus === false) {
      qty = product.qty
      this.clearcartItem(product, qty)
    } else {
      // if(product.ProdEnable === 'Y'){
      if (product.productionItemCount >= 0) {
        let productionCount = await this.productionService._getProductionDetails(this.restid, this.branchid, product.id);
        let qty = await this.productionService._productionItemQty(this.restid, this.branchid, product.id);
        if (productionCount[0].ClosingQty >= product.productionItemCount) {
          product.productionItemCount = product.productionItemCount + (qty * product.qty);
        }
        qty = product.qty

      }
      if (isHappyHourEnable === 'Y') {
        product = await this._happyHours(this.restid, this.branchid, product);
      }
      var cartProduct = this._productDetails(product);
      this.clearcartItem(cartProduct, qty);

    }
    // }

  }
  async clearcartItem(product, qty) {
    let isHappyHourEnable = localStorage.getItem('isHappyHourEnable');
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Do You Want To Remove Item From Cart? ',
      buttons: [
        {
          text: 'Yes',
          handler: async data => {
            if (isHappyHourEnable === 'Y') {
              product = await this._happyHours(this.restid, this.branchid, product);
            }
            product.qty = 0;
            product.count = 0;
            var cartProduct = this._productDetails(product);

            this.cartService.addToCart(cartProduct).then(async (val) => {
              console.log(val);
              if (this.grandtotal !== '0') {
                this.discperc = 0;
              }
              if (this.modparent.length > 0) {
                for (let i = 0; i < this.cartdetails.length; i++) {
                  if (product.id === this.cartdetails[i].modparent) {
                    this.cartdetails[i].qty = 0;
                    this.cartdetails[i].count = 0;
                    let modifier = this._productDetails(this.cartdetails[i]);
                    await this.cartService.addToCart(modifier);
                  }
                }
              }

              this.cartTotal();
              this.categories();
            });
          }
        }, {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async data => {
            let proqty = await this.productionService._productionItemQty(this.restid, this.branchid, product.id);
            product.productionItemCount = product.productionItemCount - (proqty * qty);
            var cartProduct = this._productDetails(product);
            this.cartService.addToCart(cartProduct).then((val) => {
              console.log(val);
              this.cartTotal();
            });
          }
        }
      ]
    });
    await alert.present();
  }
  private getMainPrinter() {
    let mainprinterdets = `SELECT printname,Descr FROM sr_printmstr_tbl where restid="${this.restid}" AND branchid='${this.branchid}' AND printType='mainbill'`;
    this.sqlservice._getValues(mainprinterdets).then((result) => {
      if (result !== undefined && result.length > 0) {
        this.mainbillstatus = result[0].descr;
        this.mainip = result[0].printname;
      }
    });
  }
  private getKOTPrinter() {
    let mainprinterdets = `SELECT printname,Descr FROM sr_printmstr_tbl where restid="${this.restid}" AND branchid='${this.branchid}' AND printType='kot'`;
    this.sqlservice._getValues(mainprinterdets).then((result) => {
      if (result !== undefined && result.length > 0) {
        this.kotBillStatus = result[0].descr;
        this.kotIP = result[0].printname;
      }
    });
  }
  private getAutoSettlement() {
    let sql = `SELECT autosettle,autosettle_delivery from sr_branches_tbl WHERE restid = ${this.restid} AND branchid ='${this.branchid}'`;
    this.sqlservice
      .autosettlement(sql)
      .then((res) => {
        this.isAuttosettlement = res[0].autosettle;
      })
  }
  autosettle(orderdetails, orderid, restid, branchid) {
    let sql: string = '';
    let dateTime = new Date();
    var currenttime = this.datePipe.transform(dateTime, 'yyyy-MM-dd h:mm:ss');
    if (orderdetails[0].custname === '' && orderdetails[0].custmob === '') {
      sql = `UPDATE sr_orders_tbl SET pmcash='${orderdetails[0].totalprice}',dueamount=0,paymodeid=0,settlementtimeta='${currenttime}',settlement='Y',delvimmediatesettle='Y' WHERE orderid=${orderid} AND restid=${restid} AND branchid='${branchid}'`;
    } else {
      sql = `UPDATE sr_orders_tbl SET pmcash='${orderdetails[0].totalprice}',dueamount=0,custname='${orderdetails[0].custname}',custmob='${orderdetails[0].custmobile}',"settlementtimeta='${currenttime}',settlement='Y',delvimmediatesettle='Y' WHERE orderid=${orderid} AND restid=${restid} AND branchid='${branchid}'`;
    }
    console.log(sql);
    this.sqlservice.settlement(sql).then((res) => {
      this.ordersyncs();
      if (
        orderdetails[0].custmobile != null &&
        orderdetails[0].custmobile != undefined &&
        orderdetails[0].custmobile != ''
      ) {
        var sql1 = `SELECT IFNULL(MAX(custvisitcnt)+1,1) as custvisitcnt, id FROM sr_custmaster_tbl WHERE custmobile=${orderdetails[0].custmobile} AND restid=${restid} AND branchid='${branchid}`;
        console.log(sql1);
        this.sqlservice.checkcustomer(sql1).then((res) => {
          var cust_avail = JSON.parse(JSON.stringify(res));
          var customerid = 0;
          if (cust_avail[0].custvisitcnt == 1) {
            var sql2 = `INSERT INTO sr_custmaster_tbl(restid,branchid,custmobile,custname,custaddr,createdate,custvisitcnt)VALUES(${restid},'${this.branchid}',${orderdetails[0].custmobile},'${orderdetails[0].custname}','','${orderdetails[0].billedtime}','1')`;
            console.log(sql2);
          } else {
            var sql2 = `UPDATE sr_custmaster_tbl SET custvisitcnt=${cust_avail[0].custvisitcnt} WHERE custmobile=${orderdetails.custmobile} AND restid=${restid} AND branchid='${branchid}'`;
            console.log(sql2);
          }
          this.sqlservice.insertcustomer(sql2).then((res) => {
            customerid =
              cust_avail[0].customerid != null ? cust_avail[0].customerid : res;
          });
        });
      }
      this.openToast(`Order ${orderid} is Settled Successfully!`);
    });
  }
  async ordersyncs() {
    this.restid = localStorage.getItem('RestID');
    let dateTime = new Date();
    var date = this.datePipe.transform(dateTime, 'yyyy-MM-dd');
    date = localStorage.getItem('dayenddate');
    this.orderdetails = [];
    var sql = `SELECT orderid,restid,branchid,billno,userid,orderstatus,ordertype,orderprice,discper,discprice,totalprice,redeemprice,
    time,pickupbranchid,transactionid,paymentid,paymentcode,usersmsSent,adminemailsent,createdate,lastupdated,transferstatus,
    transferfrom AS transferFrom,reason,statusrequest,waiterid,captainid,nofpeople,tableno,billedstatus,settlement,custname,custaddr,custmob,custlandmark,
    custaddnum AS custaddNum,custemail,tokenno,splittype,billtype,cancelremarks,cancelcategory,canceltime,stockacc,billedtime,deliverydate,driverid,drivermob,
    createdby,deliverystart,delvauthorized,delvimmediatesettle,discapprover,disctime,discreason,discremarks,redeempoints,verifycode,cashreceived,
    transferdate,printkitchen,paymentmode,billdate,pmcash,pmcreditc,pmcredit,pmprepaid,billremarks,delprinted,ccrefid,areacode,paystatus,onlineref,
    customerpickup,roomservice,roomno,rateus,ratecomments,notifysent,modkot,approvests,htlbookid,roundoff,reprint,pmhtldesk,pmothers,pmoremarks,
    paymodeid,cardname,cardnumber,cardtype,verifykot,ccadminaccept,agentname,htldesk,dueamount,floorid,ordfloorid,settlementtimeta,latitude,
    longitude,deliverystatus,advbooking,advbookingdate,advbookbalamount,bookingadvanceamt,taxexemption,paytmstscode,txnid,taxexemptionval,discby,
    missingitem,compcancelprice,CompCancelOtp AS compcancelotp,parentordid,modifycount,greetmsg,sesid,taxamount,givenamount,swiggycnclsts,happyhourid,
    rewardcardno,couponid,pastsaleedit,pastsaleedituserid,reprintremarks,deliveryremarks,tips,tipsamount,custbillissue,cashiersettled,hosynccnt FROM sr_orders_tbl WHERE hosync='N' and billedstatus='Y' AND settlement='Y' AND billdate='`+ date + `' limit 5`;
    this.orderdetails = await this.sqlservice.fetchdet(sql)
    if (this.orderdetails.length > 0) {
      for (var i = 0; i < this.orderdetails.length; i++) {
        if (this.orderdetails[i].canceltime === '') {
          this.orderdetails[i].canceltime = null;
        }
        this.orderdetails[i].vertualstockTables = null;
        var sql = "SELECT ordersummaryid,itemid,itemprice,itemqty,pos_unitprice,status,remarks,kotstatus,ronumber,createddate,currentstatus,priority,kottime,pickpointtime,deliverytime,wtrid,itemcomplementary,itemsaving,litem,halltype,cptnreward,ltype AS lType,knotes,htldesk,combotype,modindex,modparent,idiscprice,idiscper,ismodifier,prod_act,complementaryprice,taxitem,kotcount,structid,taxamount,onlinecomboparent,onlinecombotype,modparent FROM sr_order_smry_tbl WHERE orderid='" + this.orderdetails[i].orderid + "'";
        this.orderdetails[i].orderSummaryTable = await this.sqlservice.fetchdet(sql);
        var sql = "SELECT orderid,ordersummaryid,itemid,taxmapid,structid,taxid,taxperc,taxamount,optionaltaxapply,customizetaxapply,createeddate FROM sr_order_smry_tax_tbl WHERE orderid='" + this.orderdetails[i].orderid + "'";
        this.orderdetails[i].orderTaxsummaryTables = await this.sqlservice.fetchdet(sql)
      }
      this.apiService.ordersync(this.orderdetails, this.restid, this.orderdetails.length, date).subscribe(async res => {
        var msg = res.msg;
        var ordertable = res.ordertable;
        if (msg == "success") {
          for (var s = 0; s < ordertable.length; s++) {
            var hores = ordertable[s].split("!#!");
            if (hores[1] == "Y") {
              var sqlupdate = "UPDATE sr_orders_tbl SET hosync='Y' WHERE orderid=" + hores[0] + " AND  restid=" + this.restid + " AND  branchid='" + this.branchid + "'";
              await this.sqlservice.updateorder(sqlupdate)
            }
          }
        }
      });
    }
  }
  checkOrderName = (ordertype) => {
    if (ordertype === 'E') {
      return 'Dine-In'
    } else if (ordertype === 'P') {
      return 'Takeaway'
    } else {
      return 'Delivery'
    }
  }
  settingOption(code: number) {
    switch (code) {
      case 1:
        this.custModal();
        break;
      case 2:
        this.splitbill();
        break;
      case 3:
        this.runningOrderModal()
        break;
      case 4:
        this._onlineOrders();
        break;
      case 5:
        console.log("HOLD");
        break;
      case 0:
        console.log("OPEN ORDERS");
        break;
      case 1:
        console.log("PRODUCTON");
        break;
      case 2:
        console.log("COUPON");
        break;
      case 3:
        console.log("RE-ORDER");
        break;
      case 4:
        console.log("VOID");
        break;
      case 5:
        console.log("EXTRAS");
        break;
    }
  }
  dms() {
    this.router.navigate(['delivmngsys']);
  }
  redirect(module) {
    if (this.width > 500) {
      var userid = localStorage.getItem('UserID');
      var data = JSON.stringify({ restid: this.restid, branchid: this.branchid, userid: userid });
      this.apiService.generatetoken(data).subscribe(res => {
        console.log(res);
        if (res.code == 200) {
          var url = localStorage.getItem('API_URL');
          console.log(url);
          var tokenno = res.tokenno;
          console.log(url + "RestaurantApp/validatetoken?restid=" + this.restid + "&branchid=" + this.branchid + "&userid=" + userid + "&token=" + tokenno + "&forwardto=" + module);
          window.open(url + "RestaurantApp/validatetoken?restid=" + this.restid + "&branchid=" + this.branchid + "&userid=" + userid + "&token=" + tokenno + "&forwardto=" + module);
        }
      });
    } else {
      this.openToast('This page Does not support mobile view');
    }
  }
  stockvalidation() {
    var user_id = localStorage.getItem("user_id");
    var stocksql = "select count(*) as No  from sr_useraccess_tbl where userid=" + user_id + " And Screenid=629"
    this.sqlservice.dayendaut3(stocksql).then((res) => {
      this.stockvalidate = res[0].No;
    });
  }
  proctionvalidation() {
    var user_id = localStorage.getItem("user_id");
    var stocksql = "select count(*) as No  from sr_useraccess_tbl where userid=" + user_id + " And Screenid=623"
    this.sqlservice.dayendaut3(stocksql).then((res) => {
      this.prodvalidate = res[0].No;
    });
  }
  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: PagesComponent,
      event: e
    });

    await popover.present();

  }
  left() {
    let d = 1;
    let arr = this.settingList;
    let len = this.settingList.length;
    this.leftRotate(arr, d, len);
  }
  right() {
    let d = 1;
    let arr = this.settingList;
    let len = this.settingList.length;
    this.rightRotate(arr, d, len);
  }
  reverseArray(arr, start, end) {
    while (start < end) {
      var temp = arr[start];
      arr[start] = arr[end];
      arr[end] = temp;
      start++;
      end--;
    }
  }
  leftRotate(arr, d, n) {
    if (d == 0) return;
    d = d % n;
    this.reverseArray(arr, 0, d - 1);
    this.reverseArray(arr, d, n - 1);
    this.reverseArray(arr, 0, n - 1);
  }
  rightRotate(arr, d, n) {
    this.reverseArray(arr, 0, n - 1);
    this.reverseArray(arr, 0, d - 1);
    this.reverseArray(arr, d, n - 1);
  }
  async knotesPopover(e: Event, item) {
    const popover = await this.popoverController.create({
      component: KnotesComponent,
      event: e,
      componentProps: {
        restid: this.restid,
        branchid: this.branchid,
        knotes: item?.knotes,
        remarks: item?.remarks,
        takeaway: item?.taenabled === 'Y' ? true : false,
        complimentary: item?.complimentary == 'Y' ? true : false,
        itemDiscountPrice: item?.idiscprice ?? 0,
        itemDiscountPersentage: item?.idiscperc ?? 0
      }
    });

    await popover.present();
    const data = await popover.onDidDismiss().then(popdata => {
      const data = popdata.data;
      if (data !== undefined) {
        this.Knotes(item, data);
      }
    })
  }
  Knotes(item, data) {
    let price: number = 0
    item.knotes = data.knotes ?? '';
    item.remarks = data.remarks ?? '';
    item.complimentary = data.complimentary === true ? 'Y' : 'N';
    item.takeaway = data.takeaway === true ? 'Y' : 'N';
    item.idiscprice = data.itemDiscountPrice ? data.itemDiscountPrice ?? '0.00' : '0.00';
    item.idiscperc = data.itemDiscountPersentage ? data.itemDiscountPersentage ?? '0.00' : '0.00';
    if (parseFloat(item.qty) == 0) {
      item.qty = this.data.qty;
    }
    if (parseInt(item.idiscprice) > 0 || parseInt(item.idiscperc) > 0) {
      item.itewisediscount = 'Y';
    } else {
      item.itewisediscount = 'N';
      let qty = item.qty;
      if (parseFloat(qty) == 0) {
        qty = this.data.qty;
      }
      item.totalprice = parseFloat(item.price) * parseFloat(qty);
      item.totalprice = parseFloat(item.totalprice).toFixed(2);
    }
    if (item.itewisediscount === 'Y') {
      let discprice = item.idiscprice;
      let discperc = item.idiscperc;
      let qty = item.qty;
      if (parseFloat(qty) == 0) {
        qty = this.data.qty;
      }
      item.totalprice = parseFloat(item.price) * parseFloat(qty);
      let newprice = item.totalprice;
      if ((parseFloat(discprice) > 0 && parseFloat(newprice) > 0)) {
        item.idiscperc = (parseFloat(discprice) / parseFloat(newprice) * 100).toFixed(2);
        price = parseFloat(discprice);
      } else if (parseFloat(discperc) > 0 && parseFloat(newprice) > 0) {
        item.idiscprice = ((parseFloat(newprice) * parseFloat(discperc)) / 100).toFixed(2);
        price = item.idiscprice;
      }
      if (newprice != undefined && newprice != "") {
        item.totalprice = newprice - price;
        item.totalprice = parseFloat(item.totalprice).toFixed(2);
      }
      if (discperc > parseFloat(this.maxdiscount) || item.idiscperc > parseFloat(this.maxdiscount)) {
        this.openToast("Discount Price Greater than Max Allowed Discount");
        item.idiscprice = '0.00';
        item.idiscperc = '0.00';
        return false;
      }
    }
    if (item.takeaway === 'Y') {
      var qty = item.qty;
      if (parseFloat(qty) == 0) {
        qty = this.data.qty;
      }
      item.price = item.parcelprice;
      item.totalPrice = item.parcelprice;
      if (this.cartdetails.length > 0) {
        this.cartdetails.find(item => item.id == item.id).price = item.parcelprice;
        this.cartdetails.find(item => item.id == item.id).totalPrice = item.parcelprice;
      }
    }
    this.addcart.push(item);
    for (var i = 0; i < this.menus.length; i++) {
      if (this.menus[i].id == item.id) {
        this.menus[i].remarks = item.remarks;
        this.menus[i].complimentary = item.complimentary;
        this.menus[i].takeaway = item.takeaway;
        this.menus[i].idiscprice = item.idiscprice;
        this.menus[i].idiscperc = item.idiscperc;
      }
    }
    var ordertype = localStorage.getItem('ordertype');
    var tax = 0;
    tax = this._taxAmount(ordertype, tax, item);
    item.tax_struct_id = tax;
    var cartProduct = this._productDetails(item);
    this.cartService.addToCart(cartProduct).then((val) => {
      this.taxcalculation(this.cartdetails);
      console.log(val);
      this.cartTotal();
    });
  }
  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [{
        text: 'Ok',
        handler: () => {

        }
      }
      ]
    });
    await alert.present();
  }
  billing() {
    let date = new Date();
    let todaysdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    let dayend = localStorage.getItem('dayenddate');
    if (todaysdate <= dayend) {

    } else {
      this.openToast("please close the previous day process before billing...and then continue");
      this.router.navigate(['dayend']);
    }
  }
  async kotPrint(orderid, ststype) {
    const modal = await this.modalController.create({
      component: KotbillPage,
      componentProps: {
        orderid: orderid,
        itemdetails: this.itemdetails,
        orderdetails: this.orderdetails,
        ststype: ststype,
        floorname: this.floorname,
        restid: this.restid,
        branchid: this.branchid
      }
    });
    modal.onDidDismiss().then((modelData) => {
      // this.ionViewDidEnter();
    });
    return await modal.present();
  }
  async handleButtonClick() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Settings',
      buttons: [{
        text: 'Customer-Info',
        handler: () => {
          this.custModal();
        }
      }, {
        text: 'Split-Bill',
        handler: () => {
          this.splitbill();
        }
      }, {
        text: 'Open Order',
        handler: () => {
          this.runningOrderModal();
        }
      }, {
        text: `Today's Order`,
      }, {
        text: 'Online Orders',
        handler: () => {
          this._onlineOrders();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      },
      ],
      mode: 'ios',
      animated: true
    });

    await actionSheet.present();
  }
  async otpVerification(status) {
    const popover = await this.popoverController.create({
      component: OtpAuthorizeComponent,
      componentProps: {
        restid: this.restid,
        branchid: this.branchid,
        status: status
      }
    });
    await popover.present();
    const data = await popover.onDidDismiss().then(popdata => {
      const data = popdata.data;
      if (data !== undefined) {
        let dateTime = new Date();
        let currenttime = this.datePipe.transform(dateTime, 'yyyy-MM-dd h:mm:ss');
        if (data.status === 'C') {
          this.cancelRemarks = data.remarks;
          this.cancelCategory = data.reasonid;
          this.cancelTime = currenttime
        } else {
          this.discRemarks = data.remarks;
          this.discReason = data.reasonid;
        }
        if (this.oneuiinstance === 'C') {
          this.saveorder('Y');
        } else {
          this.Hsaveorder('Y');
        }
      }
    })
  }
  async _onlineOrders() {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector("ion-backdrop")!)
        .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

      const wrapperAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector(".modal-wrapper")!)
        .keyframes([
          { offset: 0, opacity: "0", transform: "scale(0)" },
          { offset: 1, opacity: "0.99", transform: "scale(1)" }
        ]);

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing("ease-out")
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction("reverse");
    };
    const modal = await this.modalController.create({
      component: OnlineOrdersPage,
      componentProps: {
        restid: this.restid,
        branchid: this.branchid,
      },
      enterAnimation,
      leaveAnimation
    });
    return await modal.present();
  }
  loadOrderDetails() {
    let ordertype = localStorage.getItem('ordertype');
    let tableid = (localStorage.getItem('tableid') ? localStorage.getItem('tableid') : 0);
    if (this.ischecked == true) {
      this.orderdetails.push({
        restid: this.restid, branchid: this.branchid, billno: "", discper: this.discper, discprice: this.totaldiscountamount, userid: this.userid, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00", time: this.time, pickupbranchid: "1", transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.waiterid, captainid: this.captainid, noofpeople: this.noofpax,
        tableno: tableid, billedstatus: "N", settlement: "N", custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "I", cancelremarks: "", cancelcategory: 0, deliverydate: "", driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00", delvauthorized: "Y", discapprover: "", discreason: "", discremarks: "", redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y",
        cancelbilladminid: "", paymentmode: "", billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "", delprinted: "N", ccrefid: "0", areacode: "0", paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: "N", roomno: "0", rateus: "", ratecomments: "", notifysent: "N", modkot: "N", approvests: "N", deliveryremarks: "", canceltime: null, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N", custbillissue: "N", cashiersettled: "N", verifykot: "N", reprint: "N", hosync: "N", roundoff: "0.00",
        ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal, htldesk: "N", htlbookid: "", discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0", cardname: "", cardnumber: "", cardtype: "", floorid: "", ordfloorid: this.floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude, longitude: this.longitude, UIComp: 'Y'
      });
    }
    else {
      this.orderdetails.push({
        restid: this.restid, branchid: this.branchid, billno: "", discper: this.discper, discprice: this.totaldiscountamount, userid: this.userid, ordertype: ordertype, orderprice: this.subtotal, totalprice: this.grandtotal, redeemprice: "0.00", time: this.time, pickupbranchid: "1", transactionid: "", paymentid: "", paymentcode: "", usersmsSent: "", adminemailsent: "", transferstatus: "D", transferfrom: "", reason: "", statusrequest: "", waiterid: this.waiterid, captainid: this.captainid, noofpeople: this.noofpax,
        tableno: tableid, billedstatus: "N", settlement: "N", custname: this.cusname, custaddr: this.custaddr, custmob: this.cusnumber, custlandmark: "", custaddnum: "", custemail: this.cusemail, tokenno: "0", splittype: "N", billtype: "B", cancelremarks: "", cancelcategory: 0, deliverydate: "", driverid: "0", drivermob: "", createdby: "", deliverystart: "0000-00-00 00:00:00", delvauthorized: "Y", discapprover: "", discreason: "", discremarks: "", redeempoints: "0.00", verifycode: "", cashreceived: "N", transferdate: "", printkitchen: "Y",
        cancelbilladminid: "", paymentmode: "", billdate: this.billdate, pmcash: "0.00", pmcreditc: "0.00", billremarks: "", delprinted: "N", ccrefid: "0", areacode: "0", paystatus: "C", onlineref: this.onlirefid, customerpickup: "N", roomservice: "N", roomno: "0", rateus: "", ratecomments: "", notifysent: "N", modkot: "N", approvests: "N", deliveryremarks: "", canceltime: null, stockacc: "N", delvtimmediatesettle: "N", pmprepaid: "0.00", tips: "N", custbillissue: "N", cashiersettled: "N", verifykot: "N", reprint: "N", hosync: "N", roundoff: "0.00",
        ccadminaccept: "N", hosynccount: "0", agentname: "", drivername: "", dueamount: this.grandtotal, htldesk: "N", htlbookid: "", discby: this.discby, settlementtimeta: null, pmhtldesk: "0.00", pmothers: "0.00", pmoremarks: "", paymodeid: "0", cardname: "", cardnumber: "", cardtype: "", floorid: "", ordfloorid: this.floorid, deliverystatus: "M", advbooking: "N", flatno: this.flatno, latitude: this.latitude, longitude: this.longitude, UIComp: 'N'
      });
    }
  }
  cancelKOTForBluetooth(orderid, itemdetails) {
    var ordertype = localStorage.getItem('ordertype');
    var tablename = localStorage.getItem('tablename');
    var order_type = '';
    var restdetails = `SELECT a.branchname,a.fssaino,a.emailid,a.addr1,a.mobile1 AS mobile, b.restaurantname,b.gstaxno,a.phone1, c.orderid,c.billno,
    c.ordertype,c.custname,c.custaddr,c.custmob,c.custlandmark,c.tokenno,c.billedtime,c.discby,c.discper,c.discprice,c.tableno,c.totalprice,
    c.billtype,c.onlineref,c.roundoff,c.ordfloorid,c.agentname,d.descr AS refname,f.descr AS floorname
    FROM sr_orders_tbl c LEFT JOIN sr_onlinereferal_mstr d ON c.onlineref = d.id AND c.restid=d.restid AND c.branchid=d.branchid
    INNER JOIN sr_tablefloor_mstr f  ON  c.ordfloorid = f.id AND c.restid=f.restid AND c.branchid=f.branchid
    INNER JOIN  sr_branches_tbl a  ON f.restid=a.restid AND f.branchid=a.branchid
    INNER JOIN  sr_restaurants_tbl b ON a.restid=b.restid WHERE  a.branchid='${this.branchid}' AND a.restid=${this.restid} AND c.orderid=${orderid}`;
    this.sqlservice.restdetails(restdetails).then((res) => {
      var rest_details = res;

      if (ordertype == 'E') {
        order_type = rest_details[0].floorname + '- Dine-In';
      }
      else if (ordertype == 'P') {
        order_type = rest_details[0].floorname + '- TakeAway';
      }
      else if (ordertype == 'D') {
        order_type = rest_details[0].floorname + '- Delivery';
      }
      else {
        order_type = rest_details[0].floorname + ' - Self-Service';
      }

      if (ordertype == 'E') {
        var data = "";
        data += "Cancel KOT \n ";
        data += order_type + "\n Table NO :" + tablename + "\n Order ID :" + orderid;
      }
      else {
        var data = "";
        data += "Cancel KOT \n ";
        data += order_type + "\n Token NO :" + rest_details[0].tokenno + "\n Order ID :" + orderid;
      }
      if (this.captainid != '0') {
        var captainlist = JSON.parse(localStorage.getItem('captainlist'));
        for (var i = 0; i < captainlist.length; i++) {
          if (this.captainid == captainlist[i].id)
            data += "\nCaptain Name : " + captainlist[i].cname;
        }
      }
      if (this.waiterid != '0') {
        var waiterlist = JSON.parse(localStorage.getItem('waiter'));
        for (var i = 0; i < waiterlist.length; i++) {
          if (this.waiterid == waiterlist[i].empcode)
            data += "\nWaiter Name : " + waiterlist[i].wname;
        }
      }
      data += "\n-------------------------------";
      data += "\nItem Name                   QTY";
      data += "\n-------------------------------\n";
      for (var i = 0; i < itemdetails.length; i++) {
        if (itemdetails[i].modparent !== 0) {
          data += "*" + itemdetails[i].itemname + "\n";
        } else {
          data += itemdetails[i].itemname + "\n";
        }
        if (itemdetails[i].taenabled == 'Y')
          data += "(TakeAway)" + "\n";
        data += "                            " + itemdetails[i].itemqty + "\n";
      }
      this.datas = data;
      console.warn(this.datas)
      this.sendToBluetoothPrinter(this.kotIP, this.datas);
    });
  }
  openCustom(menutoggle) {
    console.log(menutoggle);
    if (menutoggle == 0) {
      this.menu.enable(true);
      this.menutoggle = 1;
    }
    else {
      this.menu.enable(false);
      this.menutoggle = 0;
    }
  }
  private getProductionCount(restid: number, branchid: string) {
    if (this.oneuiinstance === 'H') {
      let date = ({ restid: restid, branchid: branchid });
      this.apiService.getProductionCount(date).subscribe((result: any) => {
        this.productionDetails = result.data.productionDetails;
      }, (error) => {
        console.error("get prduction error in hybird model !!! - " + error.message);
      })
    }
  }
  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      this.ionViewDidEnter();
      event.target.complete();
    }, 2000);
  };
  getBillCount(restid: number, branchid: string, floorid: number) {
    let sql = `SELECT noofbills FROM sr_tablefloor_mstr WHERE restid = ${restid} AND branchid = '${branchid}' AND id = ${floorid}`;
    this.sqlservice._getValues(sql).then(async res => {
      this.billcount = res[0].noofbills;
    })
  }
}
