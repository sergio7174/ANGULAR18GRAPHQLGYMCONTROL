import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

private readonly myAppUrl: string;
  private readonly myApiUrl: string;

  private readonly baseUrl = environment.endpoint;
  private readonly http = inject(HttpClient);

  constructor(){ this.myAppUrl = environment.endpoint;
                 this.myApiUrl = '/api/member';}

//method OR FUNCTION to create a new member

createmember( member:any , selectedFile:any): Observable<any> {

//createmember( member:any): Observable<any> {
  const uploadData = new FormData();

    //alert("Im at member service - line 26 - selectedFile: "+ selectedFile);
  
    uploadData.append("namemember", member.namemember);
    uploadData.append("email", member.email);
    uploadData.append("phone", member.phone);
    uploadData.append("client_CI", member.client_CI);
    uploadData.append("nameplan", member.nameplan);
    uploadData.append("timedays", member.timedays);
    uploadData.append("cost", member.cost);
    uploadData.append("code", member.code);
    uploadData.append("image", selectedFile);
    



    /*const uploadData = { namemember, email, phone , client_CI, nameplan,
                       timedays, cost, code, selectedFile }*/
    
 return this.http.post(`${this.myAppUrl}${this.myApiUrl}/`, uploadData )}

//End of the Block to method Service to create a new member

//method Service to List all categories

getmemberList(){ 

  //alert("Estoy en member.service.ts - line 53");
  /*alert ('Estoy en member service -line 44 - ${this.myAppUrl}${this.myApiUrl}/listAll'
    +`${this.myAppUrl}${this.myApiUrl}/listAll`)*/

  return this.http.get(
    `${this.myAppUrl}${this.myApiUrl}/listAll`) }
  
  //End of the Block to method Service to List all members
//*************************************************************/

// function to delete a member

deletemember(id:any){ 

  
  //alert("Estoy en member.service.ts - deletemember line 58, id:"+id);

  return this.http.delete( `${this.myAppUrl}${this.myApiUrl}/delete-member/${id}`,)
}
//End of the Block to method Service to delete a member
//*************************************************************/

//method Service to get a member By id
getmemberById(id:any){ 

  //alert("Estoy en member.service.ts - getmemberById line 90, id:"+id);
  
  return this.http.get(`${this.myAppUrl}${this.myApiUrl}/get-single-member/${id}`)}

//End of the Block to method Service get a member By id
//*************************************************************/

//method Service to get a member By id
getmemberByEmail(email:any){ 

  //alert("Estoy en member.service.ts - getmemberById line 90, id:"+id);
  
  return this.http.get(`${this.myAppUrl}${this.myApiUrl}/get-single-memberbyemail/${email}`)}

//End of the Block to method Service get a member By id
//*************************************************************/

//*************************************************************/
//method Service to delete an image

deleteImage(image:any){

  //alert("Estoy en product.service.ts - delete Image line 82, image:"+image);

  const uploadData = {image};

    //alert("Estoy en product.service.ts - delete Image line 88, image:"+ uploadData);  

    // first I will Erase The image in Uploads dir in BackEnd
  return this.http.post(`${this.myAppUrl}${this.myApiUrl}/delete-image`,uploadData);

}

//method to change member status on database
 
editmemberStatus(id:any): Observable<any> {

  //const uploadData = new FormData();
  const status:any = 'false';

  const uploadData = new FormData();
    uploadData.append("status", status);

      //alert ('Estoy en pack service -line 45 - this.baseUrlPut+ id'+`${this.myAppUrl}${this.myApiUrl}/update-pack/${id}`)

      return this.http.put(`${this.myAppUrl}${this.myApiUrl}/update-member/${id}`, uploadData )}

//End of the Block to method OR FUNCTION to Edit a saved pack
//*************************************************************/





}
