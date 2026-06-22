/**
 * Lightweight helper for building paginated, searchable, sortable
 * Mongoose queries from req.query without pulling in an extra dependency.
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Generic search across one or more text fields (case-insensitive)
  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const regex = new RegExp(this.queryString.search, 'i');
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: regex })),
      });
    }
    return this;
  }

  // Exact-match filters, e.g. department, semester, status
  filter(allowedFields = []) {
    allowedFields.forEach((field) => {
      if (this.queryString[field]) {
        this.query = this.query.find({ [field]: this.queryString[field] });
      }
    });
    return this;
  }

  sort(defaultSort = '-createdAt') {
    if (this.queryString.sortBy) {
      const order = this.queryString.order === 'desc' ? '-' : '';
      this.query = this.query.sort(`${order}${this.queryString.sortBy}`);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = ApiFeatures;
