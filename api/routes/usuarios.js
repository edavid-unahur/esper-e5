var express = require("express");
var router = express.Router();
var models = require("../models");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');


dotenv.config();

router.post("/", (req, res) => {
    models.usuario
        .create({ email: req.body.email, password: req.body.password })
        .then(usuario => res.status(201).send({ id: usuario.id }))
        .catch(error => {
            if (error == "SequelizeUniqueConstraintError: Validation error") {
                res.status(400).send('Bad request: existe otro usuario con el mismo email')
            }
            else {
                console.log(`Error al intentar insertar en la base de datos: ${error}`)
                res.sendStatus(500)
            }
        });
});

router.post("/generateToken", (req, res) => {
    models.usuario
        .findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        }
        })
        .then(usuario => {
        if (usuario) {
            const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: 60 * 60 * 24
            }
            );
            res.send({ token });
        } else {
            res.status(401).send({ error: "Usuario o contraseña incorrectos" });
        }
        })
        .catch((error) =>{
            console.log(`Error al intentar insertar en la base de datos: ${error}`)
            res.sendStatus(500);
        });
});

router.get("/validateToken", (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
        res.status(401).send({ error: "Token inválido" });
        } else {
        res.send("Verificado");
        }
    });
});

module.exports = router;