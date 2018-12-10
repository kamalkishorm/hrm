/******************************************* Server Lib***********************************************/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var jwt = require('jsonwebtoken');

/******************************************* Blockchain Lib ***********************************************/
var fs = require("fs");
var Web3 = require('web3');
var request = require('request');
var crypto = require('crypto');
const abiDecoder = require('abi-decoder');
const TruffleContract = require('truffle-contract');
var HDWalletProvider = require("truffle-hdwallet-provider");

/******************************************* Configuration ***********************************************/

process.env.SECRET_KEY = "userKey";

var { con } = require('./config/db-config');
var bc_config = require('./config/blockchain-config');
var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add headers
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

// var infura_apikey = "v3/8cf80ccb22dd4231b0b609cad3f58383";
// var mnemonic = "letter casino spread lawn water toward extend public gasp turn wave bone";
// var localRPC = "HTTP://127.0.0.1:8545"
let web3 = new Web3();

// var web3Provider = new HDWalletProvider(bc_config.mnemonic, bc_config.ropsten + bc_config.infura_apikey);
// web3.setProvider(new Web3.providers.HttpProvider(bc_config.ropsten + bc_config.infura_apikey));

var web3Provider = new HDWalletProvider(bc_config.mnemonic, bc_config.localRPC);
web3.setProvider(new Web3.providers.HttpProvider(bc_config.localRPC));


web3.eth.defaultAccount = "0xdd56707585Bd9392500bBb30eEf767fb33299FF8";
var hrmContract, event;
fs.readFile(__dirname + "/" + "build/contracts/hrm.json", 'utf8', function(err, data) {
    hrmContract = TruffleContract(JSON.parse(data));
    hrmContract.setProvider(web3Provider);
    console.log(web3Provider.addresses[0]);
    hrmContract.defaults({ from: web3Provider.addresses[0] });
    abiDecoder.addABI(JSON.parse(data).abi);
    watchEvents();

});


function watchEvents() {
    hrmContract.deployed().then(function(instance) {
        return instance;
    }).then(function(instance) {
        event = instance.allEvents({}, { fromBlock: 0, toBlock: 'latest' });
        // event.get((error, logs) => {
        //     // we have the logs, now print them
        //     logs.forEach(log => console.log(log.args))
        // })
        event.watch(function(error, event) {
            if (!error)
                var x = { "event :": event.event, "args : ": event.args };
            console.log(x);
        });
    });
}

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

/******************************************* API ***********************************************/
app.get('/', function(req, res) {
    console.log('get called');
    res.send({ 'Output': 'Server is UP :-)' });
});

app.post('/adminlogin', function(req, res) {
    var id = req.body.eid;
    var password = req.body.password;

    if (id === "admin" && password === "admin") {
        var result = {
            "username": "admin",
            "password": "admin"
        };
        let token = jwt.sign(result, process.env.SECRET_KEY, {
            expiresIn: 1440
        });
        var data = {
            "id": "admin",
            "token": token
        };
        res.status(200).json(data).end();
    }
});

app.post('/login', function(req, res) {
    console.log(req.body.eid);
    con.query(
        'SELECT * FROM employee where eid= ?', req.body.eid,
        function(err, results, fields) {
            if (err) {
                console.error(err);
                res.status(500).send(JSON.stringify(err.message));
            } else {
                console.log(results[0]);
                if (results.length > 0 && req.body.password == results[0].password) {
                    // res.status(200).json(results).end();
                    var x = JSON.parse(JSON.stringify(results[0]));
                    // res.send(x);

                    let token = jwt.sign(x, process.env.SECRET_KEY, { expiresIn: '1h' });
                    var data = {
                        "id": req.body.eid,
                        "token": token
                    };
                    res.status(200).json(data).end();
                    // res.send(x);
                } else {
                    var data = {
                        'error': 'Invalid Username or password!!!'
                    };
                    res.send(data);
                }
            }
        }
    );
});

app.get('/getEmployeeList', function(req, res) {
    con.query(
        'SELECT eid,name,email FROM employee',
        function(err, results, fields) {
            if (err) {
                console.error(err);
                res.status(500).send({ 'Output': 'Failure', 'error': err.message });
            } else {
                console.log(results);
                res.send({ 'Output': 'Success', 'data': results });
            }
        });
});

app.get('/getleaverequests', function(req, res) {
    con.query(
        'SELECT * FROM leaveRequests',
        function(err, results, fields) {
            if (err) {
                console.error(err);
                res.status(500).send({ 'Output': 'Failure', 'error': err.message });
            } else {
                console.log(results);
                res.send({ 'Output': 'Success', 'data': results });
            }
        });
});
app.post('/requestLeave', function(req, res) {
    var now = (new Date()).toMysqlFormat();
    console.log(now);
    con.query(
        "INSERT INTO leaveRequests(eid,request,day) VALUES ('" + req.body.eid + "','" + now + "','" + req.body.days + "')",
        function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send(JSON.stringify(err.message));
            } else {
                console.log(result);
                con.query(
                    "Select rid from leaveRequests where request='" + now + "'",
                    function(err, result2) {
                        if (err) {
                            console.error(err);
                            res.status(500).send(result).end();
                        } else {
                            console.log(result2);
                            res.send(result2).end();
                        }
                    });
            }
        }
    )
});

app.post('/revokeRequest', function(req, res) {
    var now = (new Date()).toMysqlFormat();
    con.query(
        "UPDATE leaveRequests SET revoket='" + now + "' where rid='" + req.body.rid + "'",
        function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send(JSON.stringify(err.message));
            } else {
                console.log(result);
                res.send(result).end();
            }
        }
    );
});
/******************************************* Blockchain ***********************************************/

