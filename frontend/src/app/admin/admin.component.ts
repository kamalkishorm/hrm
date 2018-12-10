import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { HrmService } from '../hrm.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { User } from './userlist';
// import { MatRippleModule, MatDatepickerModule, NativeDateModule } from '@angular/material';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
    employeeinfo: any;
    registerForm: any;
    submitted = false;
    $scope: any;
    public showemployee: boolean = false;
    public showemployeeForm: boolean = false;
    public adminshow: boolean = true;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private hrmservice: HrmService,
        private formBuilder: FormBuilder
    ) {
    }
    employeeDisplayedColumns: string[] = ['eid', 'name', 'email', 'remainingleave', 'getdetails', 'leaveday', 'addleave' ];

    ngOnInit() {
    }

    get f() { return this.registerForm.controls; }

    jsonstringify(data) {
        // console.log(data)
        return JSON.stringify(data);
    }
    changeView(viewData) {
        if (viewData === 'adminshow') {
            this.getEmployeeList();
            this.adminshow = true ;
            this.showemployee = false;
            this.showemployeeForm = false;
          } else if (viewData === 'employeelist') {
            this.getEmployeeList();
            this.adminshow = false;
            this.showemployee = true;
            this.showemployeeForm = false;
          } else if (viewData === 'newemployee') {
            this.registerForm = this.formBuilder.group({
                eid: ['', Validators.required],
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                dob: ['', [Validators.required]]
            });
              this.adminshow = false;
              this.showemployee = false;
              this.showemployeeForm = true;
        }
    }
    getEmployeeList() {
        this.hrmservice.getemployeelist().then(
            data => {
                console.log(data);
                this.employeeinfo = data['data'];
            },
            error => {
                console.log(error);
                const errorResponse = error.json();
            });
    }
    checkLeaveBalance(userIns) {
        const formdata = {
            'eid': userIns.eid
        };
        // document.getElementById(userIns.id).innerHTML = 'verified';
        console.log(formdata);
        this.hrmservice.checkLeaveBalance(formdata).then(
            data => {
                console.log(data);
                    document.getElementById(userIns.eid).innerHTML = Number(data) / 10 + '';
            },
            error => {
                const errorResponse = error.json();
            });
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
console.log(this.registerForm.value);
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
        this.hrmservice.addnewemployee(this.registerForm.value).then(
            data => {
                console.log(data);
            },
            error => {
                console.error(error);
            }
        );
    }

    // addNewEmployee() {
    //     const formdata = {
    //         'qandapointer': Number(localStorage.getItem('qandapointer'))
    //     };
    //     alert(formdata.qandapointer);
    //     // this.hrmservice.getqanda(formdata).then(
    //     //     data => {
    //     //         console.log(data);
    //     //         this.qandalist = data;
    //     //     },
    //     //     error => {
    //     //         console.log(error);
    //     //         const errorResponse = error.json();
    //     //     });
    // }

    addExtraLeave(employee, day) {
        const formdata = {
            'eid': employee,
            'days': Number((<HTMLInputElement>document.getElementById('l' + employee)).value),
        };
        console.log(formdata);
        document.getElementById('l' + employee).innerHTML = '';
        this.hrmservice.addleave(formdata).then(
            data => {
                console.log(data);
            },
            error => {
                const errorResponse = error;
                console.error(error);
            });

    }
}
