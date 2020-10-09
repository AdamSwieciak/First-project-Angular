import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private httpService: DataStorageService) { }

  ngOnInit(): void {
  }

  postData() {
    this.httpService.storeRecipes()
  }

  fetchData() {
    this.httpService.fetchRecipes().subscribe()
  }

}
