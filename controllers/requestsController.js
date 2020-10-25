const mongoose = require("mongoose");
const Request = mongoose.model("Request")
const User = mongoose.model("User")
const promisify = require("es6-promisify");

exports.manageRequests = (req, res) => {
    res.render("requests", {
        title: "Manage Requests"
    })
}

exports.addRequest = async (req, res) => {
    const newRequest = await new Request({
        mentee: req.user._id,
        mentor: req.params.userId,
        status: 1,
      }).save();

    const updatedMentor = await User.findOneAndUpdate({
        _id: req.params.userId,
    }, {
        $addToSet: {
        requests: newRequest,
        },
    },
    {new: true,
    context: "query"}).exec();

    const updatedMentee = User.findOneAndUpdate({
        _id: req.user._id,
    }, {
        $addToSet: {
        requests: newRequest,
        },
    },
    {new: true, context: "query"}).exec();

    res.json(updatedMentee)

    // req.flash("success", "Your request was successful!")
    // res.status(204).send();


};

