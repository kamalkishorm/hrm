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
    id: any;
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
    UserLogin() {
        localStorage.setItem('eid', this.id);
        const formdata = {
            'eid': this.id,
            'password': this.password
        };
        this.hrmservice.employeelogin(formdata).then(
            data => {
                console.log(data);
                if (data['token']) {
                    localStorage.setItem('token', data['token']);
                    this.routerurl = '/employee';
                    this.router.navigate([this.routerurl]);
                }
            },
            error => {
                console.log(error);
            });
    }

    AdminLogin() {
        localStorage.setItem('id', this.id);
        const formdata = {
            'eid': this.id,
            'password': this.password
        };
        this.hrmservice.adminlogin(formdata).then(
            data => {
                console.log(data);
                if (data['token']) {
                    localStorage.setItem('token', data['token']);
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
