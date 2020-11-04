import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer'
import * as RecipesAction from '../store/recipe.action'
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  singupForm: FormGroup
  id: number;
  editMode= false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (parmas: Params) => {
        this.id = +parmas['id']
        this.editMode= parmas['id'] != null
        this.initForm()
      }
    )
  }

  private storeSub: Subscription

  private initForm() { 
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    
    if (this.editMode) {
      //const recipe = this.recipeService.getRecipe(this.id)
      this.storeSub = this.store.select('recipes').pipe(map(recipeState => {
        return recipeState.recipes.find((recipe, index) => {
          return index === this.id
        })
      })).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                  Validators.required, 
                  Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            )
          } 
        }
      })
     
    }

    this.singupForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    })
  }

  get controls() { // a getter!
    return (<FormArray>this.singupForm.get('ingredients')).controls;
  }
  
  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.singupForm.value['name'], 
    //   this.singupForm.value['description'],
    //   this.singupForm.value['imagePath'],
    //   this.singupForm.value['ingredients'])
    if (this.editMode) {
      //this.recipeService.updateRecipe(this.id, this.singupForm.value); 
      this.store.dispatch(new RecipesAction.UpdateRecipe({index: this.id, newrecipe: this.singupForm.value}))
    } else {
      //this.recipeService.addRecipes(this.singupForm.value)
      this.store.dispatch(new RecipesAction.AddRecipe(this.singupForm.value))
    }
    this.onCancel()
  }
  
  
    onAddIngredient() {
      (<FormArray>this.singupForm.get('ingredients')).push(
        new FormGroup({
          'name': new FormControl(null, Validators.required ),
          'amount': new FormControl(null,  [
            Validators.required, 
            Validators.pattern(/^[1-9]+[0-9]*$/)])
        })
      )
      
    }

    onDeleteoneIngredient(id: number) {
      (<FormArray>this.singupForm.get('ingredients')).removeAt(id)
    }

    onCancel() {
      this.router.navigate(['../'], {relativeTo: this.route})
    }

    ngOnDestroy() {
      if (this.storeSub) {
        this.storeSub.unsubscribe()
      }
    }
}
