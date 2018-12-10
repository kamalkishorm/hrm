var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'celebal',
    database: 'hrm'
});

exports.con = con;