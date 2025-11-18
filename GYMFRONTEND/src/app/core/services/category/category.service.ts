import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly myAppUrl: string;
  private readonly myApiUrl: string;

  private readonly baseUrl = environment.endpoint;
  private readonly http = inject(HttpClient);

  constructor(){ this.myAppUrl = environment.endpoint;
                 this.myApiUrl = '/api/category';}

// function to upload an image to backend server
   uploadCategoryImage(postData: any) {
    //alert ("Estoy en uploadCategoryImage - category.Service - line 57");
    //alert ("Estoy en uploadCategoryImage - category.Service - line 58 - {this.myAppUrl}${this.myApiUrl}upload-image:  "+`${this.myAppUrl}/upload-image`);
    return this.http.post(`${this.myAppUrl}/upload-image`, postData);
 }

//*************************************************************/
//method Service to delete a product

deleteImage(image:any){

  //alert("Estoy en product.service.ts - delete Image line 82, image:"+image);

  const uploadData = {image};

    //alert("Estoy en product.service.ts - delete Image line 88, image:"+ uploadData);  

    // first I will Erase The image in Uploads dir in BackEnd
  return this.http.post(`${this.myAppUrl}${this.myApiUrl}/delete-image`,uploadData);

}

//method Service to get a category By id
getCategoryById(id:any){ 

  //alert("Estoy en category.service.ts - getCategoryById line 90, id:"+id);
  
  return this.http.get(`${this.myAppUrl}${this.myApiUrl}/get-single-category/${id}`)}

//End of the Block to method Service get a category By id
//*************************************************************/

}


