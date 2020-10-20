import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { UserModule } from "./user.module";
import { Router } from "@angular/router";
import {environment } from '../../environments/environment'

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
  })
export class AuthService {
    user = new BehaviorSubject<UserModule>(null)
    token: string = null
    private tokenExpirationTimer: any

    constructor(private http: HttpClient, private router: Router) {    }

    singUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
             {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(resData =>{
                this.handleAuthenticate(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            }));
        }

        login(email: string, password: string) {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(resData =>{
                this.handleAuthenticate(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            }))
        }

        autoLogin() {
            const userData: {
                email: string,
                id: string,
                _token: string,
                _tokenExpirationData: string
            } = JSON.parse(localStorage.getItem('userData'))
            //console.log(userData)
            if (!userData) {
                return 
            } 
            const loadedUser = new UserModule(
                userData.email,
                userData.id,
                userData._token, 
                new Date(userData._tokenExpirationData)
                );
                //console.log(loadedUser)

                if(loadedUser.token) {
                    const expirationDuration = new Date(userData._tokenExpirationData).getTime() - new Date().getTime()
                    this.autoLogout(expirationDuration)
                    this.user.next(loadedUser)
                }
        }

        logout() {
            this.user.next(null)
            this.router.navigate(['/auth'])
            localStorage.removeItem('userData')
            if (this.tokenExpirationTimer) {
                clearTimeout(this.tokenExpirationTimer)
            }
            this.tokenExpirationTimer = null
        }

        autoLogout(expirationDuration: number) {
            this.tokenExpirationTimer = setTimeout(() => {
                this.logout()
            },expirationDuration)
        }

        

        private handleAuthenticate(
            email: string, 
            userId: string, 
            token: string, 
            expiresIn: number) {
            const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
                const user = new UserModule(
                    email, 
                    userId, 
                    token, 
                    expirationDate)
                    this.user.next(user)
                    this.autoLogout(expiresIn * 1000)
                    localStorage.setItem('userData', JSON.stringify(user))
        }

        private handleError(errorRes: HttpErrorResponse) {
            console.log(errorRes)
            let errorMessage = 'An unknow error occured!'
            if (!errorRes.error || !errorRes.error.error){
                return throwError(errorMessage)
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
                return throwError(errorMessage);
        }
        

 }