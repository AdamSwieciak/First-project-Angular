import {Ingredient} from '../../shared/ingredient.model'
import * as ShoppingListActions  from './shopping-list.actions'

    export interface State {
        ingredients: Ingredient[],
        editedIngredient: Ingredient,
        editIngredientIndex: number
    }

    const initialState: State = {
    ingredients: [
        new Ingredient('Aples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,
    editIngredientIndex: -1
    }

    export function shoppingListReducer(
    state: State= initialState, 
    action: ShoppingListActions.ShoppingListActions
    ) {
    switch (action.type) {

        case ShoppingListActions.ADD_INGREDIENT:

            console.log(action.payload)
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            }

        case ShoppingListActions.ADD_INGREDIENTS:

            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            }

        case ShoppingListActions.UPDATE_INGREDIENT:

            const ingredient = state.ingredients[state.editIngredientIndex]
            const updateIngredient = {
                ...action.payload
            }
            const updatedIngredients = [...state.ingredients]
            updatedIngredients[state.editIngredientIndex] = updateIngredient


            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredient: null,
                editIngredientIndex: -1
            }

        case ShoppingListActions.DELETE_INGREDIENT:
        
            return {
            ...state,
            ingredients: state.ingredients.filter((ig , igIndex) => {
                return igIndex !== state.editIngredientIndex
            }),
            editedIngredient: null,
            editIngredientIndex: -1
            }

        case ShoppingListActions.START_EDIT:
            return {
            ...state,
            editIngredientIndex: action.payload,
            editedIngredient: {...state.ingredients[action.payload]}
            }

        case ShoppingListActions.STOP_EDIT:
        
            return {
            ...state,
            editedIngredient: null,
            editIngredientIndex: -1
            }

        default:
            return state
    }
}