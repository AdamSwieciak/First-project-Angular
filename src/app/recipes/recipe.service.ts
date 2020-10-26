import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Recipe} from './recipe.module'
import { Ingredient } from '../shared/ingredient.model';
import { Store } from '@ngrx/store';
import * as ShoppingListActions  from '../shopping-list/store/shopping-list.actions'
import * as fromApp from '../store/app.reducer'

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>()

  // private recipes: Recipe[] =[
  //   new Recipe('Pizza', 'this is', 'https://s3.przepisy.pl/przepisy3ii/img/variants/800x0/pizza-grecka.jpg', [
  //     new Ingredient('Meat', 1),
  //     new Ingredient ('salad', 3)
  //   ] ),
  //   new Recipe('Pasta', 'this is', 'https://hips.hearstapps.com/delish/assets/17/36/1504715566-delish-fettuccine-alfredo.jpg', [
  //     new Ingredient('Ham', 5),
  //     new Ingredient('Chees', 1) 
  //   ] )
  // ];

  private recipes: Recipe[] = []

  constructor(
    private store: Store<fromApp.AppState>
    ) { }

  getRecipes() {
    return this.recipes.slice()
  }

  getRecipe(index: number) {
    return this.recipes[index]
  }

  adNewIngredients(ingredients: Ingredient[]) {
    //this.shoppingService.adNewIngredients(ingredients)
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))

  }

  addRecipes(recipe: Recipe) {
  this.recipes.push(recipe)
  this.recipesChanged.next(this.recipes.slice())
  }

  updateRecipe(index: number, newrecipe: Recipe) {
  this.recipes[index] = newrecipe
  this.recipesChanged.next(this.recipes.slice())
  }

  deleteRecipes(id: number) {
    this.recipes.splice(id, 1);
    this.recipesChanged.next(this.recipes.slice())
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes
    this.recipesChanged.next(this.recipes.slice())
  }

}
