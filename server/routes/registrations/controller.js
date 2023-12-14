const pool = require("../../db");
const { query_database } = require("../../middleware");
const queries = require("./queries");

const get_registrations = async (req, res) => {
  const [search_query, err] = await query_database(
    res,
    queries.get_registrations,
    []
  );
  if (err) return;

  res.status(200).json(search_query.rows);
};

const add_registration = async (req, res) => {
  const [add_query, err] = await query_database(
    res,
    queries.add_registration,
    []
  );
  if (err) return;

  res.status(201).json(add_query.rows[0]);
};

const delete_registration = async (req, res) => {
  const id = req.params.id;

  const [delete_query, err] = await query_database(
    res,
    queries.delete_registration,
    [id]
  );
  if (err) return;

  if (!delete_query.rowCount)
    return res.status(404).json({ error: `registration ${id} was not found` });

  res.status(202).json({ msg: `registration ${id} was deleted` });
};

const get_active_registration = async (req, res) => {
  res.status(200).json(req.params.reg_id);
};

const set_status = async (req, res) => {
  const id = req.params.id;
  const old_id = req.params.reg_id;

  const [set_query, err] = await query_database(res, queries.set_status, [
    true,
    id,
  ]);
  if (err) return;

  if (!set_query.rowCount)
    return res.status(404).json({ error: `registration ${id} was not found` });

  if (old_id) {
    const [_, unset_err] = await query_database(res, queries.set_status, [
      false,
      old_id,
    ]);
    if (unset_err) return;
  }

  res.status(202).json({ msg: `registration ${id} was set to active` });
};

const next_phase = async (req, res) => {
  const id = req.params.id;

  // find registration by id
  const [find_query, find_err] = await query_database(
    res,
    queries.get_registration,
    [id]
  );
  if (find_err) return;

  if (!find_query.rowCount)
    return res.status(404).json({ error: `registration ${id} was not found` });

  const reg = find_query.rows[0];

  switch (reg.state) {
    case 0: // IDLE
      break;
    case 1: // COURSES REGISTRATION IN PROGRESS
      break;
    case 2: // EVALUATING COURSES REGISTRATION
      break;
    case 3: // SCHEDULING
      break;
    case 4: // INSTANCE REGISTRATION IN PROGRESS
      break;
    case 5: // EVALUATING INSTANCE REGISTRATION
      break;
    default: // FINISHED
      return res
        .status(400)
        .json({ error: "registration finished, no next phase" });
  }

  const [_, set_err] = await query_database(res, queries.set_state, [
    reg.state + 1,
    id,
  ]);
  if (set_err) return;

  res.status(202).json({ msg: `registration ${id} was put into next phase` });
};

const reset = async (req, res) => {
  const id = req.params.id;

  const [_, err] = await query_database(res, queries.set_state, [0, id]);
  if (err) return;

  res.status(202).json({ msg: `registration ${id} was reset` });
};

const evaluate_activities = async (id) => {
  try {
    await pool.query(
      "update course_activity_instance_registrations set registered=true where registration=$1 and order_number=1;",
      [id]
    );
    await pool.query(queries.set_state, ["FINISHED", id]);
  } catch (error) {
    console.log(error);
  }
};

