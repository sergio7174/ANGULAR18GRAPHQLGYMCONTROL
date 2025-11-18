import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
// libs to handle mutations, queries
import { Apollo } from 'apollo-angular';
import { ADD_TRAINER, VERIFY_TRAINER } from '../staffmutations';

@Component({
  selector: 'app-staff-create',
  standalone: true,
  imports: [ ReactiveFormsModule,
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
  templateUrl: './staff-create.component.html',
  styleUrl: './staff-create.component.css'
})
export class StaffCreateComponent {



/********** trying to save image new procedure */
selectedFile: File | null = null;
/***************end block new procedure ****** */


// var to handle messages from backend about the staff process
mensajeBackend:any=[];
newstaff:any=[];
AddModel: any = {image:[]};

// var to handle preview image
imagePreviewUrl: string = "";
// var to handle the pack data from backend 
datastaff:any={};
// var to handle upload pack Image
dataStaffImage: any = '';
newStaffImagePath: string = '';
// var for Pack verified
staffVerified:any = "";


// inject services dependecies
// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
private readonly staffService = inject(StaffService);
private readonly router = inject(Router);
private readonly toast = inject (ToastrService);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);


staffForm = new FormGroup(
  {
    name:  new FormControl('', [Validators.required, Validators.min(5)]),
    email:  new FormControl('', [Validators.required ]),
    age:  new FormControl('', [Validators.required ]),
    field:  new FormControl('', [Validators.required ]),
    id_card:  new FormControl('', [Validators.required ]),
    phone:  new FormControl('', [Validators.required ]),
    address:  new FormControl('', [Validators.required ]),
    gender:  new FormControl('', [Validators.required ]),
    image: new FormControl(this.selectedFile, [Validators.required,])
    
  },
);

// function to send to server the image file, and get the imageUrl
GetStaffImage(selectedFile:any) {
   alert("Estoy en staff create component - line 102 - GetStaffImage: selectedFile " + selectedFile);
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
        
        this.dataStaffImage = response;
        this.newStaffImagePath = this.dataStaffImage.image;
        alert("Estoy en staff-create.component - line 122 - this.newStaffImagePath:  " + this.newStaffImagePath);
        const StaffImage = this.newStaffImagePath;
        this.StaffSavingMutation(StaffImage);
      if (!this.newStaffImagePath) { this.toast.error('Something went wrong')};
      return;  
  } 
  }); // end of this.staffService.uploadPackImage

} // end of GetPackImage

/*********************************************************** */

onstaff() {

  /**** for testing purposes ************/
  try{
    if(this.staffForm.valid){
      alert('Profile form is valid');
    } else {
      alert('Profile form invalid');
    }
  } catch(error){}

 /**** End block for testing purposes */ 
 /**** Check if the form is invalid ****/

 if (this.staffForm.invalid) {
  this.toast.error('Error','Please complete all required fields.');
  return;
}

/*** call Function to verify if Pack exist */  
this.StaffVerifyMutation();

} // end of onstaff

/**************************************************************************** */
StaffVerifyMutation(){
   //alert("Estoy en staff-create.component - line 160 - staffVerifyMutation - email: " + this.staffForm.get('email')?.value);
  this.apollo.mutate({
          mutation: VERIFY_TRAINER,
          variables: { email: this.staffForm.get('email')?.value },
        }).
        subscribe( ( {data}:any ) => {
          this.staffVerified = data.verifyStaff;
          
          if (this.staffVerified != null){
              this.toast.error('Trainer Exist , use another Email to Create it..');
              this.staffForm.reset();
              return;
          }
          
         if (this.staffVerified == null){
          
             //alert("Estoy en staff-create.component - line 176 - staffVerifyMutation - this.staffVerified == null: Go to create image ..... ");
             this.GetStaffImage(this.selectedFile);          

         }
        },
       
      );
} // end of packVerifyMutation() function
/**************************************************************************** */
// function to save Pack data to backend
StaffSavingMutation(staffImage: any){
//alert("Estoy en staff-create.component - line 187 - StaffSavingMutation - staffImage:  " + staffImage);
//alert("Estoy en staff-create.component - line 188 - StaffSavingMutation -this.staffForm.get('gender')?.value:  " + this.staffForm.get('gender')?.value);


this.apollo.mutate({
          mutation: ADD_TRAINER,
          variables: {
            name:        this.staffForm.get('name')?.value,
            email:       this.staffForm.get('email')?.value,
            age:         this.staffForm.get('age')?.value,
            field:       this.staffForm.get('field')?.value,
            id_card:     this.staffForm.get('id_card')?.value,
            phone:       this.staffForm.get('phone')?.value,
            address:     this.staffForm.get('address')?.value,
            gender:      this.staffForm.get('gender')?.value,
            image:       staffImage,
          },
        }).subscribe( ( {data}:any ) => {
          this.newstaff = data.addStaff; // this data.addStaff this addStaff comes from the name of the nutation in staffmutations.ts --> ADD_TRAINER --> mutation addStaff
          //alert("Estoy en pack-create.component - line 207 - PackSavingMutation - this.newpack = " + this.newpack);

          if (this.newstaff== null){
              this.toast.error('TRAINER Dont created ..');
              this.staffForm.reset();
              return;
          }
          
         if (this.newstaff!= null){
            this.toast.success('TRAINER Register Succesfully ....');
            this.router.navigateByUrl('homeAdmin');
         }
        },
       
      );
} // end of StaffSavingMutation();

/**************************************************************************** */
get name() { return this.staffForm.controls['name'];}
get email() { return this.staffForm.controls['email'];}
get age() { return this.staffForm.controls['age'];}
get field() { return this.staffForm.controls['field'];}
get id_card() { return this.staffForm.controls['id_card'];}
get phone() { return this.staffForm.controls['phone'];}
get address() { return this.staffForm.controls['address'];}
get gender() { return this.staffForm.controls['gender'];}
get image() { return this.staffForm.controls['image'];}

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








