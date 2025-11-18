import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
/**** The takeUntilDestroyed artifact is an operator that unsubscribes
from an observable when the component is destroyed. */
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapMailbox2Flag, 
         bootstrapHouseAddFill, 
         bootstrapPersonCircle,
         bootstrapCalendar2DayFill,
         bootstrapBack,
         bootstrapPhone,
         bootstrapFiletypeKey,
         bootstrapCoin,
         bootstrapReceipt,
         bootstrapChevronRight,
         bootstrapCheckCircle } from '@ng-icons/bootstrap-icons';
import { ClassesService } from '../../../../core/services/classes/classes.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
// libs to handle queries
import { Apollo } from 'apollo-angular';
import { GET_CLASSE } from '../classesqueries';
import { UPDATE_CLASS, DELETE_CLASS_IMAGE } from '../classesmutation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-classes-edit',
  standalone: true,
  imports: [ReactiveFormsModule,
             CardModule,
             InputTextModule,
             ButtonModule,
             NgIcon],
  providers: [provideIcons({ 
                           bootstrapMailbox2Flag, 
                           bootstrapHouseAddFill, 
                           bootstrapBack,
                           bootstrapPersonCircle,
                           bootstrapPhone,
                           bootstrapFiletypeKey,
                           bootstrapCoin,
                           bootstrapReceipt,
                           bootstrapChevronRight,
                           bootstrapCheckCircle,
                           bootstrapCalendar2DayFill }),
                  
                  ToastrService],
  templateUrl: './classes-edit.component.html',
  styleUrl: './classes-edit.component.css'
})
export class ClassesEditComponent implements OnInit, OnDestroy{

// Data that I want to get from URL sended by login component
mensajeBackend:any=""; // var to handle ok messages
newClass:any=[];
AddModel: any = {image:[]};
otherparam :string="";
param :string="";
element:any={};
// var to handle answer from backend when erase image
classImageDeleted: any = '';
//pack var to handle update
dataClass:any={};
selectedFile: File | null = null; // var to handle the image
// var to get Id from route
ItemClassId: string | null = null; 

// var to handle preview image
imagePreviewUrl: string = "";

// var to handle upload Image
dataClassImage: any = '';
newClassImagePath: string = '';
OldImage: string = '';

private readonly classesService = inject(ClassesService);
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
  // When the component starts call the function updateCategoryData

  this.updateClassData();
  // get the id, sended by the URL, routerParam, in app.routes.ts -> editcategory/:id
  this.routerParam.paramMap.subscribe(params =>{this.ItemClassId = params.get('id')})
  const id= this.ItemClassId
  
  //alert ("Estoy en ngOnInit - category-edit.component - line 69 - id: "+id);


  this.getClassData(id);
}

// function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }

/**** editClassForm  */
editClassForm = new FormGroup({

    classname:  new FormControl('', [Validators.required, Validators.min(5)]),
    code:       new FormControl('', [Validators.required ]),
    classday:  new FormControl('', [Validators.required ]),
    classtime:  new FormControl('', [Validators.required ]),
    classlevel:  new FormControl('', [Validators.required ]),
    session_time:  new FormControl('', [Validators.required]),
    price:  new FormControl('', [Validators.required ]),
    trainer:  new FormControl('', [Validators.required]),
    dateBegin:  new FormControl('', [Validators.required]),
    key_benefits:  new FormControl('', [Validators.required]),
    expert_trainer:  new FormControl('', [Validators.required]),
    class_overview:  new FormControl('', [Validators.required]),
    why_matters:  new FormControl('', [Validators.required]),    
    image: new FormControl(this.selectedFile, [Validators.required,])
  
}); 

