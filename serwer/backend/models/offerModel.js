const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


async function createOffer(title, description, isPrice, price, addDate, imagePath, idUser) {
    return await pool.query(
        "INSERT INTO offers (title, description, isPrice, price, isActive, addDate, imagePath, idUser) VALUES ($1, $2, $3, $4, true, $5, $6, $7) RETURNING idOffer",
        [title, description, isPrice, price, addDate, imagePath, idUser]
    );
}

async function selectHomeOffers() {
  return await pool.query(
      "select * from offers where isActive = true"
  );
}

async function selectOfferById(idOffer) {
  return await pool.query(
      "select o.idoffer, o.title, o.description, o.isPrice, o.price, o.isActive, o.addDate, o.imagePath, o.idUser, u.email, u.telnumber from offers as o inner join users as u on o.idUser=u.idUser where o.idOffer = $1 and o.isActive = true",
      [idOffer]
  );
}

async function selectOffersByUserId(idUser) {
  return await pool.query(
      "select * from offers where idUser = $1 and isActive = true",
      [idUser]
  );
}

async function selectOfferByIdAndUserId(idOffer, idUser) {
  return await pool.query(
      "select * from offers where idOffer = $1 and idUser = $2 and isActive = true",
      [idOffer, idUser]
  );
}

async function selectOffersByUserName(userName) {
  return await pool.query(
      "select * from offers as o inner join users as u on o.userId=u.idUser where u.userName like $1 and o.isActive = true",
      [userName]
  );
}

async function editOffer(idOffer, title, description, isPrice, price, imagePath) {
  return await pool.query(
      "update offers set title=$2, description=$3, isPrice=$4, price=$5, imagePath=$6 where idOffer=$1",
      [idOffer, title, description, isPrice, price, imagePath]
  );
}

async function deleteOffer(idOffer) {
  return await pool.query(
      "update offers set isActive = false where idOffer=$1",
      [idOffer]
  );
}

async function deleteAllUserOffers(idUser) {
  return await pool.query(
      "update offers set isActive = false where idUser=$1",
      [idUser]
  );
}

  module.exports={
    pool,
    createOffer,
    selectHomeOffers,
    selectOfferById,
    selectOffersByUserId,
    selectOfferByIdAndUserId,
    selectOffersByUserName,
    editOffer,
    deleteOffer,
    deleteAllUserOffers,
  }