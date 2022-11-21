import dayjs from "dayjs";
import { collectionExtracts, collectionSessions, collectionUsers } from "../database/db.js";

export async function postExtract(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const { value, type, description } = req.body;

    if (!token) {
        res.status(401).send({ message: "Você não está autorizado a prosseguir!" });
        return;
    };

    try {
        const session = await collectionSessions.findOne({ token });

        if (!session) {
            res.status(401).send({ message: "O usuário não está logado!" });
            return;
        };

        const user = await collectionUsers.findOne({ _id: session?.userId });

        if (!user) {
            res.status(401).send({ message: "O usuário não está cadastrado!" });
            return;
        };

        delete user.password;
        delete user.passwordConfirm;

        const extract = {
            userId: session.userId,
            date: dayjs().format("D/M"),
            value: value,
            type: type,
            description: description
        };

        await collectionExtracts.insertOne(extract);

        res.status(200).send({ user, extract });
    } catch (error) {
        res.status(500).send(error);
    };

};

export async function getHistory(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        res.status(401).send({ message: "Você não está autorizado a prosseguir!" });
        return;
    };

    try {
        const session = await collectionSessions.findOne({ token });

        if (!session) {
            res.status(401).send({ message: "O usuário não está logado!" });
            return;
        };

        const user = await collectionUsers.findOne({ _id: session?.userId });

        if (!user) {
            res.status(401).send({ message: "O usuário não está cadastrado!" });
            return;
        };

        delete user.password;

        const extractsList = await collectionExtracts.find({ userId: session.userId }).toArray();
        res.send({ user, extractsList });
    } catch (error) {
        res.status(500).send(error);
    };

};