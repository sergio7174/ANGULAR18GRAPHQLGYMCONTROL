import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackService {

  private readonly myAppUrl: string;
  private readonly myApiUrl: string;

  private readonly baseUrl = environment.endpoint;
  private readonly http = inject(HttpClient);

  constructor(){ this.myAppUrl = environment.endpoint;
                 this.myApiUrl = '/api/pack';}

 //method OR FUNCTION to create a new pack

 createpack(pack:any, selectedFile:any): Observable<any> {

  const uploadData = new FormData();

    //alert("Im at pack service - line 27 - pack.features:"+pack.features);
  
    uploadData.append("nameplan", pack.nameplan);
    uploadData.append("trialdays", pack.trialdays);
    uploadData.append("description", pack.description);
    uploadData.append("features", pack.features);
    uploadData.append("timedays", pack.timedays);
    uploadData.append("cost", pack.cost);
    uploadData.append("code", pack.code);
    uploadData.append("status", pack.status);
    uploadData.append("image", selectedFile);

 
 return this.http.post(`${this.myAppUrl}${this.myApiUrl}/`, uploadData, selectedFile)}

//End of the Block to method Service to create a new pack

//method to edit an furniture
editpack(pack:any, selectedFile:any, id:any): Observable<any> {

  const uploadData = new FormData();

  uploadData.append("nameplan", pack.nameplan);
  uploadData.append("trialdaysplan", pack.trialdaysplan);
  uploadData.append("Featuresplan", pack.Featuresplan);
  uploadData.append("timedaysplan", pack.timedaysplan);
  uploadData.append("costplan", pack.costplan);
  uploadData.append("codeplan", pack.codeplan);
  uploadData.append("status", pack.trialdaysplan);
    
      //alert ('Estoy en pack service -line 45 - this.baseUrlPut+ id'+`${this.myAppUrl}${this.myApiUrl}/update-pack/${id}`)

      return this.http.put(`${this.myAppUrl}${this.myApiUrl}/update-pack/${id}`, uploadData, selectedFile)}

//End of the Block to method OR FUNCTION to Edit a saved pack
//*************************************************************/

//method Service to List all categories

getpackList(){ 

  //alert("Estoy en pack.service.ts - line 56");
  /*alert ('Estoy en pack service -line 57 - ${this.myAppUrl}${this.myApiUrl}/listAll'
    +`${this.myAppUrl}${this.myApiUrl}/listAll`)*/

  return this.http.get(
    `${this.myAppUrl}${this.myApiUrl}/listAll`) }
  
  //End of the Block to method Service to List all packs
//*************************************************************/

// function to upload an image to backend server
   uploadPackImage(postData: any) {
    //alert ("Estoy en uploadPackImage - pack.service - line 79");
    //alert ("Estoy en uploadPackImage - pack.service - line 80 - {this.myAppUrl}${this.myApiUrl}:  "+`${this.myAppUrl}/upload-image`);
    return this.http.post(`${this.myAppUrl}/upload-image`, postData);
 }


//*************************************************************/
//method Service to delete an image

deleteImage(image:any){

  //alert("Estoy en product.service.ts - delete Image line 82, image:"+image);

  const uploadData = {image};

    //alert("Estoy en product.service.ts - delete Image line 88, image:"+ uploadData);  

    // first I will Erase The image in Uploads dir in BackEnd
  return this.http.post(`${this.myAppUrl}${this.myApiUrl}/delete-image`,uploadData);

}
// function to delete a pack

deletepack(id:any){ 

  
  //alert("Estoy en pack.service.ts - deletepack line 80, id:"+id);

  return this.http.delete( `${this.myAppUrl}${this.myApiUrl}/delete-pack/${id}`,)
}
//End of the Block to method Service to delete a pack
//*************************************************************/

//method Service to get a pack By id
getpackById(id:any){ 

  //alert("Estoy en pack.service.ts - getpackById line 90, id:"+id);
  
  return this.http.get(`${this.myAppUrl}${this.myApiUrl}/get-single-pack/${id}`)}

//End of the Block to method Service get a pack By id
//*************************************************************/

}





