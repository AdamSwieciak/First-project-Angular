import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { UserModule } from '../user.module';
import * as AuthAction from './auth.action'

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (
    expiresIn: number, 
    email: string, 
    userId: string, 
    token: string) => {
    const expirationDate = new Date(
        new Date().getTime() + expiresIn * 1000
        );
    const user = new UserModule(email, userId, token, expirationDate)
    localStorage.setItem('userData', JSON.stringify(user))
    return new AuthAction.AuthenticateSucess({
        email: email, 
        userId: userId, 
        token: token, 
        expirationDate: expirationDate})
}

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknow error occured!'
    if (!errorRes.error || !errorRes.error.error){
        return of (new AuthAction.AuthenticateFail(errorMessage))
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exist alredy'
            break
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email not found'
            break
        case 'INVALID_PASSWORD':
            errorMessage = 'Wrong password'
            break
        case 'USER_DISABLED':
            errorMessage = 'User was blocked'
            break
        }
        return of(new AuthAction.AuthenticateFail(errorMessage))
}

@Injectable ()

export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthAction.SINGUP_START),
        switchMap((singupAction: AuthAction.SingupStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                 {
                    email: singupAction.payload.email,
                    password: singupAction.payload.password,
                    returnSecureToken: true
                }).pipe(
                    tap(resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                   }),
                    map(resData => {
                        return handleAuthentication(
                            +resData.expiresIn, 
                            resData.email, 
                            resData.localId,
                            resData.idToken)
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes)
                    })
                )  
        }
        )
    )

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthAction.LOGIN_START),
        switchMap((authData: AuthAction.LoginStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            }).pipe(
                    tap(resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                   }),
                    map(resData => {
                        return handleAuthentication(
                            +resData.expiresIn, 
                            resData.email, 
                            resData.localId,
                            resData.idToken)
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes)
                    })
                )   
        }),

        )

        @Effect({dispatch: false})
        authRedirected = this.actions$.pipe(
            ofType(AuthAction.AUTHENTICATE_SUCESS), 
            tap(() => {
                    this.router.navigate(['/']);
                }
            )
        )

        @Effect()
        autoLogin = this.actions$.pipe(
            ofType(AuthAction.AUTO_LOGIN),
            map(() => {
                const userData: {
                    email: string,
                    id: string,
                    _token: string,
                    _tokenExpirationData: string
                } = JSON.parse(localStorage.getItem('userData'))
                //console.log(userData)
                if (!userData) {
                    return {type: 'DUMMY'}
                } 
    
                const loadedUser = new UserModule(
                    userData.email,
                    userData.id,
                    userData._token, 
                    new Date(userData._tokenExpirationData)
                    );
                    //console.log(loadedUser)
    
                    if(loadedUser.token) {
                        const expirationDuration = 
                        new Date(userData._tokenExpirationData).getTime() - 
                        new Date().getTime()
                        this.authService.setLogoutTimer(expirationDuration)
                        return new AuthAction.AuthenticateSucess({
                            email: loadedUser.email,
                            userId: loadedUser.id,
                            token: loadedUser.token,
                            expirationDate: new Date(userData._tokenExpirationData)
    
                        })
                        // const expirationDuration = 
                        // new Date(userData._tokenExpirationData).getTime() - 
                        // new Date().getTime()
                        // this.autoLogout(expirationDuration)
                    }
                    return {type: 'DUMMY'}
            })
        )

        @Effect({dispatch: false})
        authLogout = this.actions$.pipe(
            ofType(AuthAction.LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer()
                localStorage.removeItem('userData')
                this.router.navigate(['/auth'])
            })
        )
    
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}


}