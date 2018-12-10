#Tables
CREATE TABLE employee (
    eid NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(100),
    dob DATE,
    email NVARCHAR(100),
    password NVARCHAR(21)
);

INSERT INTO employee values ('0x11','Kamal Kishor Mehra','1995-08-23','kkm7668@gmail.com','7668');
INSERT INTO employee values ('0x12','Karan Chaparwal','1995-08-23','kc@gmail.com','7668');

CREATE TABLE employeeLeave (
    eid NVARCHAR(50),
    transactionhash NVARCHAR(100),
    transactiontype ENUM('request', 'approval','transfer','compensation'),
    day INT,
    to_eid NVARCHAR(50)
);
