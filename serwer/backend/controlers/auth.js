require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const offerModel = require("../models/offerModel");



async function register(username, email, password, phone, res){
    try {
        
        if (!username || !email || !password ) {
            return res.status(500).json({ message: "Wszystkie pola są wymagane" });
        }
        
        if((await userModel.selectUserByUnameEmail(username,email)).rowCount>0)
            return res.status(500).json({message:"Nazwa użytkownika lub email zajęty"});
        if((await userModel.selectUserByPhone(phone)).rowCount>0)
            return res.status(500).json({message:"Numer telefonu już zajęty"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userModel.createUser(username,email,hashedPassword, phone);

        res.status(201).json({ message: "Zarejestrowano pomyślnie", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Błąd serwera: " + err.message });
    }
};

async function login(username, password, res) {
    try{
        const result = await userModel.selectUserByUsername(username);
        if(result.rowCount==0){
            res.status(500).json({message:"Nieprawidłowa nazwa użytkownika."});
            return;
        }
        const user = result.rows[0];
        const equal = await bcrypt.compare(password,user.password);
        if(equal==true){
            const token = jwt.sign(
                {idUser:user.iduser},
                process.env.JWT_SECRET,
                {
                    algorithm:"HS256",
                    allowInsecureKeySizes:true,
                    expiresIn:3600
                });
            res.status(200).json({message:"Zalogowano poprawnie.",token:token,username:user.username,idUser:user.iduser,email:user.email, idRole: user.idrole});
            return;
        }
        else{
            res.status(500).json({message:"Nieprawidłowe hasło"});
            return;
        }
    }
    catch (err) {
        res.status(500).json({ message: "Błąd serwera: " + err.message });
    }
    
};

async function autenthicate(token) {
    try{
        let token_arr = token.split(" ");
        token=token_arr[token_arr.length - 1];
        const content = jwt.verify(token,process.env.JWT_SECRET);
        const result = await userModel.selectUserById(content.idUser);
        if(result.rows[0].iduser==content.idUser && (content.exp*1000)>=Date.now())
            return content.idUser;
        return -1;
    }
    catch(err){
        if(!err=="JsonWebTokenError: jwt must be provided")
            console.log("Błąd autentykacji tokena JWT: "+err);
        return -2;
    }
}

async function getUserRole(token, res) {    
    let idUser = await autenthicate(token);
    if(idUser<0) return "";
    const result = await userModel.selectUserRoleById(idUser);
    return result.rows[0].role;
}

async function deleteUser(token, res) {    
    let idUser = await autenthicate(token);
    if(idUser<0) return res.status(200).send("Nieprawidłowy token");
    try {
        const result1 = await offerModel.deleteAllUserOffers(idUser)
        const result2 = await userModel.deleteUser(idUser);

        res.status(200).json({ message: "Użytkownik usunięty pomyślnie" });
    } catch (err) {
        res.status(500).json({ message: "Błąd serwera: " + err.message });
    }
}

module.exports={
    register,
    login,
    autenthicate,
    getUserRole,
    deleteUser
}