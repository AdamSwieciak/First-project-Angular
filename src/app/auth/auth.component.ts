import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directives';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true
  isLoading: boolean = false
  error: string = null
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective

  private closeSub: Subscription

  constructor(
    private authServiece: AuthService, 
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) { }

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
        // console.log(errorMessage)
        this.error = errorMessage
        this.showErrorAlert(errorMessage)
        this.isLoading = false
      })

    form.reset()
    this.error = null
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onHandelError() {
    this.error = null
  }

  private showErrorAlert(message: string) {
  //  const alertCmp = new AlertComponent();
  const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
  
  const hostViewContainerRef = this.alertHost.viewContainerRef
  
  hostViewContainerRef.clear()
  
  const componentRef = hostViewContainerRef.createComponent(alertCmpFactory)
  
  componentRef.instance.message = message
  this.closeSub = componentRef.instance.close.subscribe(() => {
    this.closeSub.unsubscribe()
    hostViewContainerRef.clear()
  })

  }
  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
  }
}
