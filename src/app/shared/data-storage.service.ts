import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.module';
import { exhaustMap, map, tap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeServis: RecipeService, private authServ: AuthService) { }
  
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
      this.recipeServis.setRecipes(recipes)})
    )
  }

}
