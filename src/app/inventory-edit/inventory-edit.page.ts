import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { inventory } from '../services/model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.page.html',
  styleUrls: ['./inventory-edit.page.scss'],
})

export class InventoryEditPage implements OnInit {

  @ViewChild('imageUpload',{ static : false }) imageUpload : ElementRef< HTMLInputElement >;

  userIsAdmin = this.authService.isAdmin();

  inventory = new inventory();
  imageData;
  imageType : 'base64' | 'blob';

  state = {
    saving: false
};
  constructor(private route : ActivatedRoute,
              private router : Router,
              private inventoryServ : InventoryService,
              private camera : Camera,
              private authService : AuthService,
              private platform : Platform) {

                this.route.paramMap
                  .pipe(
                    switchMap(params =>
                      // it combines two observables into one to obtain our result :D
                        combineLatest([ // wait for writing to finsh then start reading :D
                          this.inventoryServ.getById(params.get('id')),
                          this.route.queryParamMap // getting the parameters associated with it
                        ])
                    ),
                        map(([data, queryParams] : [inventory, any]) => {
                          console.log('queryParams', data, queryParams);
                          if(data){
                            console.log(data)
                            this.inventory = data;
                            this.imageData = this.inventory.imageUrl
                          } else{
                            this.inventory = new inventory();
                            this.inventory.code = queryParams.get('code');
                          }
                        })
                        ).subscribe();
   }

  ngOnInit() {
  }

  save(){
    this.state.saving = true;
    this.inventoryServ.saveInventory(this.inventory,this.imageData, this.imageType).then(()=>{
      this.state.saving = false;
      window.history.back(); // go back to list page :D 
    })
  }
  // adding a quantity
  addQty(){
    this.inventory.quantity++;
  }

  // removing a quantity
  removeQty(){
    if(this.inventory.quantity == 0) return;
    this.inventory.quantity--;
  }
   launchCamera(){
    if(this.platform.is('mobile')){
      const options : CameraOptions = {
        quality : 100,
        destinationType : this.camera.DestinationType.DATA_URL,
        encodingType : this.camera.EncodingType.JPEG,
        targetHeight : 250,
        correctOrientation : true,
        sourceType: this.camera.PictureSourceType.CAMERA,
        mediaType : this.camera.MediaType.PICTURE
      };

      let imageData;
      imageData =  this.camera.getPicture(options).then(imageData=>{
        const base64Image = 'data:image/jpeg;base64,' + imageData;
        this.imageData = base64Image;
        this.imageType = 'base64';
        this.inventory.imageUrl = base64Image; // adding an image string to our inventory
      });

    }
    else { // we are in browswer so we upload an image instead :D .
      console.log('this.imageUpload', this.imageUpload);
      this.imageUpload.nativeElement.click();
    }
  }

  uploadImage(event){
    const preview = URL.createObjectURL(event.target.files[0]);
    console.log('uploadImage()', event.target.files[0],URL.createObjectURL(event.target.files[0]));
    this.imageData = event.target.files[0]; // for image blob will be uploaded to firestorage (permenant)
    console.log("image data", this.imageData)
    this.inventory.imageUrl = preview; // image url for previewing only at real time then will be modified by firestorage link  :D 
    this.imageType = 'blob';
  }


  async delete(id){
    await this.inventoryServ.deleteInventory(id);
    this.router.navigate(['']);
  }



}
