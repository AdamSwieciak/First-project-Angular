import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RecipeService } from "./recipes/recipe.service";
import { AuthInterceptor } from "./shared/auth-interceptor.service";

@NgModule({
    providers: [
        RecipeService, 
        {
        provide: HTTP_INTERCEPTORS, 
        useClass: AuthInterceptor, 
        multi: true
        }]
})

export class CoreModule {}