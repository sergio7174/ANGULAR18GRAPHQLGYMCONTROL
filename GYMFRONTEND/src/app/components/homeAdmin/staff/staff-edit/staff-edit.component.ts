import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapMailbox2Flag, 
         bootstrapHouseAddFill, 
         bootstrapPersonCircle,
         bootstrapBack,
         bootstrapPhone,
         bootstrapFiletypeKey,
         bootstrapPersonWorkspace,
         bootstrapReceipt,
         bootstrapChevronRight,
         bootstrapCheckCircle } from '@ng-icons/bootstrap-icons';
import { StaffService } from '../../../../core/services/staff/staff.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
// libs to handle queries
import { Apollo } from 'apollo-angular';
import { GET_TRAINER } from '../staffqueries';
import { UPDATE_TRAINER, DELETE_TRAINER_IMAGE } from '../staffmutations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-staff-edit',
  standalone: true,
  imports: [ReactiveFormsModule,
             CardModule,
             InputTextModule,
             ButtonModule,
             NgIcon],
  providers: [provideIcons({

                  bootstrapMailbox2Flag, 
                  bootstrapPersonCircle, 
                  bootstrapBack,
                  bootstrapHouseAddFill,
                  bootstrapPhone,
                  bootstrapFiletypeKey,
                  bootstrapPersonWorkspace,
                  bootstrapReceipt,
                  bootstrapChevronRight,
                  bootstrapCheckCircle }),
                  ToastrService],
  templateUrl: './staff-edit.component.html',
  styleUrl: './staff-edit.component.css'
})
export class StaffEditComponent implements OnInit, OnDestroy{

// Data that I want to get from URL sended by login component
ItemStaffId: string | null = null; 
selectedFile: File | null = null; // var to handle the image
mensajeBackend:any=""; // var to handle ok messages
dataStaff:any=[];
newStaff:any=[];
AddModel: any = {image:[]};
otherparam :string="";
param :string="";
element:any={};

// var to handle answer from backend when erase image
trainerImageDeleted: any = '';

// var to handle upload pack Image
dataTrainerImage: any = '';
newTrainerImagePath: string = '';
OldImage: string = '';
updateTrainerData : any ='';
// var to handle preview image
imagePreviewUrl: string = "";

private readonly staffService = inject(StaffService);
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
  // When the component starts call the function updateStaffData

  this.updateStaffData();
  // get the id, sended by the URL, routerParam, in app.routes.ts -> editPack/:id
  this.routerParam.paramMap.subscribe(params =>{this.ItemStaffId = params.get('id')})
  const id= this.ItemStaffId
  
  //alert ("Estoy en ngOnInit - staff-edit.component - line 86 - id: "+id);


  this.getStaffData(id);
}

// function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }

/**** editeditStaffForm  */
editStaffForm = new FormGroup({
    name:  new FormControl('', [Validators.required, Validators.min(5)]),
    email:  new FormControl('', [Validators.required ]),
    age:  new FormControl('', [Validators.required ]),
    field:  new FormControl('', [Validators.required ]),
    id_card:  new FormControl('', [Validators.required ]),
    phone:  new FormControl('', [Validators.required ]),
    address:  new FormControl('', [Validators.required ]),
    gender:  new FormControl('', [Validators.required ]),
    image: new FormControl(this.selectedFile, [Validators.required,])
});

// delete all fields in form
updateStaffData(){

  this.editStaffForm = new FormGroup({

    name:  new FormControl('', [Validators.required, Validators.min(5)]),
    email:  new FormControl('', [Validators.required ]),
    age:  new FormControl('', [Validators.required ]),
    field:  new FormControl('', [Validators.required ]),
    id_card:  new FormControl('', [Validators.required ]),
    phone:  new FormControl('', [Validators.required ]),
    address:  new FormControl('', [Validators.required ]),
    gender:  new FormControl('', [Validators.required ]),
    image: new FormControl(this.selectedFile, [Validators.required,])
      
  }); 
}
/**** function to get the data to fill form  from backend - old values*/

getStaffData(id:any): void {

   alert("Estoy en staff-edit component - line 141 - getStaffData - id: "+ id);

  // get data to fill the form from graphql apollo client 
   this.querySubscription = this.apollo.watchQuery<any>({query: GET_TRAINER, variables: { id:id } }).valueChanges.subscribe(({ data }:any) => {
        alert("Estoy en staff-edit component - line 145 - data: " + data );         
        if (data) {
          this.dataStaff = data.staff;
         alert("Estoy en staff-edit - line 148 - this.DataStaff.nameplan="+ this.dataStaff.name);
          this.toast.success('Got Trainer Data From Backend');
        }
     ; 
    // end of bloack to get getpack from graphQl mutation  
      this.OldImage = this.dataStaff.image;
      
      this.editStaffForm.patchValue({

    name:         this.dataStaff?.name,
    email:        this.dataStaff?.email,
    age:          this.dataStaff?.age,
    field:        this.dataStaff?.field,
    id_card:      this.dataStaff?.id_card,
    phone:        this.dataStaff?.phone,
    address:      this.dataStaff?.address,
    gender:       this.dataStaff?.gender,  
   
      });
   
   })} // End of Get Staff Data

