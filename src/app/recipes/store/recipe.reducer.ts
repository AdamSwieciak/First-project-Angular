import { Recipe } from "../recipe.module";
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
        }

        default:
            return state
    }
} 