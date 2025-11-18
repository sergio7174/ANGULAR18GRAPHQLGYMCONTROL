import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Staff } from '../../../../core/interfaces/staff/staff';
/**** Staff services block ******/
import { StaffService } from '../../../../core/services/staff/staff.service';
import { environment } from '../../../../environments/environments';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapTrash3, bootstrapPersonLinesFill } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { NgxPaginationModule } from 'ngx-pagination'; // Import the module
import { ToastrService } from 'ngx-toastr';
 // libs to handle queries and mutations
 import { Apollo } from 'apollo-angular';
 import { GET_TRAINERS } from '../../../home/trainers/trainersqueries';
 import { DELETE_STAFF, DELETE_TRAINER_IMAGE } from '../staffmutations';
 import { Subscription } from 'rxjs';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [ FormsModule,
             CommonModule,
             NgIcon,
             NgxPaginationModule,
  
],
providers: [provideIcons({ bootstrapTrash3, 
bootstrapPersonLinesFill }), ToastrService],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent implements OnInit, OnDestroy{

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
  
  /** vars to handle deleted pack, image and data from backend */
  DataStaff:any = [];
  staffDeleted: any = '';
  staffImageDeleted: any = '';
  /*** vars to handle search ******************/
  items: any = [];
  filteredItems: any = [];
  searchTerm: string = '';

   /*** End Block to vars to handle search ****/

   imagetest : any ="";

/**** vars to handle pagination  NgxPagination  ********/

page: number = 1; // Current page

/***** End of vars to handle pagination  */

  ngOnInit(): void { this.getDataStaff(); } // End of ngOnInit

   /****************************************** ***/
  // function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }
  /********************************************* */
  /*** function to get from backend the Staff list ************************/
  getDataStaff() {

    this.querySubscription = this.apollo.watchQuery<any>({query: GET_TRAINERS }).valueChanges.subscribe(({ data, error }:any) => {

        //alert("Estoy en classes-list component - line 80 - data: " + data );
       
        if (data) {
          this.DataStaff = data;
          this.filteredItems = this.DataStaff; 
          this.items = this.DataStaff; 
        }
        if (error){
          alert("Estoy en classes-list component - line 88 - error: " + error );
        }
      // this.toast.success('Got Packs Data From Backend');
      });               

} // end of getDataStaff
/************************************************************** */

// function to go back to homeAdmin
back() {this.router.navigate(['homeAdmin'],)}

// function to delete Staff
deleteDetails (Data:any,index:any,event:any) {
  event.preventDefault();

  /**** delete pack image block begin *********************************/
  alert("EStoy en staffPacks - line 100 - deleteDetails - Data.image: " + Data.image);
  this.apollo.mutate({
          mutation:  DELETE_TRAINER_IMAGE,
          variables: { image: Data.image },
        }).
        subscribe( ( {data}:any ) => {
          this.staffImageDeleted = data.deleteTrainerImage;
          
          if (this.staffImageDeleted != null){
              this.toast.success('Trainer Image Deleted Successfully .....');
              return;
          }
        }) // end of this.apollo.mutate({mutation:  DELETE_TRAINER_IMAGE,

  /**** delete pack image block end  **********************************/


  /*this.staffService.deletestaff(Data._id).subscribe((data) => {
    this.Data.splice(index, 1);*/

    // function to delete Class
    this.apollo.mutate({
          mutation: DELETE_STAFF,
          variables: { id: Data.id },
        }).subscribe( ( {data}:any ) => {

          //alert("EStoy en staff-list - line 150 - DELETE_STAFF: " + Data);
          
          if (data != null){
              this.toast.success('Staff Deleted Succesfully ..');
              return;
          }
        }) // end of function to delete class

    // to reload page - I go to another page and later to the one that I want To go
    this.router.navigateByUrl('/homeAdmin', {skipLocationChange: true})// first I go to /admin
      .then(() => this.router.navigate(['listStaff'])); // then I go to /furnitureList page

}

// end of block of function to delete Staff

// function to edit Staff
editDetails(id:any){

  /***alert("Estoy en listStaffs component - line 103 - to ediStaff Comp ..");
  alert("Estoy en listStaffs component - line 104 - to ediStaff Comp .. id: "+id);*/

  this.router.navigate(['/editStaff',id]);

}

// end of block of function to edit Staff

// function to handle search in Staff list *************

get filteredStaff(): Staff[] {
  return this.items.staffs.filter((item:any) => 
    item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  ??
  item.email.toLowerCase().includes(this.searchTerm.toLowerCase())
  )
}
// End of function Block  to handle search in Staff list
}





