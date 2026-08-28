import mysql from "mysql2/promise";
const db=await mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"system",
    database:"expensetracker",
});
console.log("Mysql connected successfully");

export default db;
