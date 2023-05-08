const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please Enter the Product name"]
  },
  description1:{
    type:String,
    required:[true,"Please Enter the Description"]
  },
  description2:{
    type:String,
    required:[true,"Please Enter the Description"]
  },
  description3:{
    type:String,
    required:[true,"Please Enter the Description"]
  },
  pricehigh:{
    type:Number,
    required:[true,"Please Enter the Highprize"],
    maxLength:[8,"Please Enter Price less than 8 digit"]
  },
  pricelow:{
    type:Number,
    required:[true,"Please Enter the Lowprize"],
    maxLength:[8,"Please Enter Price less than 8 digit"]
  },
  ratings:{
    type:Number,
    default:0
  },
  numOfReviews:{
    type:Number,
    default:0,
  },
  category:{
    type:String,
    required:[true,"Please Enter the Category"],
  },
  stock:{
    type:Number,
    default:1,
    required:[true,"Please enter Product Stock"],
    maxLength:[8,"Product Stock length is less than 8"]
  },
  type:{
    type:String,
    required:[true,"Enter the Food Type Veg/Non-veg"]
  },
    // images:[{
    //   public_id:{
    //       tpye:String,
    //       required:true,
    //   },
    //   url:{
    //       type:String,
    //       required:true
    //   }
    // }],
//   reviews:[{
//     user:{
//         type:mongoose.Schema.ObjectId,
//         ref:"User",
//         required:true,
//     },
//     name:{
//         type:String,
//         required:true,
//     },
//     rating:{
//         type:Number,
//         required:true,
//     },
//     comment:{
//         type:String,
//         required:true,
//     }
//   }],
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now,
  }

});


module.exports = mongoose.model('product', productSchema);