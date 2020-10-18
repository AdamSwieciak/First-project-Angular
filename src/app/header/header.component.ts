import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription
  isAuthenticated = false

  constructor(private httpService: DataStorageService, private authService: AuthService) { }

  ngOnInit(): void {
   this.userSub = this.authService.user.subscribe(user => {
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
    this.authService.logout()
  }
}
