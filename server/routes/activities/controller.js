const pool = require("../../db");
const queries = require("./queries");
const { query_database } = require("../../middleware");

const get_activities = async (req, res) => {
  const course = req.query.course;

  const query = course
    ? queries.get_course_activities
    : queries.get_all_activities;
  const values = course ? [course] : [];

  const [search_query, err] = await query_database(res, query, values);
  if (err) return;

  const activities = search_query.rows.map((a) => ({
    ...a,
    instances: [],
  }));

  res.status(200).json(activities);
};

const get_activity = async (req, res) => {
  const id = req.params.id;

  const [search_query, err] = await query_database(res, queries.get_activity, [
    id,
  ]);
  if (err) return;

  if (!search_query.rowCount)
    return res.status(404).json({ error: `activity ${id} was not found` });

  const activity = {
    ...search_query.rows[0],
    instances: [],
  };

  res.status(200).json(activity);
};

const add_activity = async (req, res) => {
  const { course, type, recurrence, capacity, duration } = req.body;

  const [search_query, err] = await query_database(res, queries.add_activity, [
    course,
    type,
    recurrence,
    capacity,
    duration,
  ]);
  if (err) return;

  res.status(200).json({ id: search_query.rows[0].id });
};

const edit_activity = async (req, res) => {
  const id = req.params.id;
  const { type, recurrence, capacity, duration } = req.body;

  const values = [type, recurrence, capacity, duration].filter(
    (value) => value
  );

  const [edit_query, err] = await query_database(
    res,
    queries.get_activity_edit_query(type, recurrence, capacity, duration),
    [id, ...values]
  );
  if (err) return;

  if (!edit_query.rowCount)
    return res.status(404).json({ error: `activity ${id} was not found` });

  res.status(202).json({ msg: `activity ${id} was edited` });
};

const delete_activity = async (req, res) => {
  const id = req.params.id;

  const [query, err] = await query_database(res, queries.delete_activity, [id]);
  if (err) return;

  if (!query.rowCount)
    return res.status(404).json({ error: `activity ${id} was not found` });

  res.status(200).json({ msg: `activity ${id} was deleted` });
};

module.exports = {
  get_activities,
  get_activity,
  add_activity,
  edit_activity,
  delete_activity,
};
