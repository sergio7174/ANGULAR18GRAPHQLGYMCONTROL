import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
/**** The takeUntilDestroyed artifact is an operator that unsubscribes
from an observable when the component is destroyed. */
import { Router } from '@angular/router';
/**** Pack services block ******/

import { environment } from '../../../../environments/environments';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { NgxPaginationModule } from 'ngx-pagination'; // Import the module
import { ToastrService } from 'ngx-toastr';
import { bootstrapChevronRight,
         bootstrapCheckCircle, 
         bootstrapArrowRight, 
       
 } from '@ng-icons/bootstrap-icons';
 import { FooterComponent } from '../../../layout/footer/footer/footer.component';
 import { MarqueeComponent } from './../marquee/marquee.component';
 import { WorkprocessComponent } from './../workprocess/workprocess.component';
 // libs to handle queries
 import { Apollo } from 'apollo-angular';
 import { GET_PACKS } from '../packqueries';
 import { Subscription } from 'rxjs';

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [ FormsModule,
             CommonModule,
             NgxPaginationModule,
             NgIcon, 
             MarqueeComponent,
             WorkprocessComponent,
             FooterComponent,
    ],

providers: [provideIcons({ 

bootstrapChevronRight,
bootstrapCheckCircle, 
bootstrapArrowRight, 

 }), ToastrService],
  templateUrl: './packs.component.html',
  styleUrl: './packs.component.css'
})
export class PacksComponent implements OnInit, OnDestroy{

// Declare the following property to inject the DestroyRef service:

private readonly toast =  inject(ToastrService);
private readonly router = inject(Router);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);
private querySubscription: Subscription | undefined;
  
  baseUrl = environment.endpoint;
  messagePack:any="";
  DataPack:any = [];
  errors: any;

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
                  
       // my query block begining
       this.querySubscription = this.apollo.watchQuery<any>({query: GET_PACKS }).valueChanges.subscribe(({ data }) => {

        //alert("Estoy en packs component - line 86 - data: " + data );
       
        if (data) {
          this.DataPack = data;
          this.filteredItems = this.DataPack.packs; 
          this.items = this.DataPack; 
        }
       // this.toast.success('Got Packs Data From Backend');
      });
  }// end of ngOnInit();
  
  // function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }
       
// function to go back to homeAdmin
back() {this.router.navigate(['home'],)}  

PurchaseNow(Packid:any){

  //alert("Estoy en packs component - line 105 - to see pack details Comp ..Packid: " + Packid);
  /*alert("Estoy en classes component - line 125 - to class details Comp .. pack.nameclass: "+pack.nameclass);*/

  this.router.navigate(['/sales',Packid]);

}
                
   } // End of ngOnInit

   /****************************************** */
  
  










