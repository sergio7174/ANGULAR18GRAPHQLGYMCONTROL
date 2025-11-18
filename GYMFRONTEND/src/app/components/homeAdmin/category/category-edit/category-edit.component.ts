import { Category } from './../../../../core/interfaces/category/category';
import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
/**** The takeUntilDestroyed artifact is an operator that unsubscribes
from an observable when the component is destroyed. */
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/category/category.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapMailbox2Flag } from '@ng-icons/bootstrap-icons';
import { bootstrapKeyFill } from '@ng-icons/bootstrap-icons';
import { bootstrapBack } from '@ng-icons/bootstrap-icons';
 // libs to handle queries
 import { Apollo } from 'apollo-angular';
 import { UPDATE_CATEGORY } from '../categorymutation';
 import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [     CommonModule,
                 ReactiveFormsModule,
                 InputTextModule,
                 InputNumberModule,
                 ButtonModule,
                 NgIcon ],
  providers: [provideIcons({ bootstrapMailbox2Flag, 
                             bootstrapKeyFill, 
                             bootstrapBack }),
                             ToastrService],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export class CategoryEditComponent implements OnInit {

// Data that I want to get from URL sended by login component
ItemCategoryId: string | null = null; 

selectedFile: File | null = null; // var to handle the image
mensajeBackend:any=""; // var to handle ok messages
dataCategory:any=[];
newCategory:any=[];
AddModel: any = {image:[]};
otherparam :string="";
param :string="";
element:any={};
OldImage: string = '';
// var to handle preview image
imagePreviewUrl: string = "";
//var to handle id
idFRO: any = '';

// var to handle upload user Image
dataCategoryImage: any = '';
newCategoryImagePath: string = '';
 
private readonly categoryService = inject(CategoryService);
private readonly router = inject(Router);
private readonly routerParam = inject(ActivatedRoute);
public fb = inject (FormBuilder);
private readonly toast =  inject(ToastrService);
// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);
private querySubscription: Subscription | undefined;

ngOnInit(): void {
  // When the component starts call the function updateCategoryData

  this.updateCategoryData();
  // get the id, sended by the URL, routerParam, in app.routes.ts -> editcategory/:id
  this.routerParam.paramMap.subscribe(params =>{this.ItemCategoryId = params.get('id')})
  this.idFRO  = this.ItemCategoryId
  
  this.getCategoryData(this.idFRO);
}

editCategoryForm = new FormGroup({

  name:  new FormControl('', [Validators.required, Validators.min(5)]),
  description:  new FormControl('', [Validators.required]),
  image: new FormControl(this.selectedFile, [Validators.required,])
  
}); 
// delete all fields in form
updateCategoryData(){
  this.editCategoryForm = new FormGroup({
    name:  new FormControl('', [Validators.required, Validators.min(5)]),
    description:  new FormControl('', [Validators.required]),
    image: new FormControl(this.selectedFile, [Validators.required,])
      
  }); 
}
// getCategoryData function begining
  getCategoryData(id: string | null ): void {
    //alert("Estoy en editcategory - line 1002- getCategoryData - id: "+  id);

    this.categoryService.getCategoryById(id).pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe((data:any) => {

       //alert("Estoy en editproduct - line 107 - data.category.name: "+data.category.name);
       
      this.OldImage = data.category.image;
      
      this.editCategoryForm.patchValue({
        name: data.category.name,
        description : data.category.description,
        image: data.category.image
      });

    this.otherparam = data;
   
    });
  } // End of GetCategory Data
 /**************************************************** */
// getCategoryData function begining
  DeleteOldImageCategory(): void {

    //alert("Estoy en editproduct - line 125 - this.OldImage: " + this.OldImage);

      /*** service to erase old image  ****************************************/

       this.categoryService.deleteImage(this.OldImage).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: (response) => {

          const DataResponseFromBackend: any = response;
          const messageFromBackend: any = DataResponseFromBackend.message;
          //alert ("Estoy en EditCategory - line - 133 - message from backend: " + messageFromBackend );
          return;
      }});
  }// end of getCategoryData function
  /************************************************************************** */

// function to send to server the image file, and get the imageUrl
GetCategoryImage(selectedFile:any) {
   //alert("Estoy en category-edit component - line 141 - GetCategoryImage: selectedFile " + selectedFile);
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
        //alert("Estoy en category-edit component - line 156 - this.newCategoryImagePath:  " + this.newCategoryImagePath);
        const categoryImage = this.newCategoryImagePath;
        this.CategorySavingMutation(categoryImage);
      if (!this.newCategoryImagePath) { this.toast.error('Something went wrong')};
      return;  
  } 
  }); // end of this.category.service.uploadCategoryImage
    
    /**** end multer block ****************************************/
} // end of GetCategoryImage


 /**** function to update category with data from view********************** */ 
EditCategory(): void{
   
      /** If the form is not valid */  
      if (!this.editCategoryForm.valid) {
      
        // Send a message to complete the data in form    
        this.toast.error('Please Fill all Form Fields.!');
    
     } else {
      if (window.confirm('Are you sure?')) {

      //alert ("Estoy en - category*edit component - EditCategory - line - 180 going to: DeleteOldImageCategory "); 

      this.DeleteOldImageCategory();
      this.GetCategoryImage(this.selectedFile)

      }}}// End Block function to edit category
// function to save user data to backend
CategorySavingMutation(categoryImage: any){
//alert("Estoy en category-edit component - line 188 - CategorySavingMutation - categoryImage:  " + categoryImage);
//alert("Estoy en category-edit component - line 189 - CategorySavingMutation - idFRO:  " + this.idFRO);
this.apollo.mutate({
          mutation: UPDATE_CATEGORY,
          variables: {
            id : this.idFRO,
            name: this.editCategoryForm.get('name')?.value,
            description:  this.editCategoryForm.get('description')?.value,
            image:    categoryImage
          },
        }).
        subscribe( ( {data}:any ) => {
          this.newCategory = data.updateCategory;
          alert("Estoy en category-edit component - line 201 - CategorySavingMutation - this.newCategory:  " + this.newCategory);
          if (this.newCategory== null){
              this.toast.error('Category Dosent exist ...');
              this.editCategoryForm.reset();
              return;
          }
          
         if (this.newCategory!= null){
            
           this.editCategoryForm.reset(); 
           this.toast.success('Category Updated Succesfully ....');
           // to reload page - I go to another page and later to the one that I want To go
    this.router.navigateByUrl('/homeAdmin', {skipLocationChange: true})// first I go to /admin
      .then(() => this.router.navigate(['editCategory',this.idFRO])); // then I go to /furnitureList page
         }
        },
       
      );
} // end of CategorySavingMutation()

/***************************************************************** */

    
// Getter to access form control
get myForm() { return this.editCategoryForm.controls;}

get name() {return this.editCategoryForm.controls['name'];}
  
get description() { return this.editCategoryForm.controls['description'];}

// function to get the image
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

} // End of the class CategoryEditComponent
