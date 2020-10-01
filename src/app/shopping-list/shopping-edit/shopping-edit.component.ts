import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput') nameInputRef: ElementRef;
  @ViewChild('amountInput') nameAmountRef: ElementRef;

  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit(): void {
  }
  onAdditems() {
    const ingName= this.nameInputRef.nativeElement.value
    const ingAmount= this.nameAmountRef.nativeElement.value
    this.shoppingService.onAddIngred(new Ingredient(ingName, ingAmount))
  }

}
