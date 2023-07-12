const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().populate("category").exec();
  res.render("item_list", {
    title: "list of all available items",
    item_list: allItems,
  });
});
exports.item_detail = asyncHandler(async (req, res, next) => {
  const requested_item = await Item.findById(req.params.id)
    .populate("category")
    .exec();
  if (requested_item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_detail", {
    title: "details of item",
    requested_item: requested_item,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();
  res.render("item_form", {
    title: "Create item",
    allCategories: allCategories,
  });
});

exports.item_create_post = [
  body("name", "name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("number_in_stock", "number in stock must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });
    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();
      res.render("item_form", {
        title: "Create item",
        allCategories: allCategories,
        item: item,
        errors: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: item delete get`);
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: item delete post`);
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: item update get`);
});

exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: item update post`);
});
