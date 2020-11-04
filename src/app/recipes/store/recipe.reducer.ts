import { act } from "@ngrx/effects";
import { Recipe } from "../recipe.model";
import * as RecipeActions from './recipe.action'

export interface State {
    recipes: Recipe[]
}

const initalState: State = {
    recipes: []
}

export function recipeReducer(
    state = initalState, 
    action: RecipeActions.RecipesActions
    ) {
    switch (action.type) {

        case RecipeActions.SET_RECIPES:
            return {
                ...state, 
                recipes: [...action.payload]
            };
        case RecipeActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case RecipeActions.UPDATE_RECIPES:
            const updateRecipe = {
                ...state.recipes[action.payload.index], 
                ...action.payload.newrecipe
            }
            const updateRecipes = [...state.recipes]
            updateRecipes[action.payload.index] = updateRecipe

            return{
                ...state,
                recipes: updateRecipes
            };
        case RecipeActions.DELETE_RECIPES:
            return{
                ...state,
                recipes: state.recipes.filter((recipes, index) => {
                    return index !== action.payload
                })
            }

        default:
            return state
    }
} 