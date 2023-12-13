const pool = require("../../db");
const queries = require("./queries");
const { query_database } = require("../../middleware");

const get_instances = async (req, res) => {
  const { course, activity } = req.query;

  const [search_query, err] = await query_database(
    res,
    queries.get_all_instance_query(course, activity),
    [course, activity].filter((value) => value)
  );
  if (err) return;

  const instances = search_query.rows.map((i) => ({
    id: i.id,
    course: i.course,
    type: i.type,
    room: i.room,
    lecturer: i.lecturer,
    recurrence: i.recurrence,
    day: i.day,
    start_time: i.start_time,
    duration: i.duration,
    capacity: i.capacity,
  }));

  res.status(200).json(instances);
};

const add_instance = async (req, res) => {
  const { activity, room, lecturer, start_time, day } = req.body;

  const [search_query, err] = await query_database(res, queries.add_instance, [
    activity,
    room,
    lecturer,
    start_time,
    day,
  ]);
  if (err) return;

  res.status(200).json({ id: search_query.rows[0].id });
};

const edit_instance = async (req, res) => {
  const id = req.params.id;
  const { room, lecturer, start_time, day } = req.body;

  const values = [room, lecturer, start_time, day].filter((value) => value);

  const [edit_query, err] = await query_database(
    res,
    queries.get_instance_edit_query(room, lecturer, start_time, day),
    [id, ...values]
  );
  if (err) return;

  if (!edit_query.rowCount)
    return res.status(404).json({ error: `instance ${id} was not found` });

  res.status(202).json({ msg: `instance ${id} was edited` });
};

const delete_instance = async (req, res) => {
  const id = req.params.id;

  const [query, err] = await query_database(res, queries.delete_instance, [id]);
  if (err) return;

  if (!query.rowCount)
    return res.status(404).json({ error: `instance ${id} was not found` });

  res.status(200).json({ msg: `instance ${id} was deleted` });
};

module.exports = {
  get_instances,
  add_instance,
  edit_instance,
  delete_instance,
};
