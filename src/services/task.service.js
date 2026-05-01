const pool = require('../config/database');

async function getTask(search, user_id) {
    const bulan = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const angkaBulan = {}

    for (let x = 1; x <= 12; x++) {
        angkaBulan[x] = bulan[x];
    }

    const text0 = "select * from users where user_id = $1";
    const respUser = await pool.query(text0, [user_id]);
    const user = respUser.rows[0];

    if (!user) {
        throw new Error('User doesn\'t exist');
    }

    const keyword = search && search.trim() !== '' ? `%${search}%` : '%';
    const text = "select task_id, title, description, deadline from tasks where user_id = $1 and sudah = FALSE and title ILIKE COALESCE(NULLIF($2, ''), '%') order by deadline";
    const resp = await pool.query(text, [user_id, keyword]);
    let hasilSemua = [];
    for (let row of resp.rows) {
        const task_id = row.task_id;
        const titleRes = row.title;
        const descriptionRes = row.description;
        const deadlineResS = row.deadline.toString();
        const deadlineRes = new Date(deadlineResS);
        const tahunRes = deadlineRes.getFullYear();
        const bulanRes = deadlineRes.getMonth();
        const hariRes = deadlineRes.getDate();

        const tahunS = tahunRes.toString();
        const bulanS = angkaBulan[bulanRes];
        const hariS = hariRes.toString();

        const hasilDeadline = bulanS + " " + hariS + ", " + tahunS;
        hasilSemua.push({
            task_id: task_id,
            title: titleRes,
            description: descriptionRes,
            deadline: hasilDeadline,
            tahun: tahunRes,
            bulan: bulanRes + 1,
            hari: hariRes
        })
    }

    const ada = hasilSemua.length > 0;
    return { data: hasilSemua, user: user, ada: ada };
}

async function updateTaskSudah(user_id, task_id) {
    let text = "update tasks set sudah = TRUE where user_id = $1 and task_id = $2 returning *"
    const resp = await pool.query(text, [user_id, task_id]);
    return { data: resp.rows[0] };
}

async function createTask(user_id, title, description, deadline) {
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
    const text = "insert into tasks(user_id, title, description, deadline) values($1, $2, $3, $4) returning *";
    const resp = await pool.query(text, [user_id, title, description, deadlineAsli]);
    return { data: resp.rows[0] };
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
    return {data: resp.rows[0]};
}

async function deleteTask(user_id, task_id) {
    const text = "delete from tasks where user_id = $1 and task_id = $2";
    const resp = await pool.query(text, [user_id, task_id]);
    return {data: resp.rows[0]};
}

module.exports = { getTask, updateTaskSudah, createTask, updateTask, deleteTask };