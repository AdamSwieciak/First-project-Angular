import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RecipeService } from "./recipes/recipe.service";
import { AuthInterceptor } from "./shared/auth-interceptor.service";
import { ShoppingListService } from "./shopping-list/shopping-list.service";

@NgModule({
    providers: [
        ShoppingListService, 
        RecipeService, 
        {
        provide: HTTP_INTERCEPTORS, 
        useClass: AuthInterceptor, 
        multi: true
        }]
})

export class CoreModule {}