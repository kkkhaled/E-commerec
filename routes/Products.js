const express = require("express");
const router = express.Router({ mergeParams: true });
const Product = require("../models/Products");
const advancedResults = require("../middleware/queries");
const {
  getProducts,
  getProduct,
  addProduct,
  uploadImage,
  updateProduct,
  deleteProduct,
  getProductsByUser,
} = require("../controllers/products");

const {
  addOrder,
  updateOrder,
  removeOrder,
  getOrderByProduct,
} = require("../controllers/orders");

const { getReviewByProduct, addReview } = require("../controllers/reviews");

const OrdersRouter = require("./Orders");
const ReviewsRouter = require("./Reviews");

const { acceessRoles, protect } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(Product, "orders"), getProducts)
  .post(protect, acceessRoles("admin"), addProduct);

router.route("/:id").get(getProduct);
router.route("/:id/image").put(protect, acceessRoles("admin"), uploadImage);
router.route("/:id").put(protect, acceessRoles("admin"), updateProduct);
router.route("/:id").delete(protect, acceessRoles("admin"), deleteProduct);

router
  .route("/:productId/order")
  .post(protect, addOrder)
  .put(protect, updateOrder)
  .delete(protect, removeOrder)
  .get(getOrderByProduct);

router
  .route("/:productId/review")
  .get(getReviewByProduct)
  .post(protect, acceessRoles("user"), addReview);

//find profducts for specific user
router.route("/user").get(protect, getProductsByUser);

module.exports = router;
