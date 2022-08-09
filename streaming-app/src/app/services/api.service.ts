import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { timeout } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { ParameterService } from './parameter.service'
import { environment } from 'src/environments/environment';



class ServiceOptions {
  action?: string;
  postData?: any;
  method?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private _http: HttpClient,
    private parameter: ParameterService
  ) {}

  api_url: string = 'http://localhost:3000/v1.0'

  public async service( options: ServiceOptions ): Promise <any> {
    let endpoint = environment.apiUrl;
    try{
      const timeOut = 60000;
      const token = this.parameter.getParam('token')
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        responseType: JSON.parse('"test"')
      }
      let postData = options.postData
      if(!postData){ postData = {}}
      let response: any;
      if(options.method === 'get'){
        response = this._http.get(endpoint + options.action, requestOptions).pipe(timeout(timeOut));
      } else if (options.method === 'post') {
        response = this._http.post(endpoint + options.action, postData, requestOptions).pipe(timeout(timeOut));
      } else if (options.method == 'patch'){
        response = this._http.patch(endpoint + options.action, postData, requestOptions).pipe(timeout(timeOut));
      } else if (options.method == 'delete'){
        response = this._http.delete(endpoint + options.action, requestOptions).pipe(timeout(timeOut));
      }
      const data = JSON.parse(await response.toPromise());
      console.log(`data ${JSON.stringify(data)}`);
      
      if (data?.token) {
        this.parameter.setParam('token', data.token)
      }
      const errorMessage = data?.error || data?.details?.errors?.message
      
      if (errorMessage) {
        window.alert(`error: ${errorMessage}`)
        throw new Error(errorMessage);
      }
      return data;
    } catch (error: any){
      if(error.status === 400){
        const errorMesage = 'No se logró la conexion con el servidor. Reintenta luego por favor'
        window.alert(`error: ${errorMesage}`)
      } else {
        throw new Error(error.status)
      }
    } 
    
  }
}
