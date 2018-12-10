import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { HrmService } from '../hrm.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule, MatTableModule} from '@angular/material';

// import { QA } from './qalist';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
    id: any;
    // score: any;
    // qandalist: any;
    // answer: QA[];
    transaction: any;
    employeeinforesult: any;
    employeelist: any; // [{'eid': '0x11', 'name': 'kamal'}];
    public showInfo: boolean = false;
    public showTest: boolean = false;
    // displayedColumns: string[] = ['question', 'choice1', 'choice2', 'choice3', 'choice4'];

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private hrmservice: HrmService,
    ) {
    }
    ngOnInit() {
        console.log(localStorage.getItem('eid'));
        const formdata = {
            'eid': localStorage.getItem('eid')
        };
        this.hrmservice.getemployeeinfo(formdata).then(
            data => {
                console.log(data);
                this.employeeinforesult = data;
            },
            error => {
                const errorResponse = error.json();

            }
        );
    }
    jsonstringify(data) {
        // console.log(data)
        return JSON.stringify(data);
    }
    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }
    getEmployeeID() {
        this.hrmservice.getemployeelist().then(
            data => {
                console.log(data);
                if (data['Output'] === 'Success') {
                this.employeelist = [];

                    data['data'].forEach(element => {
                        this.employeelist.push({'eid': element.eid, 'name': element.name});
                    });
                console.log(this.employeelist);
                }
            },
            error => {
                alert(error['error']);
                const errorResponse = error.json();
                window.location.reload();

            }
        );
    }
    TransferLeave(selectedItem) {
        console.log(selectedItem);
        if (selectedItem[1] > 0) {
            const formdata = {
                            'from': localStorage.getItem('eid'),
                            'to' : selectedItem[0],
                            'days': selectedItem[1] + ''
                        };
            this.hrmservice.transferleave(formdata).then(
                data => {
                                    console.log(data);
                                    // this.employeeinforesult = data[0][0];
                                    window.location.reload();
                                },
                                error => {
                                    const errorResponse = error.json();
                                    window.location.reload();
                                }
            );
        }
        alert(JSON.stringify(selectedItem));
    }
    // changeView(viewData) {
    //     if (viewData === 'result') {
    //         // this.getemployeeResult(localStorage.getItem('id'));
    //         this.showInfo = true;
    //         this.showTest = false;
    //         // console.log(localStorage.getItem('eid'));
    //         // const formdata = {
    //         //     'eid': localStorage.getItem('eid')
    //         // };
    //         // // this.employeeinforesult = {'eid': '100'};
    //         // this.hrmservice.getemployeeinfo(formdata).then(
    //         //     data => {
    //         //         console.log(data[0]);
    //         //         this.employeeinforesult = data[0][0];
    //         //     },
    //         //     error => {
    //         //         const errorResponse = error.json();

    //         //     }
    //         // );
    //       } else if (viewData === 'taketest') {
    //           this.takeTest();
    //           this.showInfo = false;
    //           this.showTest = true;
    //     }
    // }
    // getemployeeResult(id) {
    //     console.log(id);
    //     const formdata = {
    //         'id': id
    //     };
    //     document.getElementById('employeeresult').innerHTML = 'verified';
    //     // this.hrmservice.getresult(formdata).then(
    //     //     data => {
    //     //         console.log(data);
    //     //         if (data[1]) {
    //     //             document.getElementById('employeeresult').innerHTML = data[0];
    //     //         } else {
    //     //             document.getElementById('employeeresult').innerHTML = 'Test not given yet!!!';
    //     //         }
    //     //     },
    //     //     error => {
    //     //         const errorResponse = error.json();
    //     //     });
    // }
    // takeTest() {
    //     alert('take test');
    //     // this.hrmservice.taketest().then(
    //     //     data => {
    //     //         this.qandalist = data;
    //     //         console.log(data);
    //     //         const arrayData = [];
    //     //         for (const k of Object.keys( data)) {
    //     //             arrayData.push({
    //     //                 'id': Number(data[k].id),
    //     //                 'answer': data[k].answer
    //     //                 });
    //     //          }
    //     //         this.answer = arrayData;
    //     //         console.log(this.answer);
    //     //     },
    //     //     error => {
    //     //         console.log(error);
    //     //         const errorResponse = error.json();
    //     //     });
    // }
    // checkAnswer() {
    //     let score = 0;
    //     for (const k of Object.keys(this.answer)) {
    //         const name = 'answer' + this.answer[k].id ;
    //         const data = document.getElementsByName(name);
    //         for (let i = 0 ; i < 4; i++) {
    //             if ((<HTMLInputElement>data[i]).checked && this.answer[k].answer === (i + 1)) {
    //                 score += 1;
    //             }
    //         }
    //     }
    //     const formdata = {
    //         'id': localStorage.getItem('id'),
    //         'score': score
    //     };
    //     alert('test submitted');
    //     // this.hrmservice.submittest(formdata).then(
    //     //     data => {
    //     //         this.transaction = data;
    //     //         console.log(data);
    //     //         if (data['tx']) {
    //     //             window.location.reload();
    //     // alert(score);

    //     //         } else {
    //     //             console.error(data);
    //     //         }
    //     //     },
    //     //     error => {
    //     //         console.log(error);
    //     //         const errorResponse = error.json();
    //     //     });
    // }
}
