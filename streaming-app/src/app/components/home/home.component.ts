import { Component, OnInit } from '@angular/core';
import { ParameterService } from 'src/app/services/parameter.service';
import { Router, ParamMap, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: any;
  name: string | undefined;

  constructor(
    private parameters: ParameterService,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.user = this.parameters.getParam('user')
  }

  ngOnInit(): void {
    this.isLogin()
    this.name = this.user?.name
  }

  isLogin() {
    if(!this.parameters.getParam('isLogin')){
      this.router.navigate(['/'])
    }
  }

}