app.get('/getAccountBalance', function(req, res) {
    var x = web3.fromWei(web3.eth.getBalance(web3.eth.defaultAccount));
    console.log(web3.eth.getBalance(web3.eth.defaultAccount));
    var data = {
        "balance": JSON.parse(x),
        "address": web3.eth.defaultAccount
    };
    console.log(data)
    res.end(JSON.stringify(data));
});

app.post('/addNewEmployee', function(req, res) {
    console.log(req.body);
    const x = new Date(req.body.dob);
    const dob = x.getUTCFullYear() + "-" + x.getUTCMonth() + "-" + x.getUTCDate();
    con.query(
        "INSERT INTO employee VALUES ('" + req.body.eid + "','" + req.body.name + "','" + dob + "','" + req.body.email + "','" + req.body.eid + "')",
        function(err, result, fields) {
            if (err) {
                console.error(err);
                res.status(500).send(JSON.stringify(err.message));
            } else {
                hrmContract.deployed().then(function(instance) {
                    return instance;
                }).then(function(instance) {
                    instance.addNewEmployee(req.body.eid).then(function(rst) {
                        console.log(rst);
                        res.json(rst).end();
                    }).catch(e => {
                        console.log(e);
                        res.send(e.message).end();
                    });
                });
            }
        }
    );
});

app.post('/getemployeeinfo', function(req, res) {

    con.query(
        'SELECT eid,name,dob,email FROM employee where eid= ?', req.body.eid,
        function(err, results, fields) {
            if (err) {
                console.error(err);
                res.status(500).send(JSON.stringify(err.message));
            } else {
                console.log(results[0]);
                if (results.length > 0) {
                    hrmContract.deployed().then(function(instance) {
                        return instance;
                    }).then(function(instance) {
                        instance.checkLeaveBalance(req.body.eid).then(function(rst) {
                            console.log(rst);
                            results[0].leavebalance = rst / 10;
                            res.json(results[0]).end();
                        }).catch(e => {
                            console.log(e);
                            res.send(e.message).end();
                        });
                    });

                    // res.status(200).json(data).end();
                    // res.send(x);
                } else {
                    var data = {
                        'error': 'Invalid Username or password!!!'
                    };
                    res.send(data);
                }
            }
        }
    );
});

app.post('/checkLeaveBalance', function(req, res) {
    hrmContract.deployed().then(function(instance) {
        return instance;
    }).then(function(instance) {
        instance.checkLeaveBalance(req.body.eid).then(function(rst) {
            console.log(rst);
            res.json(rst).end();
        }).catch(e => {
            console.log(e);
            res.send(e.message).end();
        });
    });
});

app.post('/addLeave', function(req, res) {
    hrmContract.deployed().then(function(instance) {
        return instance;
    }).then(function(instance) {
        instance.addLeave(req.body.eid, req.body.days * 10).then(function(rst) {
            console.log(rst);
            con.query(
                "INSERT INTO transferLeave (eid,transactiontype,day) VALUES ('" + req.body.eid + "','compensation','" + req.body.days + "')",
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        res.status(500).send(JSON.stringify(err.message));
                    } else {
                        res.json(rst).end();
                    }
                });
        }).catch(e => {
            console.log(e);
            res.status(400).json(e).end();
        });
    });
});

app.post('/requestLeave', function(req, res) {
    console.log(req.body);
    const x = new Date(req.body.dob);
    con.query(
        "INSERT INTO employee VALUES ('" + req.body.eid + "','" + req.body.name + "','" + dob + "','" + req.body.email + "','" + req.body.eid + "')",
        function(err, result, fields) {
            if (err) {
                console.error(err);
                res.status(500).send(JSON.stringify(err.message));
            } else {
                hrmContract.deployed().then(function(instance) {
                    return instance;
                }).then(function(instance) {
                    instance.addNewEmployee(req.body.eid).then(function(rst) {
                        console.log(rst);
                        res.json(rst).end();
                    }).catch(e => {
                        console.log(e);
                        res.send(e.message).end();
                    });
                });
            }
        }
    );
});

app.post('/approveLeave', function(req, res) {
    console.log(req);
    var now = (new Date()).toMysqlFormat();
    hrmContract.deployed().then(function(instance) {
        return instance;
    }).then(function(instance) {
        instance.approveLeave(req.body.eid, req.body.days * 10).then(function(rst) {
            console.log(rst);
            con.query(
                "UPDATE leaveRequests SET approve='" + now + "', transactionhash='" + rst.tx + "' where rid='" + req.body.rid + "'",
                function(err, result) {
                    if (err) {
                        console.error(err);
                        res.status(500).send(JSON.stringify(err.message));
                    } else {
                        console.log(result);
                        res.send(rst).end();
                    }
                }
            );
        }).catch(e => {
            console.log(e);
            res.send(e.message).end();
        });
    });
});

app.post('/transferLeave', function(req, res) {
    hrmContract.deployed().then(function(instance) {
        return instance;
    }).then(function(instance) {
        instance.transferLeave(req.body.from, req.body.to, req.body.days * 10).then(function(rst) {
            console.log(rst);
            con.query(
                "INSERT INTO transferLeave VALUES ('" + req.body.from + "','" + rst.tx + "','transfer','" + req.body.days + "','" + req.body.to + "')",
                function(err, result, fields) {
                    if (err) {
                        console.error(err);
                        res.status(500).send(JSON.stringify(err.message));
                    } else {
                        res.json(rst).end();
                    }
                });
        }).catch(e => {
            console.log(e);
            res.send(e.message).end();
        });
    });
});

/******************************************* Server Start ***********************************************/
app.listen(8081, function() {
    console.log('Server is running(8081)..');

});
module.exports = app;