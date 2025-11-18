import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapMailbox2Flag } from '@ng-icons/bootstrap-icons';
import { bootstrapKeyFill } from '@ng-icons/bootstrap-icons';
import { bootstrapBack } from '@ng-icons/bootstrap-icons';
import { CategoryService } from '../../../../core/services/category/category.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
// libs to handle mutations, queries
import { Apollo } from 'apollo-angular';
import { ADD_CATEGORY, VERIFY_CATEGORY } from '../categorymutation';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    NgIcon],
providers: [provideIcons({ bootstrapMailbox2Flag, bootstrapKeyFill, bootstrapBack }),ToastrService],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent {

// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);

/********** trying to save image new procedure */
selectedFile: File | null = null;
/***************end block new procedure ****** */


// var to handle messages from backend about the category process
mensajeBackend:any=[];
dataCategory:any=[];
newCategory:any=[];
AddModel: any = {image:[]};
// var for category verified
categoryVerified:any[] = [];

// var to handle preview image
imagePreviewUrl: string = "";
// var to handle image from backend service
dataCategoryImage: any = '';
newCategoryImagePath: any = '';


// inject services dependecies 
private readonly categoryService = inject(CategoryService);
private readonly router = inject(Router);
private readonly toast = inject (ToastrService);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);


categoryForm = new FormGroup(
  {
    name:  new FormControl('', [Validators.required, Validators.min(5)]),
    description:  new FormControl('', [Validators.required]),
    image: new FormControl(this.selectedFile, [Validators.required,])
    
  },
);

// function to send to server the image file, and get the imageUrl
GetCategoryImage(selectedFile:any) {
   alert("Estoy en category-create.component - line 77 - GetCategoryImage: selectedFile " + selectedFile);
// Create a postData object to send the data with the file
    const postDataImage:any = new FormData();
    // Append the selected file if any
    if (selectedFile) 
      { postDataImage.append('Dataimage', selectedFile) }
    // call the service to upload an image file to multer route in server
    /****begin multer block ****************************************/

    this.categoryService.uploadCategoryImage(postDataImage as any).pipe(
    takeUntilDestroyed(this.destroyRef)).subscribe({
    next: (response) => {
        
        this.dataCategoryImage = response;
        this.newCategoryImagePath = this.dataCategoryImage.image;
        alert("Estoy en category-create.component - line 94 - this.newCategoryImagePath:  " + this.newCategoryImagePath);
        const CategoryImage = this.newCategoryImagePath;
        this.CategorySavingMutation(CategoryImage);
      if (!this.newCategoryImagePath) { this.toast.error('Something went wrong')};
      return;  
  } 
  }); 
}// end of this.category.service.uploadCategoryImage

/********************************************************************************** */
oncategory() {

  /**** for testing purposes ************/
  try{
    if(this.categoryForm.valid){
      alert('Profile form is valid');
    } else {
      alert('Profile form invalid');
    }
  } catch(error){}

 /**** End block for testing purposes */ 
 /**** Check if the form is invalid ****/

 if (this.categoryForm.invalid) {
  this.toast.error('Error','Please complete all required fields.');
  return;
}

/*** call Function to verify if user exist */  
this.CategoryVerifyMutation();
  /*const postData = { ...this.categoryForm.value };
  
  this.categoryService.createcategory(postData , (this.selectedFile)).pipe(
    takeUntilDestroyed(this.destroyRef)).subscribe({
    next: (response) => {
        
        this.dataCategory = response;
        this.mensajeBackend = this.dataCategory.message;
        this.newCategory = this.dataCategory.NewCategory;*/

        /*alert("Estoy en category.component - line 90 - this.         mensajeBackend:  "+this.mensajeBackend);
        alert("Estoy en category.component - line 91 - this.newCategory:  "
           +this.newCategory);*/

     /* if (!this.newCategory) {     
        if (this.mensajeBackend){
          this.toast.error(this.mensajeBackend);
        }}

 if (this.newCategory) {
      this.toast.success('create Category successfully');
      
      //window.location.reload();

      // reset form: categoryForm
      this.categoryForm.reset();

      // go to /createCategory page
      
      this.router.navigateByUrl('/home', {skipLocationChange: true})// first I go to /home
      .then(() => this.router.navigate(['/createCategory'])); // then I go to /createCategory page

      console.log(response);
    }},
    error: (err) => {
      console.log(err);
  
      this.toast.error('Something went wrong');
    },
  });*/

}

/*** Function to verify if category exist */
CategoryVerifyMutation(){

  alert('Im at category-create component - CategoryVerifyMutation() - line 171 ')
  this.apollo.mutate({
          mutation: VERIFY_CATEGORY,
          variables: {
            name:    this.categoryForm.get('name')?.value,
          },
        }).
        subscribe( ( {data}:any ) => {
          this.categoryVerified = data.verifyUser;
          
          if (this.categoryVerified != null){
              this.toast.error('Category Exist , use another Name to Create Category');
              this.categoryForm.reset();
              return;
          }
          
         if (this.categoryVerified == null){
          
             alert("Estoy en category-create.component - line 187 - CategoruVerifyMutation - this.categoryVerified == null: Go to create image ..... ");
             this.GetCategoryImage(this.selectedFile);          

         }
        },
       
      );
} // end of UserVerifyMutation() function

/********************************************************************** */

// function to save category data to backend
CategorySavingMutation(categoryImage: any){
alert("Estoy en category-create .component - line 200 - CategorySavingMutation - CategoryImage:  " + categoryImage);
this.apollo.mutate({
          mutation: ADD_CATEGORY,
          variables: {
            name: this.categoryForm.get('name')?.value,
            description:    this.categoryForm.get('description')?.value,
            image:    categoryImage
          },
        }).
        subscribe( ( {data}:any ) => {
          this.newCategory = data.addCategory;
          
          if (this.newCategory == null){
              this.toast.error('Category Exist , use another Email to SignUp');
              this.categoryForm.reset();
              return;
          }
          
         if (this.newCategory!= null){
            
            this.toast.success('Category Register Succesfully ....');
            this.router.navigateByUrl('homeAdmin');
         }
        },
       
      );
} // end of CategorySavingMutation()

/***************************************************************** */


get name() {
  return this.categoryForm.controls['name'];
}

get description() {
  return this.categoryForm.controls['description'];
}

get image() {
  return this.categoryForm.controls['image'];
  }
  
  changeImg(event:any) {this.selectedFile = event.target.files[0];

    // this is to show the image preview in vomponent view
    if (this.selectedFile) {
      // The FileReader API reads the file as a data URL, which is a string representation of the image data.
      const reader = new FileReader();
        reader.onload = (event:any) => {
          this.imagePreviewUrl = event.target.result as string; };
        reader.readAsDataURL(this.selectedFile);
      }
    }


  }






