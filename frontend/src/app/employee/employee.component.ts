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
                                    // this.employeeinforesult = data[0][0];
                                    // window.location.reload();
                                    console.log(data);
                                    document.getElementById('tx_response').innerHTML = JSON.stringify(data);

                                },
                                error => {
                                    const errorResponse = error.json();
                                    // window.location.reload();
                                }
            );
        }
    }
    RequestLeave(days) {
        const formdata = {
            'eid': localStorage.getItem('eid'),
            'days': days + ''
        };
        this.hrmservice.requesteleave(formdata).then(
            data => {
                console.log(data);

            },
            error => {
                const errorResponse = error.json();
                // window.location.reload();
            }
        );
    }
}
