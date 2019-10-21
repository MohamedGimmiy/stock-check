import { Injectable, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AuthService } from './auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FcmService implements OnInit {

  constructor(private afMessaging : AngularFireMessaging,
              private auth : AuthService,
              private toast : ToastController,
              private router : Router) {

               }

    // initializing firebase messaging
    ngOnInit(){
      const messaging = firebase.messaging();
      messaging.usePublicVapidKey(environment.firebaseConfig.vapidKey);
      this.afMessaging.messaging.subscribe(message=>{
        message.onMessage = message.onMessage.bind(message);
        message.onTokenRefresh = message.onTokenRefresh.bind(message);
      })
      
    }
}
