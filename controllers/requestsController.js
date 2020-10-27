const mongoose = require("mongoose");
const Request = mongoose.model("Request")
const User = mongoose.model("User")
const promisify = require("es6-promisify");
const mail = require("../handlers/mail")

exports.manageRequests = async (req, res) => {

    if (req.user.classification === "Mentee") {
        let menteeRequests = await Request.find({
            mentee: req.user._id,
        })
        .populate("mentor")
        .exec();

        res.render("requests", {
            title: "Manage Requests", menteeRequests
        });
    } else {
        let mentorRequests = await Request.find({
            mentor: req.user._id,
        })
        .populate("mentee")
        .exec();

        res.render("requests", {
            title: "Manage Requests", mentorRequests
        });
    }


}


exports.addRequest = async (req, res) => {
    // save new request
    const newRequest = await new Request({
        mentee: req.user._id,
        mentor: req.params.userId,
        status: 1,
      }).save();

    // update mentor model with new request id
    const updatedMentor = await User.findOneAndUpdate({
        _id: req.params.userId,
    }, {
        $addToSet: {
        requests: newRequest,
        },
    },
    {new: true,
    context: "query"}).exec();

    // update mentee model with new request id
    const updatedMentee = User.findOneAndUpdate({
        _id: req.user._id,
    }, {
        $addToSet: {
        requests: newRequest,
        },
    },
    {new: true, context: "query"}).exec();

    // send email notification to mentor that the mentee has requested them
    const mentor = await User.findOne({_id: req.params.userId})
    const mentee = await User.findOne({_id: req.user._id})
    await mail.sendRequest({
        mentor,
        subject: "Mentee Request",
        mentee,
        filename: "mentee-request"
    })

    req.flash("success", `Request has been sent to ${updatedMentor.firstName} ${updatedMentor.lastName}`)
    res.redirect("back");
};

exports.acceptRequest = async (req, res) => {

    // find all accepted requests for mentor
    const acceptedRequests = await Request.find({mentor: req.user._id, status: 2})

    // check if there is more than one accepted request
    if (acceptedRequest.length > 0) {
        req.flash("error", "You can only accept one mentee.")
        res.redirect("back")
    } else {
        const addAcceptedRequest = await Request.findOneAndUpdate({mentee: req.params.userId, mentor: req.user._id}, {status: 2}, {new: true});

        const mentee = await User.findOne({_id: req.params.userId})
        const mentor = await User.findOne({_id: req.user._id})
        await mail.sendAccept({
            mentee,
            subject: "Mentorship Accepted",
            mentor,
            filename: "mentee-accept"
        })

        req.flash("success", "Request has been successfully accepted. A notification has been sent to the mentee.");
        res.redirect("back");

    }

}

exports.declineRequest = async (req, res) => {
    // find the request and update the status to declined
    const declinedRequest = await Request.findByIdAndUpdate({mentee: req.params.userId, mentor: req.user._id}, {status: 0}, {new: true});

    const mentee = await User.findOne({_id: req.params.userId})
    const mentor = await User.findOne({_id: req.user._id})
    await mail.sendDecline({
        mentee,
        subject: "Mentorship Declined",
        mentor,
        filename: "mentee-decline"
    })

    req.flash("success", "Request has been successfully declined. A notification has been sent to the mentee.");
    res.redirect("back");
}



