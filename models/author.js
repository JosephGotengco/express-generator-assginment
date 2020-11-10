var mongoose = require("mongoose");
const { DateTime } = require("luxon");
const getNumberSuffix = require("../utils/date_suffix");
const getMonthName = require("../utils/month_name");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
    first_name: { type: String, required: true, maxlength: 100 },
    family_name: { type: String, required: true, maxlength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
    return this.family_name + ", " + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function () {
    if (!this.date_of_birth) {
        return "N/A";
    }
    let end_datetime;
    if (this.date_of_death) {
        end_datetime = DateTime.fromJSDate(this.date_of_death);
    } else {
        end_datetime = DateTime.local();
    }
    const birth_datetime = DateTime.fromJSDate(this.date_of_birth);
    const date_diff = end_datetime.diff(birth_datetime, [
        "years",
        "months",
        "days",
        "hours",
        "minutes",
        "seconds",
    ]);
    return date_diff.toObject();
});

// Virtual for formatted date of birth
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
    if (this.date_of_birth) {
        const birth_datetime = DateTime.fromJSDate(this.date_of_birth);
        const month_name = getMonthName(birth_datetime.month - 1).substring(
            0,
            3
        );
        const day_suffix = getNumberSuffix(birth_datetime.day);
        return `${month_name} ${birth_datetime.day}${day_suffix}, ${birth_datetime.year}`;
    }
});

// Virtual for formatted date of death
AuthorSchema.virtual("date_of_death_formatted").get(function () {
    if (this.date_of_death) {
        const birth_datetime = DateTime.fromJSDate(this.date_of_death);
        const month_name = getMonthName(birth_datetime.month - 1).substring(
            0,
            3
        );
        const day_suffix = getNumberSuffix(birth_datetime.day);
        return `${month_name} ${birth_datetime.day}${day_suffix}, ${birth_datetime.year}`;
    }
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
    return "/catalog/author/" + this._id;
});

//Export model
module.exports = mongoose.model("Author", AuthorSchema);
