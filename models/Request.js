const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require("mongoose-mongodb-errors");

// Request db schema set up and initiation
const requestSchema = new mongoose.Schema({
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: Number,
        enums: [
            0, //'rejected',
            1, //'pending',
            2, //'accepted',
        ],
        default: 1,
    },
}, {
    timestamps: true,
});

requestSchema.plugin(mongodbErrorHandler)

module.exports = new mongoose.model("Request", requestSchema);