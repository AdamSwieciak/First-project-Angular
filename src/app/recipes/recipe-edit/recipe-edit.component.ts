import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  singupForm: FormGroup
  id: number;
  editMode= false;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (parmas: Params) => {
        this.id = +parmas['id']
        this.editMode= parmas['id'] != null
        this.initForm()
      }
    )
  }

  private initForm() { 
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    
    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id)
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
      this.recipeService.updateRecipe(this.id, this.singupForm.value); 
    } else {
      this.recipeService.addRecipes(this.singupForm.value)
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
}
