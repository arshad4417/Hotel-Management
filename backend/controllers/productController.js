const productSchema = require("../schemas/productSchema");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../middleware/catchAsyncErrors");

//CreateProduct -- admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id
  const product = await productSchema.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//GetAllProducts -- admin

exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 5;
  const productCount = await productSchema.countDocuments();
  const apiFeatures = new ApiFeatures(productSchema.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
  });
});

//UpdateProduct -- Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  //Db Id Error Detection
  if (req.params.id.length != 24) {
    return res.status(500).json({
      success: false,
      message: "Invalid Product Id",
    });
  }

  let product = await productSchema.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product Not Found",
    });
  }
  product = await productSchema.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

//DeleteProduct -- admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  //Db Id Error Detection
  if (req.params.id.length != 24) {
    return res.status(500).json({
      success: false,
      message: "Invalid Product Id",
    });
  }

  let product = await productSchema.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product Not Found",
    });
  }
  product = await productSchema.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

//Get Product Details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  //Db Id Error Detection
  if (req.params.id.length != 24) {
    return res.status(500).json({
      success: false,
      message: "Invalid Product Id",
    });
  }

  const product = await productSchema.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product Not Found",
    });
  }
  res.status(200).json({
    success: true,
    product,
  });
});
