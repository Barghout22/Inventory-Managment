var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});

const upload = multer({ storage: storage });
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

/* GET home page. */
router.get("/", category_controller.index);
router.get("/categories", category_controller.category_list);
router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);
router.get("/category/:id", category_controller.category_detail);
router.get("/category/:id/delete", category_controller.category_delete_get);
router.post("/category/:id/delete", category_controller.category_delete_post);
router.get("/category/:id/update", category_controller.category_update_get);
router.post("/category/:id/update", category_controller.category_update_post);

router.get("/items", item_controller.item_list);
router.get("/item/create", item_controller.item_create_get);
router.post(
  "/item/create",
  upload.single("image"),
  item_controller.item_create_post
);
router.get("/item/:id", item_controller.item_detail);
router.get("/item/:id/delete", item_controller.item_delete_get);
router.post("/item/:id/delete", item_controller.item_delete_post);
router.get("/item/:id/update", item_controller.item_update_get);
router.post(
  "/item/:id/update",
  upload.single("image"),
  item_controller.item_update_post
);

module.exports = router;
