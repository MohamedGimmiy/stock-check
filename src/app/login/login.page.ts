import { Component, OnInit } from '@angular/core';
import { FirebaseAuth } from '@angular/fire';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private auth : AuthService,
              private router : Router) {
   }

  ngOnInit() {

  }

}
