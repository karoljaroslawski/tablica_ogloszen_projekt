require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = express.Router()

const auth = require("./controlers/auth");
const offers = require("./controlers/offers");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    // Configure file uploads with maximum file size 10MB
    limits: { fileSize: 10 * 1024 * 1024 },

    // Temporarily store uploaded files to disk, rather than buffering in memory
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use('/api/files',express.static('./files/'));
app.use('/api', router);


router.get('/', (req, res) => {
  res.send('Backend API is running.')
})


router.post("/register", async (req, res) => {
  const { username, email, password, phone } = req.body;
  auth.register(username, email, password, phone, res);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  auth.login(username, password, res);
});

router.post("/changepassword", async (req, res) => {
  const token=req.headers.authorization;
  const {oldPassword, newPassword} = req.body;
  auth.changeUserPassword(token, oldPassword, newPassword, res);
});

router.get("/gethomeoffers", async (req, res) => {
  offers.getHomeOffers(res);
});

router.get("/getuseroffers", async (req, res) => {
  const token=req.headers.authorization;
  offers.getUserOffers(token, res);
});

router.get("/getoffer", async (req, res) => {
  const {idOffer} = req.query;
  offers.getOffer(idOffer, res);
});

router.post("/createoffer", async (req, res) => {
  const token=req.headers.authorization;
  const {title, description, isPrice, price} = req.body;
  offers.createOffer(title, description, isPrice, price, token, req, res);
})

router.post("/editoffer", async (req, res) => {
  const token=req.headers.authorization;
  const {idOffer, title, description, isPrice, price} = req.body;
  offers.editOffer(idOffer, title, description, isPrice, price, token, req, res);
})

router.post("/deleteoffer", async (req, res) => {
  const token = req.headers.authorization;
  const {idOffer} = req.body;
  offers.deleteOffer(idOffer, token, res);
})

router.delete("/deleteuser", async (req, res) => {
  const token=req.headers.authorization;
  auth.deleteUser(token, res);
})

app.listen(PORT, () => {
  console.log(`Aplikacja nasłuchuje na porcie: ${PORT}`)
})