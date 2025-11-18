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
import { DatePipe } from '@angular/common';
 // libs to handle queries
 import { Apollo } from 'apollo-angular';
 import { GET_MEMBER_BY_EMAIL } from './memberqueries';
 import { Subscription } from 'rxjs';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule,
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
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent implements OnInit, OnDestroy{

/********** trying to save image new procedure */
selectedFile: File | null = null;
// var to handle preview image
imagePreviewUrl: string = "";

// getting data from localstore

UserName = sessionStorage.getItem('name');
email = sessionStorage.getItem('email');

// vars to handle daysleft
currentDate: Date = new Date();
today:any = (this.currentDate).getTime();
daysLeft:any=0;
minisecondsLeft:any=0;
Finish_day:number=0;
daysLeft_mathFloor:number=0;

// Data that I want to get from URL sended by login component
ItemClassId: string | null = null;

// vars to handle the data from backend
DataMember:any = {};
Newmember: any = {};
mensajeBackend:any="";

// var to handle backend url
baseUrl = environment.endpoint;

private readonly packService = inject(PackService);
private readonly memberService = inject(MemberService);
private readonly router = inject(Router);
private readonly routerParam = inject(ActivatedRoute);
private readonly toast = inject (ToastrService);
//private datePipe= inject(DatePipe);
// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);
private querySubscription: Subscription | undefined;



ngOnInit(): void {   this.getMemberData(this.email); }

// function to unsubscribe apollo query
  ngOnDestroy(): void { this.querySubscription?.unsubscribe(); }

// function to get class data from backend
getMemberData(email:any): void {

  //alert("Estoy en packs component - line 107 - email: " + email);
  // my query block begining
       this.querySubscription = this.apollo.watchQuery<any>({query: GET_MEMBER_BY_EMAIL,variables: { email:email }}).valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe(({ data, loading, error }) => {
if (error) { alert('Error loading packs' + error); }

this.DataMember = data?.memberByEmail ?? data;

// Example: Use UTC time for both dates
const todayFIA = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
const finishAtFIA = new Date(this.DataMember.finishAt).getTime(); // Ensure this is UTC
this.Finish_day= new Date(finishAtFIA).getTime();
this.minisecondsLeft= [(this.Finish_day - todayFIA)];
const millisecondsPerDay = 1000 * 60 * 60 * 24;
this.daysLeft= this.minisecondsLeft/millisecondsPerDay
//alert("Estoy en status component - line 121 - this.daysLeft: " + this.daysLeft);
this.daysLeft_mathFloor = Math.floor(this.daysLeft);
//alert("Estoy en status component - line 123 - this.daysLeft_mathFloor: " + this.daysLeft_mathFloor);
});

 } // End of GetProduct Data

// function to go back to home
back() {this.router.navigate(['home'],)}


}




