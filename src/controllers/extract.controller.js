import joi from "joi";

export async function postExtract (req, res){

    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if(!token){
        res.status(401).send({message: "Você não está autorizado a prosseguir!"});
        return;
    };

    try{
        const session = await collectionSessions.findOne({token});
        const user = await collectionUsers.findOne({_id: session?.userId});

        if(!user){
            res.status(401).send({ message: "O usuário não está cadastrado!" });
            return;
        };

        delete user.password;
    } catch (error) {
        res.status(500).send(error);
    };

};
//{data, valor, tipo, descrição}

export async function getHistory (req, res){

    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if(!token){
        res.status(401).send({message: "Você não está autorizado a prosseguir!"});
        return;
    };

    try{
        const session = await collectionSessions.findOne({token});
        const user = await collectionUsers.findOne({_id: session?.userId});

        if(!user){
            res.status(401).send({ message: "O usuário não está cadastrado!" });
            return;
        };

        delete user.password;
    } catch (error) {
        res.status(500).send(error);
    };

};