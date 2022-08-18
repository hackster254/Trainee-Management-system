const mysql = require('mysql')

var db;

function connectDatabase(){
    if(!db){
        db = mysql.createConnection({
            host: process.env.DBHOST,
            database: process.env.DBNAME,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD
        })
        db.connect(function (err){
            if(!err){
                console.log('mysql db connected')
            }else {
                console.log('Error connectiong to db'+err)
            }
        })
    }
    return db;
}

module.exports = {connectDatabase}