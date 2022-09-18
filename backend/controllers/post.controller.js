const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require('../models/user.model')
const ObjectID = require("mongoose").Types.ObjectId;


module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
            if (!err) res.send(docs);
            else console.log("Error to get data : " + err);
        }) //.sort({ createdAt: -1 });

}




module.exports.createPost = async(req, res) => {
    const newPost = new postModel({
        posterId: req.body.posterId,
        message: req.body.message,

        video: req.body.video,
        likers: [],
    });
    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
};




module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    const updatedRecord = {
        message: req.body.message,
    };
    PostModel.findByIdAndUpdate(
        req.params.id, { $set: updatedRecord }, { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update error : " + err);
        }
    );
}



module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("Delete error : " + err);
    });
}

module.exports.likePost = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id, {
                $addToSet: { likers: req.auth.userId },
            }, { new: true },
            /*(err, docs) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send(err)

                }
            }*/
        );
        await UserModel.findByIdAndUpdate(
            req.auth.userId, {
                $addToSet: { likes: req.params.id },
            }, { new: true },

            /*(err, docs) => {
                if (!err) res.status(200).send(docs);
                else {
                    console.log(err)
                    return res.status(400).send(err)

                }*/
        );
        res.status(201).send()
    } catch (err) {
        console.log(err)
        return res.status(400).send(err)

    }
}