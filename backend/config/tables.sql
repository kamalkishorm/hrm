#Tables
DROP TABLE employee;
CREATE TABLE employee (
    eid NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(100),
    dob DATE,
    email NVARCHAR(100),
    password NVARCHAR(21)
);

INSERT INTO employee values ('0x11','Kamal Kishor Mehra','1995-08-23','kkm7668@gmail.com','7668');
INSERT INTO employee values ('0x12','Karan Chaparwal','1995-08-23','kc@gmail.com','7668');

DROP TABLE transferLeave;

CREATE TABLE transferLeave (
    eid NVARCHAR(50),
    transactionhash NVARCHAR(100),
    transactiontype ENUM('transfer','compensation'),
    day INT,
    to_eid NVARCHAR(50)
);

DROP TABLE leaveRequests;
CREATE TABLE leaveRequests (
    rid INT AUTO_INCREMENT,
    eid NVARCHAR(50),
    request DATETIME,
    approve DATETIME,
    revoket DATETIME,
    transactionhash NVARCHAR(100),
    day INT,
    PRIMARY KEY (rid)
);
