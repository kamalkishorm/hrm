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
    transaction: any;
    employeeinforesult: any;
    employeelist: any; // [{'eid': '0x11', 'name': 'kamal'}];
    public showInfo: boolean = false;
    public datavalue;
    public showTest: boolean = false;
    public transaction_response: boolean = false;
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
                                    this.transaction_response = true;
                                    this.datavalue =   this.syntaxHighlight(data);
                                    console.log(this.datavalue);
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
        this.transaction_response = false;
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
