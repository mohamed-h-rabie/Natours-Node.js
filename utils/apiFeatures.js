class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  // Filter
  filter() {
    const queryObj = { ...this.queryString };
    const ignoredQueries = ['fields', 'page', 'sort', 'limit'];
    ignoredQueries.forEach((el) => delete queryObj[el]);
    //Advanced Filter
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|lte|lt|gt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  sort() {
    //Sort
    // let sortBy = req.query.sort;

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      const sortBy = '-createdAt';
      console.log('D');

      this.query = this.query.sort(sortBy);
    }
    return this;
  }
  limitFields() {
    //Linit Fields
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      console.log(fields);

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    const limit = this.queryString.limit;
    const page = this.queryString.page;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
