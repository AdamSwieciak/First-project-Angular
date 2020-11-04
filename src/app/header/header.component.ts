import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from '../auth/store/auth.action';
import * as RecipeActions from '../recipes/store/recipe.action';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription
  isAuthenticated = false

  constructor(
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
    //this.httpService.storeRecipes()
    this.store.dispatch(new RecipeActions.StoreRecipes())
  }

  fetchData() {
    //this.httpService.fetchRecipes().subscribe()
    this.store.dispatch(new RecipeActions.FetchRecipes())
  }
  
  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  onLogout() {
    this.store.dispatch(new AuthAction.Logout())
  }
}
