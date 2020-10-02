import { Injectable, EventEmitter } from '@angular/core';
import {Recipe} from '../recipes/recipe.model'
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeSeceted= new EventEmitter<Recipe>();

  private recipes: Recipe[] =[
    new Recipe('Pizza', 'this is', 'https://s3.przepisy.pl/przepisy3ii/img/variants/800x0/pizza-grecka.jpg', [
      new Ingredient('Meat', 1),
      new Ingredient ('salad', 3)
    ] ),
    new Recipe('Pasta', 'this is', 'https://hips.hearstapps.com/delish/assets/17/36/1504715566-delish-fettuccine-alfredo.jpg', [
      new Ingredient('Ham', 5),
      new Ingredient('Chees', 1) 
    ] )
  ];

  constructor(private shoppingService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice()
  }

  getRecipe(index: number) {
    return this.recipes[index]
  }

  adNewIngredients(ingredients: Ingredient[]) {
    this.shoppingService.adNewIngredients(ingredients)
  }
}
