import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { Router, ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: any;
  password: any;

  constructor(
    private api: ApiService,
    private parameters: ParameterService,
    private router: Router,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    if(this.parameters.getParam('token')){
      this.api.service({
        action: '/logout',
        method: 'post'
      }).then(() => {
        this.parameters.removeParams()
        window.alert('usted ha salido de la aplicación')
      }).catch((error) => {
        console.error(error);
      })
    }
    this.router.initialNavigation
  }

  async doLogin() {
    if(this.email && this.password){
      this.api.service({
        action: '/login',
        method: 'post',
        postData: {
          email: this.email,
          password: this.password
        }
      }).then(data => {
        this.parameters.setParam('user', data.user)
        this.parameters.setParam('login', true)
        this.router.navigate(['/home'])
      }).catch(error => {
        if(error.message === '404') {
          window.alert('Usuario o Contraseña errados')
        }
      });
    } else {
      window.alert('Para Entrar al sitio por favor ingrese sus datos')
    }
  }
}
