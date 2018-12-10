import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Configration } from './web-config';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
})
export class HrmService {

    private web3Provider: null;
    private contracts: {};
    constructor(
        private http: Http,
        private spinner: NgxSpinnerService,
    ) { }

    showLoader() {
        this.spinner.show();
    }
    hideLoader() {
        this.spinner.hide();
    }
/******************************************* Admin***********************************************/
    adminlogin(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.post(Configration.adminurl + 'adminlogin', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    console.log(error);
                    this.hideLoader();
                });
        });
    }

    getaccountbalance() {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.get(Configration.adminurl + 'getAccountBalance')
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    console.log(error);
                    this.hideLoader();
                });
        });
    }

    addnewemployee(payload) {
      this.showLoader();
      return new Promise((resolve, reject) => {
          return this.http.post(Configration.adminurl + 'addNewEmployee',payload)
              .subscribe((success: any) => {
                  this.hideLoader();
                  return resolve(success.json());
              }, (error) => {
                  console.log(error);
                  this.hideLoader();
              });
      });
    }

    addleave(payload) {
      this.showLoader();
      return new Promise((resolve, reject) => {
          return this.http.post(Configration.adminurl + 'addLeave', payload)
              .subscribe((success: any) => {
                  this.hideLoader();
                  return resolve(success.json());
              }, (error) => {
                  console.log(error);
                  this.hideLoader();
                  return reject(error);
              });
      });
    }

    approveleave(payload) {
      this.showLoader();
      return new Promise((resolve, reject) => {
          return this.http.get(Configration.adminurl + 'approveLeave')
              .subscribe((success: any) => {
                  this.hideLoader();
                  return resolve(success.json());
              }, (error) => {
                  console.log(error);
                  this.hideLoader();
              });
      });
    }
/******************************************* Employee ***********************************************/
    employeelogin(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            console.log(payload);
            return this.http.post(Configration.adminurl + 'login', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
    }
    checkLeaveBalance(payload) {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.post(Configration.adminurl + 'checkLeaveBalance', payload)
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    console.log(error);
                });
        });
      }

    getemployeelist() {
        this.showLoader();
        return new Promise((resolve, reject) => {
            return this.http.get(Configration.adminurl + 'getEmployeeList')
                .subscribe((success: any) => {
                    this.hideLoader();
                    return resolve(success.json());
                }, (error) => {
                    this.hideLoader();
                    return reject(error.json());
                });
        });
    }

    getemployeeinfo(payload) {
      this.showLoader();
      return new Promise((resolve, reject) => {
          return this.http.post(Configration.adminurl + 'getemployeeinfo', payload)
              .subscribe((success: any) => {
                  this.hideLoader();
                  return resolve(success.json());
              }, (error) => {
                  this.hideLoader();
                  console.log(error);
              });
      });
    }

    transferleave(payload) {
      this.showLoader();
      return new Promise((resolve, reject) => {
          return this.http.post(Configration.adminurl + 'transferLeave', payload)
              .subscribe((success: any) => {
                  this.hideLoader();
                  return resolve(success.json());
              }, (error) => {
                  this.hideLoader();
                  console.log(error);
              });
      });
    }

}
