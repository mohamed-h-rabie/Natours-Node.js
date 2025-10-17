const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/ApiFeatures');

const cathcAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.getAll = (Model) =>
  cathcAsync(async (req, res, next) => {
    let filter = {};
    console.log(req.params.tourId, 'params');

    if (req.params.tourId) filter = { tour: req.params.tourId };
    console.log(filter);
    console.log(req.query);

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const document = await features.query;

    res.status(200).json({
      status: 'successed',
      length: document.length,
      time: req.respondTime,
      data: {
        document,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  cathcAsync(async (req, res, next) => {
    const id = req.params.id;
    console.log(id, 'id');
    const query = Model.findById(id);

    if (popOptions) query.populate(popOptions);
    const document = await query;
    if (!document) {
      return next(new AppError(`No document founded with that ID ${id}`, 404));
    }
    res.status(200).json({
      status: 'successed',
      time: req.respondTime,
      data: {
        document,
      },
    });
  });
exports.createOne = (Model) =>
  cathcAsync(async (req, res) => {
    const body = req.body;

    const document = await Model.create(body);
    res.status(200).json({
      status: 'successed',
      time: req.respondTime,
      data: {
        document,
      },
    });
  });
exports.deleteOne = (Model) =>
  cathcAsync(async (req, res, next) => {
    const id = req.params.id;

    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new AppError(`No document founded with that ID ${id}`, 404));
    }
    res.status(200).json({
      status: 'successed',
      time: req.respondTime,
      message: `You sucessfully deleted a document`,
    });
  });

exports.updateOne = (Model) =>
  cathcAsync(async (req, res, next) => {
    const id = req.params.id;

    const body = req.body;

    const document = await Model.findByIdAndUpdate(id, body, {
      new: true, // ✅ return the updated document
      runValidators: true,
    });

    if (!document) {
      return next(new AppError(`No document founded with that ID ${id}`, 404));
    }
    res.status(200).json({
      status: 'successed',
      time: req.respondTime,
      data: {
        document,
      },
    });
  });
