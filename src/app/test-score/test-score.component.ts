import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id?: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  params: string;
  nameFixed: string;
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.tests = await this.loadTests();
    
    
  }

  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  async loadTests() {
    let tests = JSON.parse(localStorage.getItem('tests'));
    if(tests && tests.length > 0) {
      // tests = tests;
    } else {
      tests = await this.loadTestsFromJson();
    }
    console.log('this.tests from ngOninit...', this.tests);
    this.tests = tests;
    return tests;
  }

  addTest() {
    const test: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null

    };
    this.tests.unshift(test);
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }


  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }
  
  // name(params: string) {
  //   const commaIndex = params.indexOf(', ');
  //   const firstName = params.slice(commaIndex + 2, this.params.length);
  //   const lastName = params.slice(0, commaIndex);
  //   return firstName + ' ' + lastName;
  // }

  calculate() {
    let pointsPossible = 0;
    let pointsReceived = 0;
    
    for(let i = 0; i < this.tests.length; i++) {
      // console.log('i--->', i, "this.tests[i]", this.tests[i]);
      pointsPossible += this.tests[i].pointsPossible;
      pointsReceived += this.tests[i].pointsReceived;
      // console.log('points possible---->', pointsPossible);
      // console.log('points received---->', pointsReceived);
    }

    if(this.params === null) {
      this.toastService.showToast('warning', 5000, 'Name must not be null');
    } else {
      // const commaIndex = this.params.indexOf(', ');
      // const firstName = this.params.slice(commaIndex + 2, this.params.length);
      // const lastName = this.params.slice(0, commaIndex);
      // nameFixed = firstName + ' ' + lastName;
    }
    
    return {
      name: this.nameFixed,
      pointsPossible: pointsPossible,
      pointsReceived: pointsReceived,
      totalPercentage: pointsReceived / pointsPossible
    };
  }

  compute(params: string) {
    if(params == null) {
      this.toastService.showToast('warning', 5000, 'Name must not be null');
      console.log('name is null');
      console.log(params);
    } else {
      const commaIndex = this.params.indexOf(', ');
      const firstName = this.params.slice(commaIndex + 2, this.params.length);
      const lastName = this.params.slice(0, commaIndex);
      this.nameFixed = firstName + ' ' + lastName;
      const data = this.calculate();
      this.router.navigate(['home', data]);
    
  };
}
  
  
}
