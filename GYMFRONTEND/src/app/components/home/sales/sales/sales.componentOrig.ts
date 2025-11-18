import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
/**** The takeUntilDestroyed artifact is an operator that unsubscribes
from an observable when the component is destroyed. */
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PackService } from '../../../../core/services/pack/pack.service';
import { MemberService } from '../../../../core/services/member/member.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapPersonCircle, 
         bootstrapHouseAddFill, 
         bootstrapTelephoneForwardFill  } from '@ng-icons/bootstrap-icons';
import { environment } from '../../../../environments/environments';
import { bootstrapChevronRight} from '@ng-icons/bootstrap-icons';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
 // libs to handle queries
 import { Apollo } from 'apollo-angular';
 import { GET_PACK } from '../../packs/packqueries';
 import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [    CommonModule,
                NgIcon, 
                ReactiveFormsModule,
                CardModule,
                InputTextModule,
                ButtonModule,
                NgIcon,
                
      ],
  providers: [provideIcons({ bootstrapPersonCircle, 
                             bootstrapHouseAddFill, 
                             bootstrapTelephoneForwardFill, 
                             bootstrapChevronRight }),
                             ToastrService],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit, OnDestroy{

/********** trying to save image new procedure */
selectedFile: File | null = null;
// var to handle preview image
imagePreviewUrl: string = "";

// getting data from localstore

UserName = sessionStorage.getItem('name');
email = sessionStorage.getItem('email');

 /*** form to get some data from new member */

 membersForm = new FormGroup(
  {
  client_CI:  new FormControl('', [Validators.required, Validators.min(5)]),
  phone:  new FormControl('', [Validators.required, Validators.min(5)]),
  image: new FormControl(this.selectedFile, [Validators.required,])
    
  },
);

// Data that I want to get from URL sended by login component
ItemClassId: string | null = null;

// vars to handle the data from backend
DataMember:any = [];
Newmember: any = [];
DataPack:any = [];
mensajeBackend:any="";

// var to handle backend url
baseUrl = environment.endpoint;

private readonly packService = inject(PackService);
private readonly memberService = inject(MemberService);
private readonly router = inject(Router);
private readonly routerParam = inject(ActivatedRoute);
private readonly toast = inject (ToastrService);
// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);
private querySubscription: Subscription | undefined;


ngOnInit(): void {
  
  this.routerParam.paramMap.subscribe(params =>{this.ItemClassId = params.get('id')})

  const id= this.ItemClassId;
  alert("Estoy en packs component - line 104 - id: " + id);
  // my query block begining
       this.querySubscription = this.apollo.watchQuery<any>({query: GET_PACK,variables: { id:id }}).valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe(({ data, loading, error }) => {
if (error) { alert('Error loading packs' + error); }
this.DataPack = data?.pack ?? data;
});
}

// function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }

// function to get class data from backend
getPackData(id:any): void {

 } // End of GetProduct Data

// function to go back to homeAdmin
back() {this.router.navigate(['packs'],)}

onCreateBill() {

  /**** for testing purposes ************/
  try{
    if(this.membersForm.valid){
      alert('Profile form is valid');
    } else {
      this.toast.error('Error','Please complete all required fields.');
      return;
    }
  } catch(error){console.log('error: '+error)};
 
  const client_CI = this.membersForm?.value.client_CI; // Client CI
  const phone = this.membersForm?.value.phone; // Client phone
  const selectedFile = this.membersForm?.value.image;
  const namemember: any = this.UserName;
  const email: any = this.email;
  const nameplan = this.DataPack.nameplan;
  const timedays = this.DataPack.timedays;
  const code = this.DataPack.code;
  const cost = this.DataPack.cost;

  const postData: any = { client_CI, phone, namemember, email,
                          nameplan, timedays,code,cost };


  this.memberService.createmember(postData, (this.selectedFile)).pipe(
 
   takeUntilDestroyed(this.destroyRef)).subscribe({
     next: (response) => {
                                
              this.DataMember = response;
              this.mensajeBackend = this.DataMember.message;
              this.Newmember = this.DataMember.NewMember;
              
alert("Estoy en bill.component - line 152 - this.mensajeBackend:  "+this.mensajeBackend);                        
alert("Estoy en bill.component - line 186 - this.newsale:  " +this.Newmember);

if (!this.Newmember) {     
  if (this.mensajeBackend){
    this.toast.error(this.mensajeBackend);
  }}

if (this.Newmember) {
this.toast.success('Create supply component - line 162 -Create Member successfully');

// reset form: reactiveFurnitureForm
this.membersForm.reset();

// go to home /Sales to update listProducts view

this.router.navigate(['/home'],{skipLocationChange: true}).then(() => this.router.navigate(['/packs'])); // then I go to sales /

                            
}

}}

)}

get image() { return this.membersForm.controls['image'];}

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