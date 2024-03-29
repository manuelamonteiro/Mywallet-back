import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';
import { collectionSessions, collectionUsers } from "../database/db.js";

export async function postSingUp(req, res) {

    const user = req.body;

    try {
        const hashPassword = bcrypt.hashSync(user.password, 10);

        await collectionUsers.insertOne({ ...user, password: hashPassword });
        res.status(201).send({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
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
