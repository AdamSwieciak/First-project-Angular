import {Action } from '@ngrx/store'
import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[RECIPES] SET_RECIPES'
export const FETCH_RECIPES = '[RECIPES] FETCH_RECPIES'
export const ADD_RECIPE = '[RECIPES] ADD_RECIPE'
export const UPDATE_RECIPES = '[RECIPES] UPDATE_RECIPES'
export const DELETE_RECIPES = '[RECIPES] DELETE_RECIPES'
export const STORE_RECIPES = '[RECIPES] STORE_RECIPES'


export class SetRecipes implements Action {
    readonly type = SET_RECIPES;

    constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
    readonly type = ADD_RECIPE

    constructor(public payload: Recipe){}
}

export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPES

    constructor(public payload: {index: number, newrecipe: Recipe}){}
}

export class DeleteRecipe implements Action {
    readonly type = DELETE_RECIPES

    constructor(public payload: number){}
}

export class StoreRecipes implements Action {
    readonly type = STORE_RECIPES

}

export type RecipesActions = 
SetRecipes | 
FetchRecipes |
AddRecipe |
UpdateRecipe |
DeleteRecipe |
StoreRecipes
;