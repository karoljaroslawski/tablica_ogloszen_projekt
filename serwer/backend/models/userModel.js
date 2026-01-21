const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


async function createUser(userName, email, hashedPassword, phone) {
    return await pool.query(
        "INSERT INTO users (userName, email, password, telnumber, idRole) VALUES ($1, $2, $3, $4, 0) RETURNING idUser, username, email",
        [userName, email, hashedPassword, phone]
    );
}

async function selectUserByUnameEmail(userName, email) {
    return await pool.query(
        "select * from users where userName like $1 or email like $2",
        [userName,email]
    );
}

async function selectUserByUsername(userName) {
  return await pool.query(
      "select * from users where userName like $1 and isActive = true",
      [userName]
  );
}

async function selectUserByPhone(phone) {
  return await pool.query(
      "select * from users where telnumber = $1",
      [phone]
  );
}

async function selectUserRoleIdById(idUser) {
  return await pool.query(
      "select idRole from users where idUser = $1",
      [idUser]
  );
}
async function selectUserRoleById(idUser) {
  return await pool.query(
      "select r.idrole, r.role from users as u inner join roles as r on u.idRole=r.idRole where idUser = $1",
      [idUser]
  );
}

async function selectUserById(idUser) {
  return await pool.query(
      "select * from users where idUser = $1 and isActive = true",
      [idUser]
  );
}

async function changeUserPassword(idUser, newPassword) {
  return await pool.query(
      "update users set password=$2 where idUser=$1",
      [idUser, newPassword]
  );
}

async function deleteUser(idUser) {
  return await pool.query(
      "update users set isActive=false where idUser=$1",
      [idUser]
  );
}

  module.exports={
    pool,
    createUser,
    selectUserByUnameEmail,
    selectUserByUsername,
    selectUserById,
    selectUserRoleIdById,
    selectUserByPhone,
    selectUserRoleById,
    changeUserPassword,
    deleteUser
  }