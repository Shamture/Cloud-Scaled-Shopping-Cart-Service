var express = require('express'),
    app     = express(),
    mysql   = require('mysql'),
    connectionpool = mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'test'
    });

// get all users
app.get('/listusers', function(req,res){
    connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('SELECT * from login', function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                res.send({
                    result: 'success',
                    err:    '',
                    //fields: fields,
                    json:   rows,
                    length: rows.length
                });
                connection.release();
            });
        }
    });
});

// get by id
app.get('/listusers/:id', function(req,res){
	connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('SELECT * from login WHERE id = '+connection.escape(req.params.id), function(err, rows) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }else {
                    if (rows.length === 0){
                        res.statusCode = 204;
                    } else {
                        res.send({
                            result: 'success',
                            err:    '',
                            id:     req.params.id,
                            json:   rows[0],
                            length: 1
                        });
                    }
                    connection.release();
                }
            });
        }
    });
});

// get password
app.get('/getpassword/:uname', function(req,res){
	connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            connection.query('SELECT password from login WHERE username = '+connection.escape(req.params.uname), function(err, rows) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }else {
                    if (rows.length === 0){
                        res.statusCode = 204;
                    } else {
                        res.send({
                            result: 'success',
                            err:    '',
                            id:     req.params.id,
                            json:   rows[0],
                            length: 1
                        });
                    }
                    connection.release();
                }
            });
        }
    });
});




app.post('/newuser', function(req,res){
	connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            var data = JSON.parse(req.body);
            console.log(data);
                connection.query('INSERT INTO login (id, fname, lname, username, password, mobilno) VALUES (' + connection.escape(data.id) + ',' + connection.escape(data.fname) + ', ' + connection.escape(data.lname) + ',' + connection.escape(data.uname) + ',' + connection.escape(data.password) + ',' + connection.escape(data.mobileno) + ')', function(err, result) {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.send({
                            result: 'error',
                            err:    err.code
                        });
                    } else {
                        res.send({
                            result: 'success',
                            err:    '',
                            id:     result.insertId
                        });
                    }
                    connection.release();
                });
            }
	});
                
});
app.put('/:table/:id', function(req,res){});
app.delete('/:table/:id', function(req,res){});
app.listen(8888);
console.log('Rest Demo Listening on port 8888');