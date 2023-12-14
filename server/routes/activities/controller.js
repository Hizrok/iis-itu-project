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

  let lects_failed = false;
  const activities = await Promise.all(
    search_query.rows.map(async (a) => {
      const [lect_query, lect_err] = await query_database(
        res,
        queries.get_activity_lecturers,
        [a.id]
      );
      if (lect_err) {
        lects_failed = true;
        return;
      }

      return { ...a, lecturers: lect_query.rows.map((l) => l.lecturer) };
    })
  );

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

  if (!search_query.rowCount)
    return res.status(404).json({ error: `course ${course} was not found` });

  res.status(201).json({ id: search_query.rows[0].id });
};

const add_lecturer = async (req, res) => {
  const id = req.params.id;
  const lecturer = req.body.lecturer;

  const [search_query, err] = await query_database(res, queries.add_lecturer, [
    id,
    lecturer,
  ]);
  if (err) return;

  if (!search_query.rowCount)
    return res
      .status(404)
      .json({ error: `lecturer ${lecturer} or activity ${id} was not found` });

  res
    .status(201)
    .json({ msg: `lecturer ${lecturer} was added to activity ${id}` });
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

  res.status(202).json({ msg: `activity ${id} was deleted` });
};

const delete_lecturer = async (req, res) => {
  const { id, lecturer } = req.params;

  const [query, err] = await query_database(res, queries.delete_lecturer, [
    id,
    lecturer,
  ]);
  if (err) return;

  if (!query.rowCount)
    return res
      .status(404)
      .json({ error: `lecturer ${lecturer} or activity ${id} was not found` });

  res
    .status(202)
    .json({ msg: `lecturer ${lecturer} was removed from activity ${id}` });
};

module.exports = {
  get_activities,
  get_activity,
  add_activity,
  add_lecturer,
  edit_activity,
  delete_activity,
  delete_lecturer,
};
