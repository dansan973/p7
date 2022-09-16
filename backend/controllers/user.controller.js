const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async(req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown:' + req.params.id)

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('ID unknown:' + err);
    }).select('-password')
}
module.exports.updateUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('ID unknown:' + req.params.id)

    try {
        await UserModel.findOneAndUpdate({ _id: req.params.id }, {
                $set: { bio: req.body.bio }
            }, { new: true, upsert: true, setDefaultsOnInsert: true }, )
            .then((docs) => {

                if (docs === null) {

                    throw new Error('error');

                }
                res.send(docs);
            })

    } catch (error) {
        return res.status(500).json({ message: error })

    }
};

module.exports.deleteUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).json('ID unknown:' + req.params.id)

    try {
        await UserModel.deleteOne({ _id: req.params.id }).exec()
        res.status(200).json({ message: "successfully deleted." })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}
module.exports.follow = async(req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).json('ID unknown:' + req.params.id)

    try {
        //add to the follower list
        let whomFollowed = await UserModel.findByIdAndUpdate(
            req.params.id, { $addToSet: { following: req.body.idToFollow } }, { new: true, upsert: true },

        );
        //add to following list
        let whoFollowedMe = await UserModel.findByIdAndUpdate(
            req.body.idToFollow, { $addToSet: { followers: req.params.id } }, { new: true, upsert: true },

        );


        return res.status(201).json("follow ok");



    } catch (error) {
        return res.status(500).json({ message: error })
    }
}
module.exports.unfollow = async(req, res) => {

    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow))
        return res.status(400).json('ID unknown:' + req.params.id)

    try {
        //add to the follower list
        let whomUnFollowed = await UserModel.findByIdAndUpdate(
            req.params.id, { $pull: { following: req.body.idToUnfollow } }, { new: true, upsert: true },

        );
        //add to following list
        let whomUnFollowedMe = await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow, { $pull: { followers: req.params.id } }, { new: true, upsert: true },

        );
        return res.status(201).json("unfollow ok");


    } catch (error) {
        return res.status(500).json({ message: error })
    }
}