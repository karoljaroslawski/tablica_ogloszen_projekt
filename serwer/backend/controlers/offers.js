const fs = require("fs")

const offerModel = require("../models/offerModel");
const auth = require("../controlers/auth")

async function getHomeOffers(res) {
    const result = await offerModel.selectHomeOffers();
    return res.status(200).json({ results: result.rows });
}

async function getUserOffers(token, res) {
    let idUser = await auth.autenthicate(token);
    if (idUser < 0) return res.status(500).send("Nieprawidłowy token");
    const result = await offerModel.selectOffersByUserId(idUser);
    return res.status(200).json({ results: result.rows });
}

async function getOffer(idOffer, res) {
    const result = await offerModel.selectOfferById(idOffer);
    return res.status(200).json({ results: result.rows[0] });
}

async function createOffer(title, description, isPrice, price, token, req, res) {
    let idUser = await auth.autenthicate(token);
    if (idUser < 0) return res.status(500).send("Nieprawidłowy token");
    if (!title || !(isPrice && price)) {
        return res.status(500).json({ message: "Tytuł i cena/bezpłatność są wymagane" });
    }
    if (!req.files || !req.files.photo) {
        console.log("No file data");
        return res.status(500).send("Brak zdjęcia");
    }
    if (!description)
        description = "";
    if (!isPrice)
        price = 0.0

    if (!title || !(!isPrice || price)) {
        sendError("Tytuł, cena/bezpłatność są wymagane");
        return;
    }
    if (isPrice && !price) {
        return res.status(500).json({ message: "Cena/bezpłatność jest wymagana" });
    }
    if (price && Number.isNaN(price)) {
        return res.status(500).json({ message: "Cena musi być liczbą rzeczywistą" });
    }
    if (isPrice && price) {
        if (price > 10000000) {
            return res.status(500).json({ message: "Cena musi być mniejsza niż 1000000" });
        }
        if (price < 0) {
            return res.status(500).json({ message: "Cena musi być dodatnią liczbą rzeczywistą" });
        }
    }

    let file = req.files.photo;
    let path = "files/";
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    path += Date.now() + "__" + file.name;
    path = path.replace(" ", "");
    file.mv(path);
    let result = await offerModel.createOffer(title, description, isPrice, price, new Date(), path, idUser);
    res.status(201).json({ message: "Ogłoszenie utworzono poprawnie", result: result.rows[0] })
}

async function editOffer(idOffer, title, description, isPrice, price, token, req, res) {
    const idUser = await auth.autenthicate(token);
    if (idUser < 0) return res.status(500).send("Nieprawidłowy token");
    let offerResult = await offerModel.selectOfferByIdAndUserId(idOffer, idUser);
    if (offerResult.rowCount <= 0) return res.status(500).send("Ogłoszenie nie istnieje");
    let oldOfferPath = offerResult.rows[0].imagepath;

    if (!title || !(isPrice && price)) {
        return res.status(500).json({ message: "Tytuł i cena są wymagane" });
    }
    if (!description)
        description = "";
    if (!isPrice)
        price = 0.0
    if (isPrice && !price) {
        return res.status(500).json({ message: "Cena/bezpłatność jest wymagana" });
    }
    if (price && Number.isNaN(price)) {
        return res.status(500).json({ message: "Cena musi być liczbą rzeczywistą" });
    }
    if (isPrice && price) {
        if (price > 10000000) {
            return res.status(500).json({ message: "Cena musi być mniejsza niż 1000000" });
        }
        if (price < 0) {
            return res.status(500).json({ message: "Cena musi być dodatnią liczbą rzeczywistą" });
        }
    }
    if (title.length > 255)
        return res.status(500).json({ message: "Tytuł nie może być dłuższy niz 255 znaków" });
    if (description.length > 500)
        return res.status(500).json({ message: "Opis musi zawierać się w 500 znakach" });

    let path = "";
    try {
        if (!req.files || !req.files.photo || req.body.photo) {
            const oldOffer = await offerModel.selectOfferById(idOffer);
            path = oldOffer.rows[0].imagepath;
        }
        else {
            let file = req.files.photo;
            path = "files/";
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }

            path += Date.now() + "__" + file.name;
            path = path.replace(" ", "");
            file.mv(path);
        }
    } catch (err) {
        console.log(err);
    }
    let result = await offerModel.editOffer(idOffer, title, description, isPrice, price, path);
    res.status(200).json({ message: "Edycja ogłoszenia pomylślna" })
}

async function deleteOffer(idOffer, token, res) {
    const idUser = await auth.autenthicate(token);
    const role = await auth.getUserRole(token);
    if (idUser < 0 && role != "admim") return res.status(500).send("Nieprawidłowy token");
    if (role != "admin") {
        let offerResult = await offerModel.selectOfferByIdAndUserId(idOffer, idUser);
        if (offerResult.rowCount <= 0) return res.status(500).send("Ogłoszenie nie istnieje");
    }
    let result = await offerModel.deleteOffer(idOffer);
    res.status(200).json({ message: "Usunięto ogłoszenie" });
}



module.exports = {
    getHomeOffers,
    getUserOffers,
    getOffer,
    createOffer,
    editOffer,
    deleteOffer,
}