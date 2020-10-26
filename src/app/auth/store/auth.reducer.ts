import { UserModule } from '../user.module'
import * as AuthAction from './auth.action'

export interface State {
    user: UserModule
    authError: string
    loading: boolean
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
}

export function authreducer(
    state: State = initialState,
    action: AuthAction.AuthAction
) {
    switch(action.type){

        case AuthAction.AUTHENTICATE_SUCESS:
        const user = new UserModule(
            action.payload.email,    
            action.payload.userId,   
            action.payload.token,   
            action.payload.expirationDate )    
            return {
                ...state,
                authError: null,
                user: user,
                loading: false
            }

        case AuthAction.LOGOUT:
            return {
                ...state,
                user: null
            }

        case AuthAction.LOGIN_START:
        case AuthAction.SINGUP_START:
            return {
                ...state,
                authError: null,
                loading: true
            }

        case AuthAction.AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            }

        case AuthAction.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            }

        case AuthAction.AUTO_LOGIN:
            return {
                ...state,
                
            }

        default:
        return state
    }

  
}