import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.module';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import * as RecipesAction from '../recipes/store/recipe.action'

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private http: HttpClient, 
    private recipeServis: RecipeService,
    private store: Store<fromApp.AppState>
    ) { }
  
  storeRecipes() {
    const recipes = this.recipeServis.getRecipes()
    return this.http.put('https://recipesbook-59640.firebaseio.com/recipes.json', recipes).
    subscribe(req => {
      console.log(req)
    })
  }

  fetchRecipes() {
      return this.http
      .get<Recipe[]>(
        'https://recipesbook-59640.firebaseio.com/recipes.json'
        )
      .pipe(
       map(recipes => {
      return recipes.map(recipe => {
        return {
        ...recipe,
        ingredients: recipe.ingredients ? recipe.ingredients : []
      }
    });
  }), 
    tap(recipes =>{ 
      // this.recipeServis.setRecipes(recipes)
      this.store.dispatch(new RecipesAction.SetRecipe(recipes))
    })
    )
  }

}
