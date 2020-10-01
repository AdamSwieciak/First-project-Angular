import { Injectable, EventEmitter } from '@angular/core';
import {Ingredient} from '../shared/ingredient.model'

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
ingrediensChanged= new EventEmitter<Ingredient[]>();
  private ingredients: Ingredient[] = [];

  onAddIngred(data: Ingredient){
    this.ingredients.push(data)
    this.ingrediensChanged.emit(this.ingredients.slice())
      }

  onGetData(){
    return this.ingredients.slice()
  }
  adNewIngredients(ingredients: Ingredient[]){
    // for (let ingredient of ingredients) {
    //   this.adNewIngredients(ingredient)
    // }
    this.ingredients.push(...ingredients)
    this.ingrediensChanged.emit(this.ingredients.slice())
  }    
}
