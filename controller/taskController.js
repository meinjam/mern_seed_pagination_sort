const Task = require('../models/taskModel');

const getTasks = async (req, res) => {
  const page = req.query?.page || 1;
  const itemsPerPage = req.query?.size || 20;
  const getSearch = new RegExp(req.query?.search || '', 'i');
  const getReps = req.query?.reps;
  const getLoad = req.query?.load;

  const sort = {};
  if (getReps) {
    sort.reps = getReps === 'asc' ? 1 : -1;
  }
  if (getLoad) {
    sort.load = getLoad === 'asc' ? 1 : -1;
  }

  // Fetch total count of documents in the collection
  const totalCount = await Task.countDocuments({
    title: getSearch,
  });

  let aggregationArray = [
    {
      $match: {
        title: getSearch, // Filter based on the search query
      },
    },
    {
      $skip: (Number(page) - 1) * Number(itemsPerPage), // Skip documents for previous pages
    },
    {
      $limit: Number(itemsPerPage), // Limit the number of documents per page
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $unwind: {
        path: '$userDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        id: '$_id',
        title: 1,
        reps: 1,
        load: 1,
        createdAt: 1,
        'userDetails.fullname': 1,
        'userDetails.email': 1,
        'userDetails.id': '$userDetails._id',
      },
    },
  ];

  if (Object.keys(sort).length > 0) {
    aggregationArray = [{ $sort: sort }, ...aggregationArray];
  }

  const Tasks = await Task.aggregate(aggregationArray);

  res.json({
    page: Number(page),
    pageSize: Number(itemsPerPage),
    totalCount,
    data: Tasks,
  });
};

module.exports = { getTasks };
