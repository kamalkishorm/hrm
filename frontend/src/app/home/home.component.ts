import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HrmService } from '../hrm.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    eid: any;
    password: any;
    uname: any;
    email: any;
    routerurl: any;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private hrmservice: HrmService,
    ) {
        // router.events.subscribe((val) => {
        //     // see also 
        //     console.log(val)
        // });
    }

    ngOnInit() {
        // localStorage.setItem('address', '0');
        // localStorage.setItem('token', '0');
        // localStorage.setItem('id', '0');
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
        const formdata = {
            'eid': this.eid,
            'password': this.password
        };
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
    // RegisterUser() {
    //     const formdata = {
    //         'uname': this.uname,
    //         'email': this.email,
    //         'password': this.password
    //     };
    //     this.hrmservice.registeruser(formdata).then(
    //         data => {
    //             if (data['error'] === 0) {
    //                 alert('User ID :' + data['id']);
    //                 this.routerurl = '/home';
    //                 this.router.navigate([this.routerurl]);
    //                 window.location.reload();

    //             }
    //         },
    //         error => {
    //             console.log(error);
    //         });
    // }
}
