import { JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  constructor() { }

  public getParam( name: string ) {
    const val = localStorage.getItem('PARAM_'+ name) || ''
    return val ? JSON.parse(val): null;
  }

  public  setParam( name: any, value: any){
    value = value ?? '';
    localStorage.setItem('PARAM_' + name, JSON.stringify(value))
  }

  public removeParam(name:any) {
    localStorage.removeItem('PARAM_' + name)
  }

  public removeParams(){
    localStorage.clear()
  }

}


