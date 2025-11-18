import { Component, inject, DestroyRef,  OnInit, OnDestroy } from '@angular/core';
/**** The takeUntilDestroyed artifact is an operator that unsubscribes
from an observable when the component is destroyed. */
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
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
 // libs to handle mutations, queries
 import { ADD_MEMBER, VERIFY_MEMBER } from '../salesmutatiosn';

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
image = sessionStorage.getItem('image');
 /*** form to get some data from new member */
 membersForm = new FormGroup(
  {
  client_CI:  new FormControl('', [Validators.required, Validators.min(5)]),
  phone:  new FormControl('', [Validators.required, Validators.min(5)]), 
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
// var for Pack verified
memberVerified:any = "";
status: any = 'true';

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
  
  // get the id from route parameter
  this.routerParam.paramMap.subscribe(params =>{this.ItemClassId = params.get('id')})
  const id= this.ItemClassId;
  // call the getPackdata function to get data from pack choosed
  this.getPackData(id);
}

// function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }

// function to get class data from backend
getPackData(id:any): void {

  alert("Estoy en packs component - line 117 - id: " + id);
  // my query block begining
       this.querySubscription = this.apollo.watchQuery<any>({query: GET_PACK,variables: { id:id }}).valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe(({ data, loading, error }) => {
if (error) { alert('Error loading packs' + error); }
this.DataPack = data?.pack ?? data;
});
 } // End of GetProduct Data

// function to go back to homeAdmin
back() {this.router.navigate(['packs'],)}

/******** Function to veify if a pack exist ***************/
  MemberVerifyMutation(){
  alert("Estoy en member-create.component - MemberVerifyMutation - line 134 - email: " + this.email);
  this.apollo.mutate({
          mutation: VERIFY_MEMBER,
          variables: { email: this.email },
        }).
        subscribe( ( {data}:any ) => {
          this.memberVerified = data.verifyMember;
     alert("Estoy en member-create.component - MemberVerifyMutation - line 141 - this.memberVerified: " + this.memberVerified);     
          if (this.memberVerified != null){
              this.toast.error('Member Exist , use another Email to Create Member');
              this.membersForm.reset();
              return;
          }
          
         if (this.memberVerified == null){
             alert("Estoy en sales-component - line 168 - memberVerifyMutation - this.packVerified == null: Go to create member ..... ");
              this.MemberSavingMutation();          
         }
        },   
      );
} // end of packVerifyMutation() function
/**************************************************************************** */
// function to save Pack data to backend
MemberSavingMutation(){

/*alert("Estoy en member-create.component - line 149 - MemberSavingMutation - value.client_CI: " + this.membersForm?.value.client_CI);*/
this.apollo.mutate({
          mutation: ADD_MEMBER,
          variables: { namemember: this.UserName,
            client_CI:  this.membersForm?.value.client_CI, // Client CI
            email:      this.email,
            phone:      this.membersForm?.value.phone, // Client phone
            nameplan:   this.DataPack.nameplan,
            timedays:   this.DataPack.timedays,
            cost:       this.DataPack.cost,
            code:       this.DataPack.code,
            status:     this.status, 
            image:      this.image },
        }).subscribe( ( {data}:any ) => {
          this.Newmember = data.addMember; // this data.addMember this addMember comes from the name of the nutation in salesmutations.ts --> ADD_MEMBER --> mutation addMember
          //alert("Estoy en pack-create.component - line 207 - PackSavingMutation - this.newMember = " + this.Newmember);

          if (this.Newmember== null){
              this.toast.error('Member Exist , use another Email to Create New Member ..');
              this.membersForm.reset();
              return;
          }
          
         if (this.Newmember!= null){
            this.toast.success('Member Register Succesfully ....');
            this.router.navigateByUrl('homeAdmin');
         }
        },
       
      );
} // end of MemberSavingMutation();

/**************************************************************************** */

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
 
   // verify then create
    this.MemberVerifyMutation();
}

}
