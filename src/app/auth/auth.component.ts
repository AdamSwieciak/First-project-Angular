import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true
  isLoading: boolean = false
  error: string = null

  constructor(private authServiece: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm){
    if (!form.valid) {
      return
    }
    const email = form.value.email
    const password = form.value.password

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true
    if (this.isLoginMode) {
      authObs = this.authServiece.login(email, password)
    } else {
      authObs = this.authServiece.singUp(email, password)
    }

    authObs.subscribe(
      resData => {
        console.log(resData)
        this.isLoading = false
        this.router.navigate(['/recipes'])
      }, errorMessage => {
        console.log(errorMessage)
        this.error = errorMessage
        this.isLoading = false
      })

    form.reset()
    this.error = null
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

}
