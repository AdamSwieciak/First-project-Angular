import {Action } from '@ngrx/store'
import { Recipe } from '../recipe.module';

export const SET_RECIPES = '[RECIPES] SET_RECIPES'


export class SetRecipe implements Action {
    readonly type = SET_RECIPES;

    constructor(public payload: Recipe[]) {}
}

export type RecipesActions = SetRecipe