/***** End of Block to function to get the data to fill form  from backend - old values - */
/******** Function to delete a pack image on the server ***************/
 TrainerDeleteImageMutation = async () => {

   alert("EStoy en staff - edit - component - line 174 -TrainerDeleteImageMutation  - this.OldImage: " + this.OldImage);
  this.apollo.mutate({
          mutation:  DELETE_TRAINER_IMAGE,
          variables: { image: this.OldImage },
        }).
        subscribe( ( {data}:any ) => {
          this.trainerImageDeleted = data.deleteTrainerImage;
          
          if (this.trainerImageDeleted != null){
              this.toast.success('Trainer Image Deleted Successfully .....');
              return;
          }
        }) // end of this.apollo.mutate({mutation:  UPDATE TRAINER
 }
  // end of PackDeleteImageMutation function
/**** function to edit Trainer  ***********************************************************/

EditStaff(): void{
   
      /** If the form is not valid */  
      if (!this.editStaffForm.valid) {
      
        // Send a message to complete the data in form    
        this.toast.error('Please Fill all Form Fields.!');
    
     } else {
    
      if (window.confirm('Are you sure?')) {
        
      alert("Estoy en editstaff - line 167 - image: " + this.OldImage);

      /*** service to erase old image  ****************************************/
     this.TrainerDeleteImageMutation();
     this.GetTrainerImage(this.selectedFile);

      
    
    }}
      
      }// End Block function to edit an Staff 
/****  end of function to edit staff ***************************************************** */

// function to send to server the image file, and get the imageUrl
GetTrainerImage(selectedFile:any) {
   alert("Estoy en staff-edit.component - line 220 - GetTrainerImage: selectedFile " + selectedFile);
// Create a postData object to send the data with the file
    const postDataImage:any = new FormData();
    // Append the selected file if any
    if (selectedFile) 
      { postDataImage.append('Dataimage', selectedFile) }
    // call the service to upload an image file to multer route in server
    /****begin multer block ****************************************/

    this.staffService.uploadPackImage(postDataImage as any).pipe(
    takeUntilDestroyed(this.destroyRef)).subscribe({
    next: (response) => {
        
        this.dataTrainerImage = response;
        this.newTrainerImagePath = this.dataTrainerImage.image;
        alert("Estoy en staff-edit.component - line 235 - this.newTrainerImagePath:  " + this.newTrainerImagePath);
        const TrainerImage = this.newTrainerImagePath;
        this.TrainerUpdatingMutation(TrainerImage);
      if (!this.newTrainerImagePath) { this.toast.error('Something went wrong')};
      return;  
  } 
  }); // end of this.staffService.uploadTrainerImage

} // end of GetTrainerImage

/*********************************************************** */

// function to save Pack data to backend
TrainerUpdatingMutation(TrainerImage: any){

  // get the id, sended by the URL, routerParam, in app.routes.ts -> editPack/:id
  this.routerParam.paramMap.subscribe(params =>{this.ItemStaffId = params.get('id')})
  const id= this.ItemStaffId
  alert("Estoy en staff-edit.component - line 253 - TrainerUpdatingMutation - id:  " + id);
  alert("Estoy en staff-edit.component - line 254 - TrainerUpdatingMutation - TrainerImage:  " + TrainerImage);
  alert("Estoy en pack-edit.component - line 252 - PackUpdatingMutation - this.editStaffForm?.value.nameplan:  " + this.editStaffForm?.value.name);

this.apollo.mutate({
          mutation: UPDATE_TRAINER,
          variables: {
                id:          id,
                name:        this.editStaffForm?.value.name, 
                email:       this.editStaffForm?.value.email, 
                age:         this.editStaffForm?.value.age,
                field:       this.editStaffForm?.value.field,
                id_card:     this.editStaffForm?.value.id_card,
                phone:       this.editStaffForm?.value.phone,
                address:     this.editStaffForm?.value.address,
                gender:      this.editStaffForm?.value.gender,
                image:       TrainerImage,       
          },
        }).subscribe( ( {data}:any ) => {
          this.updateTrainerData = data.updateTrainer; // this data.addtrainer this addpack comes from the name of the nutation in staffmutations.ts --> ADD_PACK --> mutation addstaff
          //alert("Estoy en staff-edit.component - line 273 - TrainerSavingMutation - this.newTrainer = " + this.newtrainer);

          if (this.updateTrainerData == null){
              this.toast.error('Trainer Not Updated, there were Something ..');
              this.editStaffForm.reset();
              return;
          }
          
         if (this.updateTrainerData!= null){
            this.toast.success('Trainer Updated Succesfully ....');
            this.router.navigateByUrl('homeAdmin');
         }
        },
       
      );
} // end of PackSavingMutation();

/***************************************************************************************** */
get name() { return this.editStaffForm.controls['name'];}
get email() { return this.editStaffForm.controls['email'];}
get age() { return this.editStaffForm.controls['age'];}
get field() { return this.editStaffForm.controls['field'];}
get id_card() { return this.editStaffForm.controls['id_card'];}
get phone() { return this.editStaffForm.controls['phone'];}
get address() { return this.editStaffForm.controls['address'];}
get gender() { return this.editStaffForm.controls['gender'];}
get image() { return this.editStaffForm.controls['image'];}

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
