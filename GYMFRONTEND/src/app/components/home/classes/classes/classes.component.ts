import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
/**** The takeUntilDestroyed artifact is an operator that unsubscribes
from an observable when the component is destroyed. */
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
/**** Class services block ******/
import { ClassesService } from '../../../../core/services/classes/classes.service';
import { environment } from '../../../../environments/environments';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { NgxPaginationModule } from 'ngx-pagination'; // Import the module
import { ToastrService } from 'ngx-toastr';
import { bootstrapChevronRight} from '@ng-icons/bootstrap-icons';
 import { FooterComponent } from '../../../layout/footer/footer/footer.component';
  // libs to handle mutations, queries
 import { Apollo } from 'apollo-angular';
 import { GET_CLASSES } from '../classesqueries';
 import { Subscription } from 'rxjs';


@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [ FormsModule,
             CommonModule,
             NgxPaginationModule,
             NgIcon, 
             FooterComponent,
],

providers: [provideIcons({ bootstrapChevronRight }), ToastrService],

  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent implements OnInit, OnDestroy {

// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
private readonly toast =  inject(ToastrService);
private readonly classService = inject(ClassesService);
private readonly router = inject(Router);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);
private querySubscription: Subscription | undefined;
  
  baseUrl = environment.endpoint;
  messageClass:any="";
  DataClass:any = [];
  Data:any = [];

  /*** vars to handle search ******************/

  items: any = [];
  filteredItems: any = [];
  searchTerm: string = '';
  errors: any;

   /*** End Block to vars to handle search ****/

   imagetest : any ="";

/**** vars to handle pagination  NgxPagination  ********/

page: number = 1; // Current page

/***** End of vars to handle pagination  */

  ngOnInit(): void { 
                    
        // my query block begining
                this.querySubscription = this.apollo.watchQuery<any>({query: GET_CLASSES }).valueChanges.subscribe(({ data }) => {
        
                //alert("Estoy en packs component - line 75 - data: " + data );
               
                if (data) {
                  this.DataClass = data;
                  this.filteredItems = this.DataClass.classes; 
                  this.items = this.DataClass; 
                }
                this.errors = 'Error Getting Pack Data From Backend';
              });
                     
   } // End of ngOnInit
   
// function to unsuscribe apollo client
 ngOnDestroy(): void { this.querySubscription?.unsubscribe();}
  
/************************************************************** */

// function to go back to homeAdmin
back() {this.router.navigate(['home'],)}

ClassDetails(id:any){

  /***alert("Estoy en listclasses component - line 124 - to see class details Comp ..");
  alert("Estoy en classes component - line 125 - to class details Comp .. id: "+id);*/

  this.router.navigate(['/classDetails',id]);

}

}








