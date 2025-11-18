import { Component, inject , DestroyRef, PLATFORM_ID, Inject, OnInit } from '@angular/core';
// to handle the subscribe method to the service, I have to use it to unsubscribe to the subscribe service call
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgIcon, provideIcons} from '@ng-icons/core';
import { LoginPostData } from '../../../core/interfaces/auth/auth';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { bootstrapMailbox2Flag,
         bootstrapKeyFill,
 } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule,
             ReactiveFormsModule,
             NgIcon,
             RouterLink,
             PasswordModule,
],
providers: [provideIcons({ bootstrapMailbox2Flag, bootstrapKeyFill })],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

// var to handle subscription and unsubscription to service  
private readonly destroyRef = inject(DestroyRef);
private readonly authTokenKey = 'token'; // Usar el mismo nombre de clave en localStorage
private readonly loggedInUserKey = 'loggedInUser';

haveAdmin: any = '';

form: FormGroup;
hidePassword: boolean = true;

/*** vars to handle login req user data */

mensajeBackend:any='';
dataUser:any=[];
token: any = '';
userisAdmin:string | null ='';
userNameLogin:string='';
user:string | undefined ='';
image:string  ='';

private readonly authService= inject(AuthService);
private readonly router = inject(Router);
private readonly fb =  inject (FormBuilder);
private readonly toast = inject (ToastrService);

constructor( @Inject (PLATFORM_ID) private readonly platformId: Object,
   ) {

  this.form = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.pattern(/[a-z0-9\._%\+\-]+@[a-z0-9\.\-]+\.[a-z]{2,}$/),
    ]],
    password: ['', [Validators.required]],
  });
}

ngOnInit(): void { 
  
  // To call this function is for allowing the register option the first time
  // that the system runs to create the admin user, who will handle the admin section
  
  this.getThereIsAdmin();}

/*** Function to check if there is an Admin in database */
getThereIsAdmin() {

  this.authService.getAllAdmin().pipe(
    takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ( response:any ) => {

        const haveData = response;
        const HaveAdmin = haveData.haveAdmin;

        //alert("Estoy en login.component - line 86 - HaveAdmin:  "+HaveAdmin);

        if (HaveAdmin!='false') {
          this.haveAdmin = 'true';
        } else {
          this.haveAdmin = 'false';
          console.error('Error to get Admin Data.');
          this.toast.error('Error to get Admin Data.');
        }
      }}
  );
}

login() {
if (this.form.invalid) {
  this.toast.error('Error','Por favor, completa todos los campos requeridos.');
  return;
}

alert ("EStoy en login() - login component - line 110");
this.authService.login(this.form.value).pipe(
  takeUntilDestroyed(this.destroyRef)).subscribe({
    next: ( response:any ) => {
    // Manejo de respuesta exitosa
      this.dataUser = response;
      this.mensajeBackend = this.dataUser.message;
      this.image = this.dataUser.user.imageFBE;
      
      //alert ("EStoy en login() - login component - line 113: - this.dataUser.user.imageFBE :" + this.dataUser.user.imageFBE);
      /*alert ("EStoy en login() - login component - line 119: - this.dataUser.data.token :" + this.dataUser.token);*/

      if (this.dataUser.token){
      this.token = this.dataUser.token;
      //alert("Estoy en login.component login() - line 84: this.token: "+this.token);
      }
      
      if (this.dataUser.user){
      this.user = this.dataUser.user;
      //alert("Estoy en login.component login() - line 88: this.user: "+this.user);
      } else {

        //alert("Estoy en login.component login() - line 93: this.user: No user")
        this.toast.error(this.mensajeBackend);
        
      }

      if (this.dataUser.user.isAdmin){
      this.userisAdmin = this.dataUser.user.isAdmin;
      //alert("Estoy en login.component login() - line 93: this.useruserisAdmin: "+this.userisAdmin);
      }
     
      if(this.dataUser.user.fullName){ 
      this.userNameLogin = this.dataUser.user.fullName;
      //alert("Estoy en login.component login() - line 98: this.userNameLogin: "+this.userNameLogin);
      }



      if (this.user && this.token) {
        //alert('Login successful. Token received - line 150: ' + this.token);
        this.setToken(this.token);
        this.setLoggedInUser(this.dataUser.user);
        //return response; // Puedes devolver cualquier otra cosa que necesites
      }

    
    // Obtener los datos del usuario autenticado y redirigir
    this.authService.getLoggedInUserData().pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ( user:any ) => {
      
        if (user) {
        
          //alert('Datos del usuario autenticado:', user);
  
          //alert ("Estoy en login() - line 111 - user - email - getLoggedInUserData().subscribe: "+ this.dataUser.user.email);
      
          /*** if user its an admin block  ************/

          if (this.userisAdmin=='true') {

            //alert("Estoy en login-component - line 89 - this.userisAdmin='true ..: "+ this.userisAdmin);
        
              // save the information that you need to get it in mean menu component
              sessionStorage.setItem('name', this.userNameLogin);
              sessionStorage.setItem('isAdmin', this.userisAdmin);
              sessionStorage.setItem('image', this.image);
        
              //alert("EStoy en login.component - line 89 - antes de router.navigate to homeAdmin: ");
              
            
              this.toast.success(this.mensajeBackend);
              //window.location.replace('/homeAdmin');
              this.router.navigateByUrl('homeAdmin');
              
              
              return;
        
            } 
            
          /*** if user its an admin End of block  *****/

          /*** if user its not an admin block  ***********************/
          if (this.userisAdmin=='false') {
            
            //alert("EStoy en login.component - line 144 - this.userisAdmin - false: "+this.userisAdmin);
          
            sessionStorage.setItem('name', this.userNameLogin);
            sessionStorage.setItem('email',  this.dataUser.user.email);
            sessionStorage.setItem('isAdmin', this.userisAdmin);
            sessionStorage.setItem('image', this.image);
        
            this.toast.success(this.mensajeBackend);
            this.router.navigateByUrl('/home');    
          }

      } else {
      
        //alert ("Estoy en login() - line 200 - Error al obtener datos del usuario autenticado ");
        console.error('Error al obtener datos del usuario autenticado:');

        // Redirigir a la página de inicio si no se pueden obtener los datos del usuario
        this.router.navigate(['']); 

      }
    }});
  
  }},
  
);

}

setToken(token: string): void {
console.log('Guardando token en el almacenamiento local:', token);
localStorage.setItem(this.authTokenKey, token);
}

setLoggedInUser(user: LoginPostData): void {
console.log('Guardando usuario autenticado en el almacenamiento local:', user);
localStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
}
}


