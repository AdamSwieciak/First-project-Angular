import { HttpClient } from '@angular/common/http'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { map, switchMap, withLatestFrom } from 'rxjs/operators'

import * as RecieActions from './recipe.action'
import * as fromApp from '../../store/app.reducer'
import { Recipe } from '../recipe.model'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'


@Injectable()
export class RecipeEffect {
    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecieActions.FETCH_RECIPES), 
        switchMap(() => {
            return this.http
            .get<Recipe[]>(
              'https://recipesbook-59640.firebaseio.com/recipes.json'
              )
        }),
        map(recipes => {
            return recipes.map(recipe => {
              return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            }
          });
        }),
        map(recipes => {
            return new RecieActions.SetRecipes(recipes)
        })
        )

    @Effect({dispatch: false})
    storeRecipes = this.actions$.pipe(
      ofType(RecieActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
        return this.http
        .put('https://recipesbook-59640.firebaseio.com/recipes.json',
         recipesState.recipes
         )
      })
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
        ) {}
}