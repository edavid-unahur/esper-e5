var express = require("express");
var router = express.Router();
var models = require("../models");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

dotenv.config();

router.post("/", (req, res) => {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        models.usuario.findOne({
            where: { email: req.body.email }
        }).then(usuario => {
            if (usuario) {
                res.status(400).send('Bad request: existe otro usuario con el mismo email')
            }
            else {
                models.usuario.create({ email: req.body.email, password: hash })
                    .then(usuario => res.status(201).send({ id: usuario.id }))
                    .catch(error => {
                        if (error == "SequelizeUniqueConstraintError: Validation error") {
                            res.status(400).send('Bad request: existe otro usuario con el mismo email')
                        }
                        else {
                            console.log(`Error al intentar insertar en la base de datos: ${error}`)
                            res.sendStatus(500)
                        }
                    }
                    )
            };
        })
    })
});

router.get("/", (req, res) => {
    models.usuario
        .findAll({
            attributes: ["id", "email", "password", "createdAt", "updatedAt"]
        })
        .then(usuarios => res.send(usuarios))
        .catch(error => { return next(error) });
});

router.post("/generateToken", (req, res) => {
    models.usuario
        .findOne({
            where: {
                email: req.body.email,
            }
        })
        .then(usuario => {
            if (usuario) {
                bcrypt.compare(req.body.password, usuario.password, function (err, result) {
                    if (result) {
                        const token = jwt.sign(
                            { id: usuario.id, email: usuario.email },
                            process.env.JWT_SECRET_KEY,
                            {
                                expiresIn: 60 * 60 * 24
                            }
                        );
                        res.send({ token });
                    }
                    else {
                        res.status(401).send({ error: "Usuario o contraseña incorrectos" });
                    }
                });
            } else {
                res.status(401).send({ error: "Usuario o contraseña incorrectos" });
            }
        })
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