// delete all fields in form
updateClassData(){

  this.editClassForm = new FormGroup({

    classname:  new FormControl('', [Validators.required]),
    code:       new FormControl('', [Validators.required ]),
    classday:  new FormControl('', [Validators.required ]),
    classtime:  new FormControl('', [Validators.required ]),
    classlevel:  new FormControl('', [Validators.required ]),
    session_time:  new FormControl('', [Validators.required ]),
    price:  new FormControl('', [Validators.required]),
    trainer:  new FormControl('', [Validators.required]),
    dateBegin:  new FormControl('', [Validators.required]),
    key_benefits:  new FormControl('', [Validators.required]),
    expert_trainer:  new FormControl('', [Validators.required]),
    class_overview:  new FormControl('', [Validators.required]),
    why_matters:  new FormControl('', [Validators.required]),    
    image: new FormControl(this.selectedFile, [Validators.required,])
      
  }); 
}

getClassData(id:any): void {
  //alert("Estoy en classes - edit - line 152 - getClassData - id: "+ id);
    // get data to fill the form from graphql apollo client 
     this.querySubscription = this.apollo.watchQuery<any>({query: GET_CLASSE, variables: { id:id } }).valueChanges.subscribe(({ data }:any) => {
          //alert("Estoy en class-edit component - line 155 - data: " + data );         
          if (data) {
            this.dataClass = data.classe;
           //alert("Estoy en class-edit - line 158 - this.DataClass.nameplan="+ this.dataClass.classname);
           //alert("Estoy en class-edit component- line 159 - this.DataClass.image="+ this.dataClass.image);  
           this.OldImage = this.dataClass.image;
            this.toast.success('Got Class Data From Backend');
          }
       ; 
      // end of block to get getclass from graphQl mutation
      
  
        this.editClassForm.patchValue({

            classname:      this.dataClass.classname,
            code:           this.dataClass.code,
            classday:       this.dataClass.classday,
            classtime:      this.dataClass.classtime,
            classlevel:     this.dataClass.classname,
            session_time:   this.dataClass.session_time,
            price:          this.dataClass.price,
            trainer:        this.dataClass.trainer,
            dateBegin:      this.dataClass.dateBegin,
            key_benefits:   this.dataClass.key_benefits,
            expert_trainer: this.dataClass.expert_trainer,
            class_overview: this.dataClass.class_overview,
            why_matters:    this.dataClass.why_matters,
        });
     })
    } // End of GetClass Data
/***** End of Block to function to get the data to fill form  from backend - old values - */

/******** Function to delete a pack image on the server ***************/
 ClassDeleteImageMutation = async () => {
   //alert("EStoy en classes- edit - component - line 190 - PackDeleteImageMutation - this.OldImage: " + this.OldImage);
  this.apollo.mutate({
          mutation:  DELETE_CLASS_IMAGE,
          variables: { image: this.OldImage },
        }).
        subscribe( ( {data}:any ) => {
          this.classImageDeleted = data.deleteClassImage;
          
          if (this.classImageDeleted != null){
              this.toast.success('Class Image Deleted Successfully .....');
              return;
          }
        }) // end of this.apollo.mutate({mutation:  DELETE_CLASS_IMAGE
 }
  // end of ClassDeleteImageMutation function
/**** function to edit pack  **************************************************************/

   EditClass(): void{
   
      /** If the form is not valid */  
      if (!this.editClassForm.valid) {
      
        // Send a message to complete the data in form    
        this.toast.error('Please Fill all Form Fields.!');
    
     } else {
    
      if (window.confirm('Are you sure?')) {
    /*** service to erase old image  ****************************************/
     this.ClassDeleteImageMutation();
     this.GetClassImage(this.selectedFile); 
    }}
      }// End Block function to edit a class 

