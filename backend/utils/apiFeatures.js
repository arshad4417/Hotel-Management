class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword, //regular expression mongodb operator
            $options: "i",   
          }, 
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter(){
    let queryCopy = {...this.queryStr};
    const remove_field = ["keyword","page","limit"];
    remove_field.forEach((key)=>delete queryCopy[key] )

    //price or Rating filter
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)


    this.query = this.query.find(JSON.parse(queryStr))
    return this;
  }
  pagination(resultPerPage){
    const currentPage = Number(this.queryStr.page) || 1
    const skip = resultPerPage * (currentPage -1 );

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}
module.exports = ApiFeatures;
