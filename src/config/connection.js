const mysql = require("mysql");
const dbConfig = require("./db.config");

// Create a connection to the database
const connection = mysql.createConnection({
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
});

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;