// function to send to server the image file, and get the imageUrl
GetClassImage(selectedFile:any) {
//alert("Estoy en class-edit.component - line 225 - GetClassImage: selectedFile " + selectedFile);
// Create a postData object to send the data with the file
    const postDataImage:any = new FormData();
    // Append the selected file if any
    if (selectedFile) 
      { postDataImage.append('Dataimage', selectedFile) }
    // call the service to upload an image file to multer route in server
    /****begin multer block ****************************************/

    this.classesService.uploadClassImage(postDataImage as any).pipe(
    takeUntilDestroyed(this.destroyRef)).subscribe({
    next: (response) => {
        
        this.dataClassImage = response;
        this.newClassImagePath = this.dataClassImage.image;
        //alert("Estoy en class-edit.component - line 240 - this.newClassImagePath:  " + this.newClassImagePath);
        const ClassImage = this.newClassImagePath;
        this.ClassUpdatingMutation(ClassImage);
      if (!this.newClassImagePath) { this.toast.error('Something went wrong')};
      return;  
  } 
  }); // end of this.classService.uploadPackImage

} // end of GetPackImage

/*********************************************************** */
// function to save Pack data to backend
ClassUpdatingMutation(ClassImage: any){

  // get the id, sended by the URL, routerParam, in app.routes.ts -> editPack/:id
  this.routerParam.paramMap.subscribe(params =>{this.ItemClassId = params.get('id')})
  const id= this.ItemClassId
  //alert("Estoy en class-edit.component - line 271 - ClassUpdatingMutation - id:  " + id);
this.apollo.mutate({
          mutation: UPDATE_CLASS,
          variables: {
                id:             id,
                classname:      this.editClassForm?.get('classname')?.value,
                code:           this.editClassForm?.get('code')?.value,
                classday:       this.editClassForm?.get('classday')?.value,
                classtime:      this.editClassForm?.get('classtime')?.value,
                classlevel:     this.editClassForm?.get('classlevel')?.value,
                session_time:   this.editClassForm?.get('session_time')?.value,
                price:          this.editClassForm?.get('price')?.value,
                trainer:        this.editClassForm?.get('trainer')?.value,
                dateBegin:      this.editClassForm?.get('dateBegin')?.value,
                key_benefits:   this.editClassForm?.get('key_benefits')?.value,
                expert_trainer: this.editClassForm?.get('expert_trainer')?.value,
                class_overview: this.editClassForm?.get('class_overview')?.value,
                why_matters:    this.editClassForm?.get('why_matters')?.value,
                image:          ClassImage,       
          },
        }).subscribe( ( {data}:any ) => {
          this.updateClassData = data.updateClass; // this data.updateClass this updateClass comes from the name of the nutation in classmutations.ts --> UPDATE_CLASS --> mutation updateclass
          //alert("Estoy en classes-edit-.component - line 279 - ClassUp´datingMutation - this.updateClassData = " + this.updateClassData);

          if (this.updateClassData == null){
              this.toast.error('Pack Not Updated, there were Something ..');
              this.editClassForm.reset();
              return;
          }
          
         if (this.updateClassData!= null){
            this.toast.success('Class Updated Succesfully ....');
            this.router.navigateByUrl('homeAdmin');
         }
        },
       
      );
} // end of PackSavingMutation();

/**************************************************************************************** */
/****  end of function to edit pack ***************************************************** */



// Getter to access form control
get myForm() { return this.editClassForm.controls;}
get classname() {return this.editClassForm.controls['classname'];}
get code() { return this.editClassForm.controls['code'];}
get classday() { return this.editClassForm.controls['classday'];}

get classtime() { return this.editClassForm.controls['classtime'];}
get classlevel() { return this.editClassForm.controls['classlevel'];}
get session_time() { return this.editClassForm.controls['session_time'];}
get price() { return this.editClassForm.controls['price'];}
get trainer() { return this.editClassForm.controls['trainer'];}
get dateBegin() { return this.editClassForm.controls['dateBegin'];}
get key_benefits() { return this.editClassForm.controls['key_benefits'];}
get expert_trainer() { return this.editClassForm.controls['expert_trainer'];}
get class_overview() { return this.editClassForm.controls['class_overview'];}
get why_matters() { return this.editClassForm.controls['why_matters'];}
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

