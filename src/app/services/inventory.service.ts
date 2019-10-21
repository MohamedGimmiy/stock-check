import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { inventory } from './model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  // observable of inventory array
  inventories$ = new BehaviorSubject<inventory[]>([]);

  // filtering inventories for zero quantity using queries :D.
  lowInventories$ : Observable<inventory[]> = this.db
    .collection('Inventory', ref => ref.where('quantity','==',0))
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(
          i => ({id : i.payload.doc.id, ...i.payload.doc.data()} as inventory)
        ))
    )
  constructor(private db: AngularFirestore,
    private afStorage: AngularFireStorage) {
    this.getInventories();
  }

  // Note we use snapshot to get metaData + data save ( using for CRUD)
  // but we use valueChanges to get just data

  getInventories() {
    // to get [ ids + data( json)] as inventory (see firebase tree)
    console.log("inventory")
    this.db.collection('Inventory')
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => {
            console.log("Inventory", action.payload.doc.id)
            return {
              id: action.payload.doc.id,
              ...action.payload.doc.data() // getting all data with its keys :D so we used ...
            } as inventory;
          }))
      )
      .subscribe((inventories: inventory[]) => {
        console.log("inventories we're adding", inventories);
        this.inventories$.next(inventories);
      })
  }

  // get inventory by id from an observable :D
  getById(id): Observable<inventory> {
    return this.inventories$.pipe(
      map(inventories => inventories.find(i => i.id === id))
    );
  }


  //---------------- saving to inventory ------------------//

  async saveInventory(inventory: inventory, imgBlob?, imageType?: 'base64' | 'blob'): Promise<any> {
    console.log('...saving', inventory);

    inventory = this.copy(inventory);
    console.log(imgBlob, imageType)
    if (imgBlob && imageType) {

      const filePath = Date.now().toString(); // random file path name of firebase storage :D 
      const fileRef = this.afStorage.ref(filePath); // making a refrence to firebase storage :D

      console.log('fileRef', fileRef);
      console.log("date.now", filePath);
      // uploading our image into angular fire storage
      let task: AngularFireUploadTask;
      console.log("image blob", imgBlob);

      if (imageType === 'blob') {
        console.log("uploading1..........")
        // uploading image blob
        task = this.afStorage.upload(filePath, imgBlob);

      } else if (imageType === 'base64') {
        console.log("uploading2..........",imgBlob);
  
        //task = fileRef.putString(imgBlob, 'base64');
      }

      console.log('afStorage', task);
      // wait for imageUrl to be saved :D 
      console.log("snapppppppppppppp");

      // wait untill we obtain the url ,  // get notified when the download URL is available
      if(imageType ==='blob'){
        const imageUrl = await task.then().then(() => Promise.resolve(fileRef.getDownloadURL().toPromise()));
        console.log('imageUrl', imageUrl);
        inventory.imageUrl = imageUrl;
      } else {
        inventory.imageUrl = imgBlob;
      }


    }
    let saving;
    if (inventory.id) {
      saving = this.db
        .collection('Inventory')
        .doc(inventory.id)
        .set(inventory); // if we have a copy we just replace it :D (update)
    } else {
      saving = this.db.collection('Inventory').add(inventory); // if not we add a new inventory
    }
    return saving;
  }

  // copying our object
  copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // delete
  async deleteInventory(id){
    return this.db.collection('Inventory').doc(id).delete();
  }





}
