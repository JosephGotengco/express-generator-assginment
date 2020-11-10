var mongoose = require("mongoose");
const { DateTime } = require("luxon");
const getNumberSuffix = require("../utils/date_suffix");
const getMonthName = require("../utils/month_name");

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, //reference to the associated book
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        default: "Maintenance",
    },
    due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
    return "/catalog/bookinstance/" + this._id;
});

BookInstanceSchema.virtual("due_back_formatted").get(function () {
    const due_back_datetime = DateTime.fromJSDate(this.due_back);
    const month_name = getMonthName(due_back_datetime.month - 1).substring(
        0,
        3
    );
    const day_suffix = getNumberSuffix(due_back_datetime.day);
    const meridiem = due_back_datetime.hour > 12 ? "PM" : "AM";
    const twelve_hour =
        due_back_datetime.hour > 12
            ? due_back_datetime.hour - 12
            : due_back_datetime.hour;
    return `${twelve_hour}:${due_back_datetime.minute}${meridiem} on ${month_name} ${due_back_datetime.day}${day_suffix}, ${due_back_datetime.year}`;
});

//Export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);
