import { Component, inject, DestroyRef, OnInit } from '@angular/core';
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
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { passwordMismatchValidator } from '../../../core/services/password-mismatch.directive';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/interfaces/auth/auth';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapMailbox2Flag } from '@ng-icons/bootstrap-icons';
import { bootstrapKeyFill } from '@ng-icons/bootstrap-icons';
import { bootstrapPersonCircle } from '@ng-icons/bootstrap-icons';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
// libs to handle mutations, queries
import { Apollo } from 'apollo-angular';
import { ADD_USER, VERIFY_USER } from '../authmutations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule,
             CardModule,
             InputTextModule,
             CommonModule,
             PasswordModule,
             ButtonModule,
             NgIcon
],
providers: [provideIcons({ bootstrapMailbox2Flag, bootstrapKeyFill, bootstrapPersonCircle }),ToastrService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

/********** trying to save image new procedure */
selectedFile: File | null = null;
// var to handle preview image
imagePreviewUrl: string = "";

// Declare the following property to inject the DestroyRef service:
private readonly destroyRef = inject(DestroyRef);
// var to handle messages from backend about the register process
mensajeBackend:any=[];
// var to handle user
user:any='';
newUser:any[] = [];
// var for user verified
userVerified:any[] = [];
// var to handle is admin
haveAdmin: any = '';
isAdmin: string = '';
// var to handle upload user Image
dataUserImage: any = '';
newUserImagePath: string = '';

// inject services dependecies 
private readonly authService = inject(AuthService);
private readonly router = inject(Router);
private readonly toast = inject (ToastrService);
// inject apollo as a service on this stand alone component
private readonly apollo =  inject (Apollo);

ngOnInit(): void { 
  
  // To call this function is for allowing the register option the first time
  // that the system runs to create the admin user, who will handle the admin section
  
  this.getThereIsAdmin();
} // end of ngOnInit

/*** Function to check if there is an Admin in database */
getThereIsAdmin() {

  this.authService.getAllAdmin().pipe(
    takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ( response:any ) => {

        const haveData = response;
        const HaveAdmin = haveData.haveAdmin;
        //alert("Estoy en register.component - line 87 - HaveAdmin:  "+HaveAdmin);
        if (HaveAdmin =='false') {
          this.isAdmin = 'true';
        } else {
          this.isAdmin = 'false';
        }
      }}
  );
}

registerForm = new FormGroup(
  {
    fullName: new FormControl('', [Validators.required, Validators.min(3)]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/[a-z0-9\._%\+\-]+@[a-z0-9\.\-]+\.[a-z]{2,}$/),
    ]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    image: new FormControl(this.selectedFile, [Validators.required,])
  },
  {
    validators: passwordMismatchValidator,
  }
);
// function to send to server the image file, and get the imageUrl
GetUserImage(selectedFile:any) {
   alert("Estoy en register.component - line 114 - GetUserImage: selectedFile " + selectedFile);
// Create a postData object to send the data with the file
    const postDataImage:any = new FormData();
    // Append the selected file if any
    if (selectedFile) 
      { postDataImage.append('Dataimage', selectedFile) }
    // call the service to upload an image file to multer route in server
    /****begin multer block ****************************************/

    this.authService.uploadUserImage(postDataImage as any).pipe(
    takeUntilDestroyed(this.destroyRef)).subscribe({
    next: (response) => {
        
        this.dataUserImage = response;
        this.newUserImagePath = this.dataUserImage.image;
        //alert("Estoy en register.component - line 129 - this.newUserImagePath:  " + this.newUserImagePath);
        const userImage = this.newUserImagePath;
        this.UserSavingMutation(userImage);
      if (!this.newUserImagePath) { this.toast.error('Something went wrong')};
      return;  
  } 
  }); // end of this.authService.uploadUserImage
    
    /**** end multer block ****************************************/
} // end of GetUserImage

onRegister() {

  /**** for testing purposes ************/
  try{
    if(this.registerForm.valid){
      alert('Profile form is valid');
    } else {
      alert('Profile form invalid');
    }
  } catch(error){}

 /**** End block for testing purposes */ 
 /**** Check if the form is invalid ****/

 if (this.registerForm.invalid) {
  this.toast.error('Error','Por favor, completa todos los campos requeridos.');
  return;
}
/**** my postdata new block *******************/
/*** call Function to verify if user exist */  
this.UserVerifyMutation();

}
/*** Function to verify if user exist */
UserVerifyMutation(){
  this.apollo.mutate({
          mutation: VERIFY_USER,
          variables: {
            email:    this.registerForm.get('email')?.value,
          },
        }).
        subscribe( ( {data}:any ) => {
          this.userVerified = data.verifyUser;
          
          if (this.userVerified != null){
              this.toast.error('User Exist , use another Email to SignUp');
              this.registerForm.reset();
              return;
          }
          
         if (this.userVerified == null){
          
             alert("Estoy en register.component - line 181 - UserVerifyMutation - this.userVerified == null: Go to create image ..... ");
             this.GetUserImage(this.selectedFile);          

         }
        },
       
      );
} // end of UserVerifyMutation() function

// function to save user data to backend
UserSavingMutation(userImage: any){
//alert("Estoy en register.component - line 165 - UserSavingMutation - userImage:  " + userImage);
this.apollo.mutate({
          mutation: ADD_USER,
          variables: {
            fullName: this.registerForm.get('fullName')?.value,
            email:    this.registerForm.get('email')?.value,
            password: this.registerForm.get('password')?.value,
            isAdmin:  this.isAdmin,
            image:    userImage
          },
        }).
        subscribe( ( {data}:any ) => {
          this.newUser = data.addUser;
          
          if (this.newUser== null){
              this.toast.error('User Exist , use another Email to SignUp');
              this.registerForm.reset();
              return;
          }
          
         if (this.newUser!= null){
            
            this.toast.success('User Register Succesfully ....');
            this.router.navigateByUrl('login');
         }
        },
       
      );
} // end of UserSavingMutation()

/***************************************************************** */

get fullName() {
  return this.registerForm.controls['fullName'];}

get email() {
  return this.registerForm.controls['email'];
}

get password() {
  return this.registerForm.controls['password'];
}

get confirmPassword() {
  return this.registerForm.controls['confirmPassword'];
}

get image() { return this.registerForm.controls['image'];}

  changeImg(event:any) {
    
    this.selectedFile = event.target.files[0];

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




