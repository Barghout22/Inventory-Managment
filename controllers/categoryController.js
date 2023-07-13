const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  const [requested_category, items_in_category] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description").exec(),
  ]);
  if (requested_category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_detail", {
    title: "Category details",
    requested_category: requested_category,
    items_in_category: items_in_category,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

exports.category_create_post = [
  body("name", "category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "category description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({
        name: req.body.name,
      }).exec();

      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description"),
  ]);
  if (category === null) {
    res.redirect("/categories");
  }
  res.render("delete_category", {
    title: "Delete Category",
    category: category,
    allItemsInCategory: allItemsInCategory,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description"),
  ]);
  if (allItemsInCategory > 0) {
    res.render("delete_category", {
      title: "Delete Category",
      category: category,
      allItemsInCategory: allItemsInCategory,
    });
    return;
  } else {
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect("/categories");
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  res.render("category_form", { title: "Update Category", category: category });
});

exports.category_update_post = [
  body("name", "category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "category description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const theCateg = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      // Redirect to book detail page.
      res.redirect(theCateg.url);
    }
  }),
];
