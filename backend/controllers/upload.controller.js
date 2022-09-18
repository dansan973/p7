const UserModel = require("../models/user.model");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const fs = require("fs");




module.exports.uploadProfil = async(req, res) => {

    try {
        if (
            req.file.detectedMimeType != "image/jpg" &&
            req.file.detectedMimeType != "image/png" &&
            req.file.detectedMimeType != "image/jpeg"
        )

            throw Error("invalid file");

        if (req.file.size > 500000)
            throw Error("max size");
    } catch (err) {

        return res.status(400).json({ errors });
    }
    const fileName = req.body.name + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../images/${fileName}`
        )
    );
    try {
        await UserModel.findByIdAndUpdate(
            req.auth.userId, { $set: { picture: "./uploads/profil/" + fileName } }, { new: true, upsert: true, setDefaultsOnInsert: true },

        );
        return res.status(201).send()

    } catch (err) {
        return res.status(500).json({ message: err });
    }
};