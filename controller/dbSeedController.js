const { faker } = require('@faker-js/faker');
const User = require('../models/userModel');
const Task = require('../models/taskModel');

const seedUser = async (req, res) => {
  const users = userDemoData(500);
  User.insertMany(users)
    .then((docs) => {
      res.json({ success: `${docs.length} data have been inserted into the database.` });
    })
    .catch((err) => {
      console.error(err);
      console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    });
};

const seedTask = async (req, res) => {
  const tasks = await taskDemoData(10000);
  //   res.json(tasks);
  Task.insertMany(tasks)
    .then((docs) => {
      res.json({ success: `${docs.length} data have been inserted into the database.` });
    })
    .catch((err) => {
      console.error(err);
      console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    });
};

const taskDemoData = async (num) => {
  const data = [];

  const getAllUserId = await User.aggregate([
    {
      $match: {},
    },
    {
      $project: {
        _id: 1,
      },
    },
  ]);

  for (let i = 0; i < num; i++) {
    const title = faker.word.words({ count: { min: 2, max: 5 } });
    const reps = faker.number.int({ min: 0, max: 10 });
    const load = faker.number.int({ min: 50, max: 1000 });
    // set random user in task
    const user = getAllUserId[Math.floor(Math.random() * getAllUserId.length)]._id;
    data.push({ title, reps, load, user });
  }

  return data;
};

const userDemoData = (num) => {
  const data = [];

  for (let i = 0; i < num; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullname = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName: firstName, lastName: lastName, provider: 'demoemail.com' });

    data.push({ fullname, email });
  }

  return data;
};

module.exports = { seedUser, seedTask };
