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
import { 
  bootstrapMailbox2Flag, 
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
// libs to handle queries
import { Apollo } from 'apollo-angular';
import { GET_PACK } from '../packqueries';
import { UPDATE_PACK, DELETE_PACK_IMAGE } from '../packmutation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pack-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    NgIcon],
  providers: [provideIcons({ 
    bootstrapMailbox2Flag, 
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
  templateUrl: './pack-edit.component.html',
  styleUrl: './pack-edit.component.css'
})
export class PackEditComponent implements OnInit, OnDestroy{

// Data that I want to get from URL sended by login component

mensajeBackend:any=""; // var to handle ok messages
AddModel: any = {image:[]};
param :string="";
element:any={};

// var to handle answer from backend when erase image
packImageDeleted: any = '';

//pack var to handle update
dataPack:any={};
selectedFile: File | null = null; // var to handle the image
// var to get Id from route
ItemPackId: string | null = null; 

// var to handle preview image
imagePreviewUrl: string = "";

// var to handle upload pack Image
dataPackImage: any = '';
newPackImagePath: string = '';
OldImage: string = '';


private readonly packService = inject(PackService);
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
  // When the component starts call the function updatePackData

  this.updatePackData();
  // get the id, sended by the URL, routerParam, in app.routes.ts -> editPack/:id
  this.routerParam.paramMap.subscribe(params =>{this.ItemPackId = params.get('id')})
  const id= this.ItemPackId
  //alert ("Estoy en ngOnInit - category-edit.component - line 104 - id: "+id);
  this.getPackData(id);
}

// function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }


/**** editeditPackForm  */
editPackForm = new FormGroup({
    nameplan:  new FormControl('', [Validators.required, Validators.min(5)]),
    trialdays:  new FormControl('', [Validators.required ]),
    features:  new FormControl('', [Validators.required ]),
    timedays:  new FormControl('', [Validators.required ]),
    cost:  new FormControl('', [Validators.required ]),
    code:  new FormControl('', [Validators.required ]),
    status:  new FormControl('', [Validators.required ]),
    description:  new FormControl('', [Validators.required]),
    image: new FormControl(this.selectedFile, [Validators.required,])
}); 

// delete all fields in form
updatePackData(){

  this.editPackForm = new FormGroup({

    nameplan:  new FormControl('', [Validators.required, Validators.min(5)]),
    trialdays:  new FormControl('', [Validators.required ]),
    features:  new FormControl('', [Validators.required ]),
    timedays:  new FormControl('', [Validators.required ]),
    cost:  new FormControl('', [Validators.required ]),
    code:  new FormControl('', [Validators.required ]),
    status:  new FormControl('', [Validators.required ]),
    description:  new FormControl('', [Validators.required]),
    image: new FormControl(this.selectedFile, [Validators.required,])
      
  }); 
}
/**** function to get the data to fill form  from backend - old values*/

getPackData(id:any): void {
  //alert("Estoy en editcategory - line 145 - getCategoryData - id: "+ id);

  // get data to fill the form from graphql apollo client 
   this.querySubscription = this.apollo.watchQuery<any>({query: GET_PACK, variables: { id:id } }).valueChanges.subscribe(({ data }:any) => {
        //alert("Estoy en pack-edit component - line 148 - data: " + data );         
        if (data) {
          this.dataPack = data.pack;
         //alert("Estoy en pack-edit - line 152 - this.DataPack.nameplan="+ this.dataPack.nameplan);
          this.toast.success('Got Packs Data From Backend');
        }
     ; 
    // end of bloack to get getpack from graphQl mutation
      //alert("Estoy en pack-edit component- line 157 - this.DataPack.image="+ this.dataPack.image);  
      this.OldImage = this.dataPack.image;

      this.editPackForm.patchValue({
    nameplan:     this.dataPack.nameplan,
    trialdays:    this.dataPack.trialdays,
    features:     this.dataPack.features,
    timedays:     this.dataPack.timedays,
    cost:         this.dataPack.cost,
    code:         this.dataPack.code,
    status:       this.dataPack.status,
    description:  this.dataPack.description,
   
      });
   
   })
  
  } // End of GetPack Data

/***** End of Block to function to get the data to fill form  from backend - old values - */

/******** Function to delete a pack image on the server ***************/
 PackDeleteImageMutation = async () => {

   alert("EStoy en pack - edit - component - line 179 - Edit pack - this.OldImage: " + this.OldImage);
  this.apollo.mutate({
          mutation:  DELETE_PACK_IMAGE,
          variables: { image: this.OldImage },
        }).
        subscribe( ( {data}:any ) => {
          this.packImageDeleted = data.deletePackImage;
          
          if (this.packImageDeleted != null){
              this.toast.success('Pack Image Deleted Successfully .....');
              return;
          }
        }) // end of this.apollo.mutate({mutation:  UPDATE PACK
 }
  // end of PackDeleteImageMutation function
/**** function to edit pack  **************************************************************/

EditPack(): void{
   
      /** If the form is not valid */  
      if (!this.editPackForm.valid) {
        // Send a message to complete the data in form    
        this.toast.error('Please Fill all Form Fields.!');
     } else { if (window.confirm('Are you sure?')) {
        
     this.PackDeleteImageMutation();
     this.GetPackImage(this.selectedFile);

     }
    }
  }// End Block function to edit a pack 
// function to send to server the image file, and get the imageUrl
GetPackImage(selectedFile:any) {
   alert("Estoy en pack-edit.component - line 213 - GetPackImage: selectedFile " + selectedFile);
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
        alert("Estoy en pack-edit.component - line 227 - this.newPackImagePath:  " + this.newPackImagePath);
        const PackImage = this.newPackImagePath;
        this.PackUpdatingMutation(PackImage);
      if (!this.newPackImagePath) { this.toast.error('Something went wrong')};
      return;  
  } 
  }); // end of this.packService.uploadPackImage

} // end of GetPackImage

