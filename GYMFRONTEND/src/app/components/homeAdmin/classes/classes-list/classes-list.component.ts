import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
/**** The takeUntilDestroyed artifact is an operator that unsubscribes
from an observable when the component is destroyed. */
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Classes } from '../../../../core/interfaces/classes/classes';
/**** Class services block ******/
import { ClassesService } from '../../../../core/services/classes/classes.service';
import { environment } from '../../../../environments/environments';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapTrash3, bootstrapPersonLinesFill } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { NgxPaginationModule } from 'ngx-pagination'; // Import the module
import { ToastrService } from 'ngx-toastr';
 // libs to handle queries and mutations
 import { Apollo } from 'apollo-angular';
 import { GET_CLASSES } from '../../../home/classes/classesqueries';
 import { DELETE_CLASS } from '../classesmutation';
 import { Subscription } from 'rxjs';

@Component({
  selector: 'app-classes-list',
  standalone: true,
  imports: [ FormsModule,
             CommonModule,
             NgIcon,
             NgxPaginationModule,
],
providers: [provideIcons({ bootstrapTrash3, 
                  bootstrapPersonLinesFill }), 
                  ToastrService],
  templateUrl: './classes-list.component.html',
  styleUrl: './classes-list.component.css'
})
export class ClassesListComponent implements OnInit, OnDestroy {

// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
private readonly toast =  inject(ToastrService);
private readonly classService = inject(ClassesService);
private readonly router = inject(Router);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);
private querySubscription: Subscription | undefined;
  
  baseUrl = environment.endpoint;
  messageclass:any="";
  Dataclass:any = [];
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

  ngOnInit(): void { this.getDataclass(); } // End of ngOnInit

  /****************************************** ***/
  // function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }
  /********************************************* */

  /*** function to get from backend the class list ************************/
  getDataclass() {

    this.querySubscription = this.apollo.watchQuery<any>({query: GET_CLASSES }).valueChanges.subscribe(({ data, error }:any) => {

        //alert("Estoy en classes-list component - line 80 - data: " + data );
       
        if (data) {
          this.Dataclass = data;
          this.filteredItems = this.Dataclass; 
          this.items = this.Dataclass; 
        }
        if (error){
          alert("Estoy en classes-list component - line 88 - error: " + error );
        }
      // this.toast.success('Got Packs Data From Backend');
      });               
} // end of getDataclass
/************************************************************** */
// function to go back to homeAdmin
back() {this.router.navigate(['homeAdmin'],)}

// function to delete class
deleteDetails (Data:any,index:any,event:any) {
  event.preventDefault();

  //alert("EStoy en listclasss - line 109 - Data.image: "+Data.image);

  this.classService.deleteImage(Data.image).subscribe((data) => {

        // alert("Data: "+data);
  });


  /*this.classService.deleteclasses(Data._id).subscribe((data) => {
    this.Data.splice(index, 1);*/

     // function to delete Class
    this.apollo.mutate({
          mutation: DELETE_CLASS,
          variables: { id: Data.id },
        }).subscribe( ( {data}:any ) => {

          alert("EStoy en classes-list - line 115 - DELETE_CLASS: " + Data);
          
          if (data != null){
              this.toast.error('Class Deleted Succesfully ..');
              return;
          }
        }) // end of function to delete class

    // to reload page - I go to another page and later to the one that I want To go
    this.router.navigateByUrl('/homeAdmin', {skipLocationChange: true})// first I go to /admin
      .then(() => this.router.navigate(['listclass'])); // then I go to /furnitureList page

}

// end of block of function to delete class

// function to edit class
editDetails(id:any){

  //alert("Estoy en classes-list component - line 150 - to ediclass Comp .. id: "+id);

  this.router.navigate(['/editclass',id]);

}

// end of block of function to edit class

// function to handle search in class list *************

get filteredclass(): Classes[] {
  return this.items.classes.filter((item:any) => 
    /*item.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    ??*/
    item.code.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}
// End of function Block  to handle search in class list
}







