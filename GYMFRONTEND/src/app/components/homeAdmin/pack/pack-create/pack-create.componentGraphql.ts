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
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapMailbox2Flag, 
         bootstrapCalendar2DayFill, 
         bootstrapKeyFill,
         bootstrapBack,
         bootstrapFileEarmarkSpreadsheet,
         bootstrapFiletypeKey,
         bootstrapCoin,
         bootstrapReceipt,
         bootstrapChevronRight,
         bootstrapCheckCircle

         } from '@ng-icons/bootstrap-icons';

import { PackService } from '../../../../core/services/pack/pack.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
// libs to handle mutations, queries
import { Apollo } from 'apollo-angular';
import { ADD_PACK, VERIFY_PACK } from '../packmutation';

@Component({
  selector: 'app-pack-create',
  standalone: true,
  imports: [ ReactiveFormsModule,
             CardModule,
             InputTextModule,
             CommonModule,
             ButtonModule,
             NgIcon],
providers: [provideIcons({ bootstrapMailbox2Flag, 
                           bootstrapKeyFill, 
                           bootstrapBack,
                           bootstrapCalendar2DayFill,
                           bootstrapFileEarmarkSpreadsheet,
                           bootstrapFiletypeKey,
                           bootstrapCoin,
                           bootstrapReceipt,
                           bootstrapChevronRight,
                           bootstrapCheckCircle }),
                           
                           ToastrService],
  templateUrl: './pack-create.component.html',
  styleUrl: './pack-create.component.css'
})
export class PackCreateComponent {

// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);

/********** trying to save image new procedure */
selectedFile: File | null = null;
/***************end block new procedure ****** */


// var to handle messages from backend about the pack process
mensajeBackend:any=[];
datapack:any=[];
newpack:any=[];
AddModel: any = {image:[]};

// var to handle preview image
imagePreviewUrl: string = "";
// var to handle upload pack Image
dataPackImage: any = '';
newPackImagePath: string = '';
// var for Pack verified
packVerified:any = "";


// inject services dependecies 
private readonly packService = inject(PackService);
private readonly router = inject(Router);
private readonly toast = inject (ToastrService);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);


packForm = new FormGroup(
  {
    nameplan:  new FormControl('', [Validators.required]),
    trialdays:  new FormControl('', [Validators.required ]),
    features:  new FormControl('', [Validators.required ]),
    timedays:  new FormControl('', [Validators.required ]),
    cost:  new FormControl('', [Validators.required ]),
    code:  new FormControl('', [Validators.required ]),
    status:  new FormControl('', [Validators.required ]),
    description:  new FormControl('', [Validators.required]),
    image: new FormControl(this.selectedFile, [Validators.required,])
    
  },
);

// function to send to server the image file, and get the imageUrl
GetPackImage(selectedFile:any) {
   alert("Estoy en register.component - line 106 - GetPackImage: selectedFile " + selectedFile);
// Create a postData object to send the data with the file
    const postDataImage:any = new FormData();
    // Append the selected file if any
    if (selectedFile) 
      { postDataImage.append('Dataimage', selectedFile) }
    // call the service to upload an image file to multer route in server
    /****begin multer block ****************************************/

    this.packService.uploadPackImage(postDataImage as any).pipe(
    takeUntilDestroyed(this.destroyRef)).subscribe({
    next: (response) => {
        
        this.dataPackImage = response;
        this.newPackImagePath = this.dataPackImage.image;
        alert("Estoy en pack-create.component - line 121 - this.newPackImagePath:  " + this.newPackImagePath);
        const PackImage = this.newPackImagePath;
        this.PackSavingMutation(PackImage);
      if (!this.newPackImagePath) { this.toast.error('Something went wrong')};
      return;  
  } 
  }); // end of this.packService.uploadPackImage

} // end of GetPackImage

/*********************************************************** */
onpack() {

  /**** for testing purposes ************/
  try{
    if(this.packForm.valid){
      alert('Profile form is valid');
    } else {
      alert('Profile form invalid');
    }
  } catch(error){}

 /**** End block for testing purposes */ 
 /**** Check if the form is invalid ****/

 if (this.packForm.invalid) {
  this.toast.error('Error','Please complete all required fields.');
  return;
}

//const postData = { ...this.packForm.value };

/*** call Function to verify if Pack exist */  
this.PackVerifyMutation();
  
} // end of onpack
/**************************************************************************** */

PackVerifyMutation(){
  this.apollo.mutate({
          mutation: VERIFY_PACK,
          variables: {
            code:    this.packForm.get('code')?.value,
          },
        }).
        subscribe( ( {data}:any ) => {
          this.packVerified = data.verifypack;
          
          if (this.packVerified != null){
              this.toast.error('pack Exist , use another Code to SignUp');
              this.packForm.reset();
              return;
          }
          
         if (this.packVerified == null){
          
             alert("Estoy en pack-create.component - line 179 - packVerifyMutation - this.packVerified == null: Go to create image ..... ");
             this.GetPackImage(this.selectedFile);          

         }
        },
       
      );
} // end of packVerifyMutation() function
/**************************************************************************** */
// function to save Pack data to backend
PackSavingMutation(packImage: any){
alert("Estoy en pack-create.component - line 190 - PackSavingMutation - packImage:  " + packImage);

this.apollo.mutate({
          mutation: ADD_PACK,
          variables: {
            nameplan:  this.packForm.get('nameplan')?.value,
            trialdays: this.packForm.get('trialdays')?.value,
            description:this.packForm.get('description')?.value,
            features: this.packForm.get('features')?.value,
            timedays: this.packForm.get('timedays')?.value,
            cost:     this.packForm.get('cost')?.value,
            code:     this.packForm.get('code')?.value,
            status:   this.packForm.get('status')?.value,
            image:    packImage,        
          },
        }).subscribe( ( {data}:any ) => {
          this.newpack = data.addPack; // this data.addpack this addpack comes from the name of the nutation in packmutations.ts --> ADD_PACK --> mutation addpack
          alert("Estoy en pack-create.component - line 207 - PackSavingMutation - this.newpack = " + this.newpack);

          if (this.newpack== null){
              this.toast.error('Pack Exist , use another Code to Create New Pack ..');
              this.packForm.reset();
              return;
          }
          
         if (this.newpack!= null){
            this.toast.success('Pack Register Succesfully ....');
            this.router.navigateByUrl('homeAdmin');
         }
        },
       
      );
} // end of PackSavingMutation();

/**************************************************************************** */

get nameplan() { return this.packForm.controls['nameplan'];}
get trialdays() { return this.packForm.controls['trialdays'];}
get features() { return this.packForm.controls['features'];}
get timedays() { return this.packForm.controls['timedays'];}
get cost() { return this.packForm.controls['cost'];}
get code() { return this.packForm.controls['code'];}
get status() { return this.packForm.controls['status'];}
get description() { return this.packForm.controls['description'];}
get image() { return this.packForm.controls['image'];}

/** function to handle the image input in form */
  changeImg(event:any) {this.selectedFile = event.target.files[0];

    // this is to show the image preview in vomponent view
    if (this.selectedFile) {
      // The FileReader API reads the file as a data URL, which is a string representation of the image data.
      const reader = new FileReader();
        reader.onload = (event:any) => {
          this.imagePreviewUrl = event.target.result as string; };
        reader.readAsDataURL(this.selectedFile);
      }
    } //  end of function to handle the image input in form


  }