import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';
import { collectionSessions, collectionUsers } from "../database/db.js";

const userUpSchema = joi.object({
    name: joi.string().min(3).required().trim(),
    email: joi.string().email().required().trim(),
    password: joi.string().required(),
    passwordConfirm: joi.string().required()
});

const userInSchema = joi.object({
    email: joi.string().email().required().trim(),
    password: joi.required()
});

export async function postSingUp(req, res) {

    const user = req.body;

    try {
        const userExists = await collectionUsers.findOne({ email: user.email });

        if (userExists) {
            res.status(409).send({ message: "Esse e-mail já está cadastrado!" });
            return;
        };

        const validationStatus = userUpSchema.validate(req.body, { abortEarly: false });

        if (validationStatus.error) {
            const error = validationStatus.error.details.map((detail) => detail.message);
            res.status(422).send(error);
            return;
        };

        if (user.password !== user.passwordConfirm) {
            res.status(400).send({ message: "As senhas digitadas são diferentes!" });
            return;
        };

        const hashPassword = bcrypt.hashSync(user.password, 10);

        await collectionUsers.insertOne({ ...user, password: hashPassword });
        res.status(201).send({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    };

};

export async function postSingIn(req, res) {

    const { email, password } = req.body;

    const token = uuidV4();

    try {
        const userExists = await collectionUsers.findOne({ email });

        if (!userExists) {
            res.status(401).send({ message: "O e-mail não está cadastrado!" });
            return;
        };

        const validationStatus = userInSchema.validate(req.body, { abortEarly: false });

        if (validationStatus.error) {
            const error = validationStatus.error.details.map((detail) => detail.message);
            res.status(422).send(error);
            return;
        };

        const passwordOk = bcrypt.compareSync(password, userExists.password);

        if (!passwordOk) {
            res.status(401).send({ message: "A senha está incorreta!" });
            return;
        };

        await collectionSessions.insertOne({
            token,
            userId: userExists._id
        });

        res.send({ token });
    } catch (error) {
        res.status(500).send(error);
    };

};
