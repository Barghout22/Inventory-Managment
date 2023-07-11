const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numCategories, numItems] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Inventory homepage",
    number_of_categories: numCategories,
    number_of_items: numItems,
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name")
    .sort({ name: 1 })
    .exec();
  res.render("category_list", {
    title: "list of item categories",
    category_list: allCategories,
  });
});
exports.category_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: category detail: ${req.params.id}`);
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: category create get`);
});

exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: category create post`);
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: category delete get`);
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: category delete post`);
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: category update get`);
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: category update post`);
});
