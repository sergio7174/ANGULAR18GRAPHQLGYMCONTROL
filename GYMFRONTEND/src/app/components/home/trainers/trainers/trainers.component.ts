import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
/**** The takeUntilDestroyed artifact is an operator that unsubscribes
from an observable when the component is destroyed. */
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
/**** Staff services block ******/
import { StaffService } from '../../../../core/services/staff/staff.service';
import { environment } from '../../../../environments/environments';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { NgxPaginationModule } from 'ngx-pagination'; // Import the module
import { ToastrService } from 'ngx-toastr';
import { bootstrapChevronRight,
         bootstrapTwitter, 
         bootstrapFacebook, 
         bootstrapInstagram,
         bootstrapLinkedin,
 } from '@ng-icons/bootstrap-icons';
 import { FooterComponent } from '../../../layout/footer/footer/footer.component';
   // libs to handle mutations, queries
  import { Apollo } from 'apollo-angular';
  import { GET_TRAINERS } from '../trainersqueries';
  import { Subscription } from 'rxjs';
 

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [ FormsModule,
             CommonModule,
             NgxPaginationModule,
             NgIcon, 
             FooterComponent,
             ],

  providers: [provideIcons({ 
     
         bootstrapChevronRight,
         bootstrapTwitter, 
         bootstrapFacebook, 
         bootstrapInstagram,
         bootstrapLinkedin, }), ToastrService],
  
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css'
})
export class TrainersComponent implements OnInit, OnDestroy{

// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
private readonly toast =  inject(ToastrService);
 private readonly staffService = inject(StaffService);
  private readonly router = inject(Router);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);
private querySubscription: Subscription | undefined;
  
  baseUrl = environment.endpoint;
  messageStaff:any="";
  DataStaff:any = [];
  Data:any = [];

  /*** vars to handle search ******************/

  items: any = [];
  filteredItems: any = [];
  searchTerm: string = '';
  error: string = '';

   /*** End Block to vars to handle search ****/

   imagetest : any ="";

/**** vars to handle pagination  NgxPagination  ********/

page: number = 1; // Current page

/***** End of vars to handle pagination  */

  ngOnInit(): void { 
      //this.getDataStaff();
    this.querySubscription = this.apollo.watchQuery<any>({query: GET_TRAINERS }).valueChanges.subscribe(({ data }) => {
                
    //alert("Estoy en packs component - line 86 - data: " + data );
                       
        if (data) {
          this.DataStaff = data;
          this.filteredItems = this.DataStaff.staffs; 
          this.items = this.DataStaff;  
                }
         this.error = 'Error Getting Pack Data From Backend';
                      });
                   
                     
   } // End of ngOnInit

// function to unsuscribe apollo client
 ngOnDestroy(): void { this.querySubscription?.unsubscribe();}
  
/************************************************************** */

// function to go back to homeAdmin
back() {this.router.navigate(['home'],)}


}






