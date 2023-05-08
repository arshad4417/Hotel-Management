const express = require("express");
const router = express.Router();
const {createProduct, getAllProducts, updateProduct, deleteProduct, getProductDetails} = require("../controllers/productController");
const { isAuthenticated ,authorizeRoles } = require("../middleware/auth");

router.route('/product/new').post(isAuthenticated,createProduct);
router.route('/product/:id').get(getProductDetails).put(isAuthenticated,updateProduct).delete(isAuthenticated,deleteProduct);
router.route('/products').get(isAuthenticated,authorizeRoles("admin"),getAllProducts);

module.exports = router;
