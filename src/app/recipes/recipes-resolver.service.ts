import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";

@Injectable({
    providedIn: 'root'
  })
  export class RecipeResolver implements Resolve<Recipe[]> {
      constructor(private dataStorage: DataStorageService, private recipeServis: RecipeService) {}

      resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            const recipes = this.recipeServis.getRecipes();
            if(recipes.length === 0) {
                return this.dataStorage.fetchRecipes()
            } else {
                return recipes
            }
      }

  }