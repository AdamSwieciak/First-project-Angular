import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { UserModule } from "./user.module";
import { Router } from "@angular/router";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    experesIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
  })
export class AuthService {
    user = new BehaviorSubject<UserModule>(null)
    token: string = null

    constructor(private http: HttpClient, private router: Router) {    }

    singUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDYt7uj63ikRCZ1CRmvAK1neETQdOJWvuo',
             {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(resData =>{
                this.handleAuthenticate(resData.email, resData.localId, resData.idToken,+resData.experesIn)
            }));
        }

        login(email: string, password: string) {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDYt7uj63ikRCZ1CRmvAK1neETQdOJWvuo',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(resData =>{
                this.handleAuthenticate(resData.email, resData.localId, resData.idToken,+resData.experesIn)
            }))
        }

        autoLogin() {
            const userData: {
                email: string,
                id: string,
                _token: string,
                _tokenExpirationData: string
            } = JSON.parse(localStorage.getItem('userData'))
            console.log(userData)
            if (!userData) {
                return 
            } 
            const loadedUser = new UserModule(
                userData.email,
                userData.id,
                userData._token, 
                new Date(userData._tokenExpirationData)
                );

                if(loadedUser._token) {
                    this.user.next(loadedUser)
                }
        }

        logout() {
            this.user.next(null)
            this.router.navigate(['/auth'])
        }

        private handleAuthenticate(email: string, userId: string, token:string, experesIn: number) {
            const expirationDate = new Date(new Date().getTime() + experesIn * 1000)
                const user = new UserModule(
                    email, 
                    userId, 
                    token, 
                    expirationDate)
                    this.user.next(user)
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