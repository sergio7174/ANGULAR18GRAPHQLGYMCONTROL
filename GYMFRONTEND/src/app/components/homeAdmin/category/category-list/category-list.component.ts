import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
/**** The takeUntilDestroyed artifact is an operator that unsubscribes
from an observable when the component is destroyed. */
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
/**** Category services block ******/
import { CategoryService } from '../../../../core/services/category/category.service';
import { Router } from '@angular/router';
import { Category } from '../../../../core/interfaces/category/category';
import { environment } from '../../../../environments/environments';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapTrash3, bootstrapPersonLinesFill } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { NgxPaginationModule } from 'ngx-pagination'; // Import the module
import { ToastrService } from 'ngx-toastr';
 // libs to handle queries
 import { Apollo } from 'apollo-angular';
 import { GET_CATEGORIES } from '../categoryqueries';
 import { DELETE_CATEGORY } from '../categorymutation';
 import { Subscription } from 'rxjs';


@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [ FormsModule,
             CommonModule,
             NgIcon,
             NgxPaginationModule,
             //NgOptimizedImage
],
providers: [provideIcons({ bootstrapTrash3, 
bootstrapPersonLinesFill }), ToastrService],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit, OnDestroy{

// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
private readonly toast =  inject(ToastrService);
private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);
private querySubscription: Subscription | undefined;
  
  baseUrl = environment.endpointI;
  messageCategory:any="";
  DataCategory:any = [];
  Data:any = [];

  /*** vars to handle search ******************/

  items: any = [];
  filteredItems: any = [];
  searchTerm: string = '';

   /*** End Block to vars to handle search ****/

   imagetest : any ="";

/**** vars to handle pagination  NgxPagination  ********/

page: number = 1; // Current page

/***** End of vars to handle pagination  */

  ngOnInit(): void { 
      
       this.querySubscription = this.apollo.watchQuery<any>({query: GET_CATEGORIES }).valueChanges.subscribe(({ data }) => {

        //alert("Estoy en category-list component - line 73 - data: " + data );
       
        if (data) {
          this.DataCategory = data;
          this.filteredItems = this.DataCategory; 
          this.items = this.DataCategory; 
        }
      // this.toast.success('Got Packs Data From Backend');
      });
   } // End of ngOnInit

  /****************************************** */
  
  // function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }
       
  
/************************************************************** */

// function to go back to homeAdmin
back() {this.router.navigate(['homeAdmin'],)}

// function to delete Category
deleteDetails (Data:any,index:any,event:any) {
  event.preventDefault();

  alert("EStoy en listCategorys - line 99 - Data.image: "+Data.image);

  this.categoryService.deleteImage(Data.image).subscribe((data) => {

      alert("EStoy en listCategorys - categoryService.deleteImage - line 103 - DELETE_CATEGORY: " + data );
  });
    // function to delete Category
    this.apollo.mutate({
          mutation: DELETE_CATEGORY,
          variables: { id: Data.id },
        }).subscribe( ( {data}:any ) => {

          alert("EStoy en listCategorys - line 119 - DELETE_CATEGORY: " + Data);
          
          if (data != null){
              this.toast.error('Category Deleted Succesfully ..');
              return;
          }
        }) // end of function to delete category
  
    // to reload page - I go to another page and later to the one that I want To go
    this.router.navigateByUrl('/homeAdmin', {skipLocationChange: true})// first I go to /admin
      .then(() => this.router.navigate(['listCategory'])); // then I go to /furnitureList page

}

// end of block of function to delete Category

// function to edit Category
editDetails(id:any){

  /***alert("Estoy en listCategorys component - line 103 - to ediCategory Comp ..");
  alert("Estoy en listCategorys component - line 104 - to ediCategory Comp .. id: "+id);*/

  this.router.navigate(['/editCategory',id]);

}

// end of block of function to edit Category

// function to handle search in Category list *************

get filteredCategories(): Category[] {
  // categories use it in this.items?.categories?.filter comes from GET_CATEGORIES --> mutation query getCategories {  } categories <-- from here, dont forget that
  return this.items?.categories?.filter((item:any) => 
    item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}
// End of function Block  to handle search in Category list
}




