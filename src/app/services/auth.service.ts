import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth, User } from 'firebase';
import { BehaviorSubject, of } from 'rxjs';
import { UserProfile } from './model';
import { map, concatMap, combineLatest, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Myuser;
  user$ = new BehaviorSubject<UserProfile>(null);
  constructor(public afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private router : Router) {
    console.log("logging")
    // if there is no user (error) go to sign in
    // else obtain user data if user is the first time to sign in (create profile ) else but it into observable
    /* this.afAuth.user
      .pipe(
        concatMap(user => {
          if (user) {
            throw Error;
          }
          return combineLatest([
            this.db
              .collection('users')
              .doc(user.email)
              .get(),
            of(user)
          ]);
        })
      )
      .subscribe(
        ([profileSnapshot, user] : any) => {
          console.log('user', profileSnapshot.data(), user);
          if (profileSnapshot.exists) {
            this.user$.next(profileSnapshot.data() as UserProfile);
          } else {
            this.user$.next({
              email: user.email
            });
            this.createUser(user.email);
          }
        },
        err => this.signIn()
      ); */


      /* if(!this.Myuser)
        this.signIn(); */
  }


  // Note we used sign in with redirect , but on desktop we use sign in with popup
   signIn() {
    const provider = new auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    this.afAuth.auth.signInWithRedirect(provider).then(()=>{
      this.afAuth.auth.getRedirectResult().then(result=>{
        if(result.credential){
          var token = result.credential.providerId;
          console.log("token",token);
        }

        var user = result.user;
        this.Myuser = result.user;
        console.log('user ' + user);
        this.router.navigate(['/inventory-list']);
      })
    });
  }

  // create a new user
  createUser(email) {

    return this.db
      .collection('users')
      .doc(email)
      .set({ email })
  }

  // is Admin user ? it returns a boolean value :D.
  isAdmin() {
    return this.user$.pipe(map(u => u && u.isAdmin));
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

}


