import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {Subscription } from 'rxjs';
import {Ingredient} from "../../shared/ingredient.model";
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
editedItemIndex: number;
editedItem: Ingredient

  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit(): void {
this.subscription = this.shoppingService.startingEditing.subscribe(
  (index: number) => {
    this.editedItemIndex=index
    this.editMode= true
    this.editedItem= this.shoppingService.getIngredient(index)
    this.slForm.setValue({
      name: this.editedItem.name,
      amount: this.editedItem.amount
    })
  }
);

  }
  onSubmit(form: NgForm) {
    const value=form.value
    const newIngredient = new Ingredient(value.name, value.amount)
    if (this.editMode) {
      this.shoppingService.updateIngredient(this.editedItemIndex, newIngredient)
    } else {
      this.shoppingService.onAddIngred(newIngredient)
    }    
    this.editMode=false;
    form.reset()
  }

  onClear(){
    this.shoppingService.onClearIngredients()
    this.slForm.reset()
    this.editMode=false;
  }

  onDelete(){
    this.shoppingService.deleteIngredients(this.editedItemIndex);
    this.editMode=false;
    this.slForm.reset()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
