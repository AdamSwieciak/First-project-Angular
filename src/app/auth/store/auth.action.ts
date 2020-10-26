import { Action } from '@ngrx/store'

export const LOGIN_START = '[AUTH] LOGIN_START'
export const AUTHENTICATE_SUCESS = '[AUTH] AUTHENTICATE_SUCESS'
export const AUTHENTICATE_FAIL = '[AUTH] AUTHENTICATE_FAIL'
export const SINGUP_START = '[AUTH] SINGUP_START'
export const LOGOUT = '[AUTH] LOGOUT'
export const CLEAR_ERROR = '[AUTH] CLEAR_ERROR'
export const AUTO_LOGIN = '[AUTH] AUTO_LOGIN'


    export class AuthenticateSucess implements Action {
        readonly type = AUTHENTICATE_SUCESS

        constructor(
            public payload: {
            email: string;
            userId: string; 
            token: string; 
            expirationDate: Date;
            }) {}
    }

    export class Logout implements Action {
        readonly type = LOGOUT
    }

    export class LoginStart implements Action {
        readonly type = LOGIN_START

        constructor(public payload:{email: string, password: string}) {}
    }

    export class AuthenticateFail implements Action {
        readonly type = AUTHENTICATE_FAIL;

        constructor(public payload: string){}
    }

    export class SingupStart implements Action {
        readonly type = SINGUP_START

        constructor(public payload:{email: string, password: string}) {}
    }

    export class CleareError implements Action {
        readonly type = CLEAR_ERROR
    }

    export class AutoLogin implements Action {
        readonly type = AUTO_LOGIN    
    }


export type AuthAction =
AuthenticateSucess |
Logout |
LoginStart |
AuthenticateFail |
SingupStart |
CleareError |
AutoLogin