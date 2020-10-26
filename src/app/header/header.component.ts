import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from '../auth/store/auth.action';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription
  isAuthenticated = false

  constructor(
    private httpService: DataStorageService, 
    private authService: AuthService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
   this.userSub = this.store.select('auth')
   .pipe(map( authState => authState.user))
   .subscribe(user => {
     //console.log(user)
     //this.isAuthenticated = !user ? false : true;
     this.isAuthenticated = !!user
   })
  }

  postData() {
    this.httpService.storeRecipes()
  }

  fetchData() {
    this.httpService.fetchRecipes().subscribe()
  }
  
  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  onLogout() {
    this.store.dispatch(new AuthAction.Logout())
  }
}
