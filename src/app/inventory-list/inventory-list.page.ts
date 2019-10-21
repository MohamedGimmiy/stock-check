import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { tap } from 'rxjs/internal/operators/tap';
import { Platform, MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.page.html',
  styleUrls: ['./inventory-list.page.scss'],
})
export class InventoryListPage implements OnInit {
  code;

  // printing the recieved data + ids from the observable behavior (inventories$)
  public inventories$ = this.inventoryService.inventories$.pipe(
    tap(data=> console.log('getting inventories$', data) )
  )
  constructor(private baracodeScanner : BarcodeScanner,
              private router : Router,
              private platform : Platform,
              private inventoryService : InventoryService,
              private menu : MenuController,
              private afAuth : AuthService) {
              }

  ngOnInit() {
  }

  // platform scanner :D

  async openBaracodeScanner(){

    if(this.platform.is("android")){
      let result = await this.baracodeScanner.scan();
      const code = result.text;
      this.goToInventory('new', { code } );
      alert(this.code);
    } else {
      this.goToInventory('new',{code : '1234'});
    }

  }

  goToInventory(id, params = {}){
    this.router.navigate(['/inventory-edit',id],{
      queryParams : params
    });
  }

  openMenu(){
    this.menu.toggle();
  }
}
