import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const appRoutes: Routes= [
    {path: '', redirectTo: '/recipes', pathMatch: 'full'},
    {
    path: 'recipes', 
    loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
  },
    {
    path: 'shoppingList', 
    loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
  },
    {
    path: 'auth', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) 
    // lazy loading (loadChildren: () ) in AuthModule delete path and in app modules delate import authmodule 
  },
]

@NgModule({
    imports: [
      // RouterModule.forRoot(appRoutes, {useHash: true})
      RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
      // Preloading strategy 
    ],
    exports: [RouterModule]
  })
  export class AppRoutingModule {
  
  }