const get_registered_courses = async (req, res) => {
  try {
    const { reg_id, user_id } = req.params;

    const search_query = await pool.query(queries.get_registered_courses, [
      reg_id,
      user_id,
    ]);

    if (!search_query.rowCount) return res.sendStatus(404);

    res.status(200).json(search_query.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const get_courses_with_reg_data = async (req, res) => {
  try {
    const { reg_id, user_id } = req.params;

    const search_query = await pool.query(queries.get_courses_with_reg_data, [
      reg_id,
      user_id,
    ]);

    if (!search_query.rowCount) return res.sendStatus(404);

    res.status(200).json(search_query.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const get_registered_instances = async (req, res) => {
  try {
    const { reg_id, user_id } = req.params;

    const search_query = await pool.query(queries.get_registered_instances, [
      reg_id,
      user_id,
    ]);

    if (!search_query.rowCount) return res.sendStatus(404);

    res.status(200).json(
      search_query.rows.map((instance) => {
        return {
          id: instance.id,
          course: instance.course,
          type: instance.type,
          recurrence: instance.recurrence,
          day: instance.day,
          start_time: instance.start_time,
          duration: instance.duration,
          room: instance.room,
          lecturer:
            instance.name && instance.surname
              ? `${instance.name} ${instance.surname}`
              : instance.lecturer,
        };
      })
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const get_instances_with_reg_data = async (req, res) => {
  try {
    const { reg_id, user_id } = req.params;

    // get all registered courses
    const registered_courses_query = await pool.query(
      queries.get_registered_courses,
      [reg_id, user_id]
    );

    // get their instances
    let all_instances = [];

    for (let index = 0; index < registered_courses_query.rows.length; index++) {
      const instances_of_course_query = await pool.query(
        queries.get_instances_of_course,
        [registered_courses_query.rows[index].id]
      );
      all_instances = [...all_instances, ...instances_of_course_query.rows];
    }

    // get instances with an order value
    const selected_instances_query = await pool.query(
      queries.get_instances_with_reg_data,
      [reg_id, user_id]
    );

    const selected_instances = selected_instances_query.rows.map((i) => ({
      id: i.id,
      order: i.order,
    }));

    // merge data together

    const instances = all_instances.map((i) => {
      const s_i = selected_instances.find((ins) => ins.id === i.id);

      const order = s_i ? s_i.order : 0;

      return {
        id: i.id,
        type: i.type,
        recurrence: i.recurrence,
        capacity: i.capacity,
        duration: i.duration,
        room: i.room,
        lecturer: i.lecturer,
        start_time: i.start_time,
        day: i.day,
        order,
      };
    });

    res.status(200).json(instances);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const get_activities = async (req, res) => {
  try {
    const { reg_id, student, state } = req.params;

    const query =
      state === "FINISHED"
        ? queries.get_registered_instances
        : queries.get_selected_instances;

    const search_query = await pool.query(query, [reg_id, student]);

    if (!search_query.rowCount) return res.sendStatus(404);

    res.status(200).json(search_query.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const register_course = async (req, res) => {
  try {
    const { reg_id, state } = req.params;
    const { course, student } = req.body;

    if (state !== "COURSES IN PROGRESS") return res.sendStatus(400);

    const add_query = await pool.query(queries.register_course, [
      reg_id,
      course,
      student,
    ]);
    if (!add_query.rowCount) return res.sendStatus(404);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const register_instance = async (req, res) => {
  try {
    const { reg_id, state } = req.params;
    const { instance, student, order } = req.body;

    console.log(instance, student, order);

    if (state !== "ACTIVITIES IN PROGRESS") return res.sendStatus(400);

    const add_query = await pool.query(queries.register_instance, [
      reg_id,
      instance,
      student,
      order,
    ]);
    if (!add_query.rowCount) return res.sendStatus(404);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const unregister = async (req, res) => {
  try {
    const { reg_id, type, object_id, student, state } = req.params;

    const proper_state =
      type === "courses" ? "COURSES IN PROGRESS" : "ACTIVITIES IN PROGRESS";

    if (state !== proper_state) return res.sendStatus(400);

    const query =
      type === "courses"
        ? queries.unregister_course
        : queries.unregister_activity;

    const delete_query = await pool.query(query, [reg_id, object_id, student]);

    if (!delete_query.rowCount) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  get_registrations,
  get_active_registration,
  get_registered_courses,
  get_courses_with_reg_data,
  get_registered_instances,
  get_instances_with_reg_data,
  add_registration,
  delete_registration,
  set_status,
  next_phase,
  reset,
  register_course,
  unregister,
  register_instance,
  get_activities,
};
