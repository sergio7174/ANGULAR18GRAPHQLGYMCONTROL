import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Pack } from '../../../../core/interfaces/pack/pack';
/**** Pack services block ******/
import { PackService } from '../../../../core/services/pack/pack.service';
import { environment } from '../../../../environments/environments';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapTrash3, bootstrapPersonLinesFill } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { NgxPaginationModule } from 'ngx-pagination'; // Import the module
import { ToastrService } from 'ngx-toastr';
 // libs to handle queries
 import { Apollo } from 'apollo-angular';
 import { GET_PACKS } from '../../../home/packs/packqueries';
 import { DELETE_PACK, DELETE_PACK_IMAGE } from '../packmutation';
 import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pack-list',
  standalone: true,
  imports: [ FormsModule,
             CommonModule,
             NgIcon,
             NgxPaginationModule,
],
providers: [provideIcons({ bootstrapTrash3, 
                           bootstrapPersonLinesFill }), 
                           ToastrService],
  templateUrl: './pack-list.component.html',
  styleUrl: './pack-list.component.css'
})
export class PackListComponent implements OnInit, OnDestroy {

// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
private readonly toast =  inject(ToastrService);
private readonly packService = inject(PackService);
private readonly router = inject(Router);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);
private querySubscription: Subscription | undefined;
  
  baseUrl = environment.endpointI;
  messagePack:any="";
  /** vars to handle deleted pack, image and data from backend */
  DataPack:any = [];
  packDeleted: any = '';
  packImageDeleted: any = '';

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
                    //this.getDataPack();
                    /*this.filteredItems = this.DataPack; 
                    this.items = this.DataPack.Pack; */
         this.querySubscription = this.apollo.watchQuery<any>({query: GET_PACKS }).valueChanges.subscribe(({ data }:any) => {

        //alert("Estoy en packs component - line 75 - data: " + data );
         
       
        if (data) {
          this.DataPack = data;
          this.filteredItems = this.DataPack.packs; // this.DataPack.packs; --> packs comes from backend --> how I sent the inf in mutation packmutation addpack
          this.items = this.DataPack.packs; 

          //alert("Estoy en listPacks-component - line 83 - this.DataPack.packs.nameplan="+ this.DataPack.packs[0].nameplan);
        }
       // this.toast.success('Got Packs Data From Backend');
      });     
      
     
                     
   } // End of ngOnInit

  /****************************************** */

// function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }
       

// function to go back to homeAdmin
back() {this.router.navigate(['homeAdmin'],)}

// function to delete Pack
deleteDetails (Data:any,index:any,event:any) {
  event.preventDefault();

  /**** delete pack image block begin *********************************/
  //alert("EStoy en listPacks - line 113 - deleteDetails - Data.image: " + Data.image);
  this.apollo.mutate({
          mutation:  DELETE_PACK_IMAGE,
          variables: { image: Data.image },
        }).
        subscribe( ( {data}:any ) => {
          this.packImageDeleted = data.deletePackImage;
          
          if (this.packImageDeleted != null){
              this.toast.success('Pack Image Deleted Successfully .....');
              return;
          }
        }) // end of this.apollo.mutate({mutation:  DELETE_PACK_IMAGE,

  /**** delete pack image block end  **********************************/

//alert("EStoy en listPacks - line 121 - Data.image: " + Data.image);
//alert("EStoy en listPacks - line 122 - Data.id: " + Data.id);

this.apollo.mutate({
          mutation:  DELETE_PACK,
          variables: { id: Data.id },
        }).
        subscribe( ( {data}:any ) => {
          this.packDeleted = data.deletePack;
          
          if (this.packDeleted != null){
              this.toast.success('Pack Deleted Successfully .....');
              // to reload page - I go to another page and later to the one that I want To go
              this.router.navigateByUrl('/homeAdmin', {skipLocationChange: true})// first I go to /admin
              .then(() => this.router.navigate(['listPack'])); // then I go to /pack-List page

          }
        }) // end of this.apollo.mutate({mutation:  DELETE_PACK,
}

// end of block of function to delete Pack

// function to edit Pack
editDetails(id:any){

  /***alert("Estoy en listPacks component - line 103 - to ediPack Comp ..");
  alert("Estoy en listPacks component - line 104 - to ediPack Comp .. id: "+id);*/

  this.router.navigate(['/editPack',id]);

}

// end of block of function to edit Pack

// function to handle search in Pack list *************

get filteredPack(): Pack[] {
  return this.items.filter((item:any) => 
    item.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    ??
    item.nameplan.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}
// End of function Block  to handle search in Pack list
}






