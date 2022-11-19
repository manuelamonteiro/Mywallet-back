import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';

const userUpSchema = joi.object({
    name: joi.string().min(3).required().trim(),
    email: joi.required().email().string().trim(),
    password: joi.required(),
    passwordConfirm: joi.required()
});

const userInSchema = joi.object({
    email: joi.required().email().string().trim(),
    password: joi.required()
});

export async function postSingUp(req, res) {

    const user = req.body;

    try {
        const userExists = await userCollection.findOne({ email: user.email });

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

        if(user.password !== user.passwordConfirm){
            res.status(400).send({message: "As senhas digitadas são diferentes!"});
            return;
        };

        const hashPassword = bcrypt.hashSync(user.password, 10);

        await userCollection.insertOne({ ...user, password: hashPassword });
        res.status(201).send({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        res.status(500).send(error);
    };

};

export async function postSingIn(req, res) {

    const { email, password } = req.body;

    try {
        const userExists = await userCollection.findOne({ email });

        if(!userExists){
            res.status(401).send({message: "O e-mail não está cadastrado!"});
            return;
        };

        const validationStatus = userInSchema.validate(req.body, { abortEarly: false });

        if (validationStatus.error) {
            const error = validationStatus.error.details.map((detail) => detail.message);
            res.status(422).send(error);
            return;
        };

        const passwordOk = bcrypt.compareSync(password, userExists.password);

        if(!passwordOk){
            res.status(401).send({message: "A senha está incorreta!"});
        };

        res.send({message: `Olá ${userExists.name}, seja bem-vinde!`});
    } catch (error) {
        res.status(500).send(error);
    }

};
