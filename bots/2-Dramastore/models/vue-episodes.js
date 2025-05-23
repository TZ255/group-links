const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EpisodeSchema = new Schema(
  {
    dramaId: {
      type: String,
      required: true,
    },
    update: {
      type: String,
      required: true,
    },
    link3: {
      type: String,
      required: false,
    },
    labelLink3: {
      type: String,
      required: false,
      default: "K-Vid: ",
    },
  },
  { timestamps: true, strict: false }
);

const dramastore = mongoose.connection.useDb('dramastore')
const model = dramastore.model("episodes", EpisodeSchema);
module.exports = model;
