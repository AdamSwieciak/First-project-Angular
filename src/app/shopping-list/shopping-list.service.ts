import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Ingredient} from '../shared/ingredient.model'

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  startingEditing = new Subject<number>()
  ingrediensChanged= new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [];

  onAddIngred(data: Ingredient){
    this.ingredients.push(data)
    this.ingrediensChanged.next(this.ingredients.slice())
      }

  onGetData(){
    return this.ingredients.slice()
  }

  onClearIngredients() {
    this.ingredients=[]
    this.ingrediensChanged.next(this.ingredients.slice())
  }

  getIngredient(index: number) {
    return this.ingredients[index]
  }

  adNewIngredients(ingredients: Ingredient[]){
    // for (let ingredient of ingredients) {
    //   this.adNewIngredients(ingredient)
    // }
    this.ingredients.push(...ingredients)
    this.ingrediensChanged.next(this.ingredients.slice())
  }   
  
  updateIngredient(id: number, newIngredient: Ingredient) {
    this.ingredients[id]=newIngredient
    this.ingrediensChanged.next(this.ingredients.slice())
  }

  deleteIngredients(id: number) {
    this.ingredients.splice(id, 1)
    this.ingrediensChanged.next(this.ingredients.slice())
  }
}
