import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HrmService } from '../hrm.service';



@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    show: boolean = false;
    adminshow: boolean = false;
    employeeshow: boolean = false;
    homeshow: boolean = false;
    balance: any;
    eid: any;
    password: any;
    uname: any;
    email: any;
    routerurl: any;
    employeeinforesult: any;
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private hrmservice: HrmService,
    ) {
        // localStorage.setItem('address', '0');
        // localStorage.setItem('token', '0');
        // localStorage.setItem('id', '0');
    }

    ngOnInit() {
        this.adminshow = false;
        this.employeeshow = false;
        this.homeshow = false;

        if (this.router.url === '/admin') {
            this.adminshow = true;
            this.employeeshow = false;
            this.homeshow = false;
            const formdata = {
            };
            this.hrmservice.getaccountbalance().then(
                data => {
                    console.log(data);
                    this.balance = data;
                },
                error => {
                    const errorResponse = error.json();
                });
        } else if (this.router.url === '/employee') {
            this.adminshow = false;
            this.employeeshow = true;
            this.homeshow = false;
            const formdata = {
                'eid': localStorage.getItem('eid')
            };
            // this.employeeinforesult.score = 'Test not given yet!!!';
            this.hrmservice.getemployeeinfo(formdata).then(
                data => {
                    console.log(data);
                    this.employeeinforesult = data;
                },
                error => {
                    const errorResponse = error.json();
                }
            );
            // this.hrmservice.getemployeeinfo(formdata).then(
            //     data => {
            //         console.log(data[0]);
            //         this.employeeinforesult = data[0][0];
            //     this.hrmservice.getresult(formdata).then(
            //         scoredata => {
            //             console.log(scoredata);
            //         if (scoredata[1]) {
            //             this.employeeinforesult.score = scoredata[0];
            //             console.log(this.employeeinforesult);
            //         } else {
            //             this.employeeinforesult.score = 'Test not given yet!!!';
            //         }
            //         },
            //         error => {
            //             const errorResponse = error.json();
            //         });
            //     },
            //     error => {
            //         const errorResponse = error.json();

            //     }
            // );
        } else {
            this.adminshow = false;
            this.employeeshow = false;
            this.homeshow = true;
        }
    }

    toggleCollapse() {
        this.show = !this.show;
        // this.collapse = this.collapse == "open" ? 'closed' : 'open';
    }
    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }
    employeeLogin() {
        localStorage.setItem('eid', this.eid);
        const formdata = {
            'eid': this.eid,
            'password': this.password
        };
        this.hrmservice.employeelogin(formdata).then(
            data => {
                console.log(data);
                if (data['token']) {
                    window.location.reload();
                    localStorage.setItem('token', data['token']);
                    localStorage.setItem('id', formdata.eid);
                    this.routerurl = '/employee';
                    this.router.navigate([this.routerurl]);
                }
            },
            error => {
                console.log(error);
            });
    }
    AdminLogin() {
        localStorage.setItem('eid', this.eid);
        const formdata = {
            'eid': this.eid,
            'password': this.password
        };
        this.routerurl = '/admin';
        this.hrmservice.adminlogin(formdata).then(
            data => {
                console.log(data);
                if (data['token']) {
                    localStorage.setItem('admin', data['token']);
                    this.routerurl = '/admin';
                    this.router.navigate([this.routerurl]);
                }
            },
            error => {
                console.log(error);
            });
    }
    // RegisterEmployee() {
    //     const formdata = {
    //         'eid': this.uname
    //     };
    //     this.hrmservice.addnewemployee(formdata).then(
    //         data => {
    //             // if (data['error'] === 0) {
    //                 alert(data);
    //                 // this.routerurl = '/';
    //                 // this.router.navigate([this.routerurl]);
    //                 window.location.reload();
    //             // }
    //         },
    //         error => {
    //             console.log(error);
    //         });
    // }
}