/*********************************************************** */
// function to save Pack data to backend
PackUpdatingMutation(packImage: any){

  // get the id, sended by the URL, routerParam, in app.routes.ts -> editPack/:id
  this.routerParam.paramMap.subscribe(params =>{this.ItemPackId = params.get('id')})
  const id= this.ItemPackId
  alert("Estoy en pack-edit.component - line 244 - PackUpdatingMutation - id:  " + id);
  alert("Estoy en pack-edit.component - line 245 - PackUpdatingMutation - packImage:  " + packImage);
  alert("Estoy en pack-edit.component - line 246 - PackUpdatingMutation - this.editPackForm?.value.nameplan:  " + this.editPackForm?.value.nameplan);

this.apollo.mutate({
          mutation: UPDATE_PACK,
          variables: {
                id:          id,
                nameplan:    this.editPackForm?.value.nameplan, 
                trialdays:   this.editPackForm?.value.trialdays, 
                description: this.editPackForm?.value.description,
                features:    this.editPackForm?.value.features,
                timedays:    this.editPackForm?.value.timedays,
                cost:        this.editPackForm?.value.cost,
                code:        this.editPackForm?.value.code,
                status:      this.editPackForm?.value.status,
                image:       packImage,       
          },
        }).subscribe( ( {data}:any ) => {
          this.updatePackData = data.updatePack; // this data.addpack this addpack comes from the name of the nutation in packmutations.ts --> ADD_PACK --> mutation addpack
          //alert("Estoy en pack-create.component - line 264 - PackSavingMutation - this.newpack = " + this.newpack);

          if (this.updatePackData == null){
              this.toast.error('Pack Not Updated, there were Something ..');
              this.editPackForm.reset();
              return;
          }
          
         if (this.updatePackData!= null){
            this.toast.success('Pack Updated Succesfully ....');
            this.router.navigateByUrl('homeAdmin');
         }
        },
       
      );
} // end of PackSavingMutation();

/**************************************************************************************** */
/****  end of function to edit pack ***************************************************** */

// Getter to access form control
get myForm() { return this.editPackForm.controls;}
get nameplan() { return this.editPackForm.controls['nameplan'];}
get trialdays() { return this.editPackForm.controls['trialdays'];}
get features() { return this.editPackForm.controls['features'];}
get timedays() { return this.editPackForm.controls['timedays'];}
get cost() { return this.editPackForm.controls['cost'];}
get code() { return this.editPackForm.controls['code'];}
get status() { return this.editPackForm.controls['status'];}
get description() { return this.editPackForm.controls['description'];}
get image() { return this.editPackForm.controls['image'];}
   // function to get the image
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
