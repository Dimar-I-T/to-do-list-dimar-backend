const pg = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require('../config/database');
const { updateTaskSudah } = require("./task.service");

async function signUp(email, password) {
    const hashed = await bcrypt.hash(password, 10);
    const username = email.split('@')[0];
    const text = 'insert into users(username, email, password) values ($1, $2, $3) returning *'
    const resp = await pool.query(text, [username, email, hashed]);
    const user = resp.rows[0];
    return { data: user };
}

async function login(email, password) {
    const text = "select * from users where email = $1";
    const response = await pool.query(text, [email]);
    const user = response.rows[0];

    if (!user) {
        throw new Error('Email doesn\'t exist');
    }

    const is_correct = await bcrypt.compare(password, user.password);
    if (is_correct) {
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("Generated token:", token);
        return { data: user, token: token };
    }

    throw new Error('Incorrect password');
}

async function updateTask(user_id, task_id, title, description, deadline) {
    let bulanS = deadline.bulan;
    let hariS = deadline.hari;
    if (deadline.bulan < 10) {
        bulanS = "0" + bulanS;
    }

    if (deadline.hari < 10) {
        hariS = "0" + hariS;
    }

    let tahunS = deadline.tahun.toString();
    let tambal = "";
    for (let x = 0; x < 4 - tahunS.length; x++) {
        tambal += "0";
    }

    tahunS = tambal + tahunS;
    const deadlineAsli = tahunS + "-" + bulanS + "-" + hariS;
    const text = "update tasks set title = $1, description = $2, deadline = $3 where user_id = $4 and task_id = $5 returning *";
    const resp = await pool.query(text, [title, description, deadlineAsli, user_id, task_id]);

    return { data: resp.rows[0] };
}

module.exports = { login, signUp, updateTaskSudah, updateTask };