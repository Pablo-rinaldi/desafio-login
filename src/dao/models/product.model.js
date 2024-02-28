const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const UserModel = require("./user.model.js");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
  },
  code: {
    type: Number,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [String],
  },
});
productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
