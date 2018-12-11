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
    leaverequests: any;
    submitted = false;
    public datavalue;

    $scope: any;
    public showemployee: boolean = false;
    public showemployeeForm: boolean = false;
    public showleaverequests: boolean = false;
    public adminshow: boolean = true;
    public transaction_response: boolean = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private hrmservice: HrmService,
        private formBuilder: FormBuilder
    ) {
    }
    employeeDisplayedColumns: string[] = ['eid', 'name', 'email', 'remainingleave', 'getdetails', 'leaveday', 'addleave' ];
    employeeLeaveRequestColumns: string[] = ['rid', 'eid', 'days', 'approve', 'revoke' ];

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
            this.showleaverequests = false;
            this.transaction_response = false;
          } else if (viewData === 'employeelist') {
            this.getEmployeeList();
            this.adminshow = false;
            this.showemployee = true;
            this.showemployeeForm = false;
            this.showleaverequests = false;
            this.transaction_response = false;
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
              this.showleaverequests = false;
              this.transaction_response = false;
          } else if (viewData === 'leaverequests') {
            this.getleaverequests();
            this.adminshow = false;
            this.showemployee = false;
            this.showemployeeForm = false;
            this.showleaverequests = true;
            this.transaction_response = false;
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

    getleaverequests() {
        this.hrmservice.getleaverequests().then(
            data => {
                this.leaverequests = [];
                console.log(data);
                data['data'].forEach(element => {
                    if (element.approve == null && element.revoket == null) {
                        this.leaverequests.push(element);
                    }
                });
                // this.leaverequests = data['data'];
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
        // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
        this.hrmservice.addnewemployee(this.registerForm.value).then(
            data => {
                console.log(data);
                this.transaction_response = true;
                this.datavalue =   this.syntaxHighlight(data);

                // document.body.appendChild(document.createElement('pre')).innerHTML = this.syntaxHighlight(data);
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
                this.transaction_response = true;
                this.datavalue =   this.syntaxHighlight(data);
                // document.body.appendChild(document.createElement('pre')).innerHTML = this.syntaxHighlight(data);
            },
            error => {
                const errorResponse = error;
                console.error(error);
            });
    }
    approverequest(requestdetails) {
        const formdata = {
            'eid': requestdetails.eid,
            'days': requestdetails.day,
            'rid': requestdetails.rid
        };
        console.log(formdata);
        this.hrmservice.approveleave(formdata).then(
            data => {
                console.log(data);
                this.transaction_response = true;
                this.datavalue =   this.syntaxHighlight(data);
                // document.body.appendChild(document.createElement('pre')).innerHTML = this.syntaxHighlight(data);
                this.getleaverequests();
            },
            error => {
                console.log(error);
            }
        );
    }
    revokerequest(requestdetails) {
        const formdata = {
            'rid': requestdetails.rid
        };
        console.log(formdata);
        this.hrmservice.revokeleave(formdata).then(
            data => {
                console.log(data);
                this.getleaverequests();
            },
            error => {
                console.log(error);
            }
        );
    }
    syntaxHighlight(json) {
        if (typeof json !== 'string') {
             json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
}
