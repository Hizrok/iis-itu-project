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
  res.status(200).json(req.params.active);
};

const set_status = async (req, res) => {
  const id = req.params.id;
  const old_id = req.params.active.id;

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

const get_courses_with_reg_data = async (req, res) => {
  const { active, user_id } = req.params;
  const reg_id = active.id;

  const [course_query, course_err] = await query_database(
    res,
    queries.get_courses_for_reg_data,
    []
  );
  if (course_err) return;

  const [reg_query, reg_err] = await query_database(
    res,
    queries.get_registered_courses,
    [reg_id, user_id]
  );
  if (reg_err) return;

  const registered_courses = reg_query.rows.map((i) => i.course);

  const courses = course_query.rows.map((course) => ({
    ...course,
    registered: registered_courses.includes(course.id),
  }));

  res.status(200).json(courses);
};

const register_course = async (req, res) => {
  const reg_id = req.params.active.id;
  const { course, student } = req.body;

  const [_, err] = await query_database(res, queries.register_course, [
    reg_id,
    course,
    student,
  ]);
  if (err) return;

  res.status(201).json({ msg: `${student} registered ${course}` });
};

const unregister_course = async (req, res) => {
  const reg_id = req.params.active.id;
  const { course, user_id } = req.params;

  const [_, err] = await query_database(res, queries.unregister_course, [
    reg_id,
    course,
    user_id,
  ]);
  if (err) return;

  res.status(202).json({ msg: `${user_id} unregistered ${course}` });
};

const get_instances_with_reg_data = async (req, res) => {
  const reg_id = req.params.active.id;
  const student = req.params.user_id;

  // get all instances
  const [all_i, all_i_err] = await query_database(
    res,
    queries.get_instances,
    []
  );
  if (all_i_err) return;

  // get all registered courses
  const [reg_c, reg_c_err] = await query_database(
    res,
    queries.get_registered_courses,
    [reg_id, student]
  );
  if (reg_c_err) return;
  const registered_courses = reg_c.rows.map((r) => r.course);

  const available_instances = all_i.rows.filter((i) =>
    registered_courses.includes(i.course)
  );

  // get orders
  const [reg_i, reg_i_err] = await query_database(
    res,
    queries.get_instances_with_reg_data,
    [reg_id, student]
  );
  if (reg_i_err) return;

  const instances = available_instances.map((i) => {
    const index = reg_i.rows.findIndex(
      (o) => o.course_activity_instance === i.id
    );
    return {
      ...i,
      order: index !== -1 ? reg_i.rows[index].order : -1,
      registered: index !== -1 ? reg_i.rows[index].registered : false,
    };
  });

  res.status(200).json(instances);
};

const register_instance = async (req, res) => {
  const reg_id = req.params.active.id;
  const { instance, student, order } = req.body;

  const [_, err] = await query_database(res, queries.register_instance, [
    reg_id,
    instance,
    student,
    order,
  ]);
  if (err) return;

  res.status(201).json({
    msg: `${student} selected instance number ${instance} (order: ${order})`,
  });
};

const update_instance_registration = async (req, res) => {
  const reg_id = req.params.active.id;
  const student = req.params.user_id;
  const { instance, order } = req.body;

  const [_, err] = await query_database(
    res,
    queries.update_instance_registration,
    [order, reg_id, instance, student]
  );
  if (err) return;

  res.status(202).json({
    msg: `${student} updated instance number ${instance} (order: ${order})`,
  });
};

const unregister_instance = async (req, res) => {
  const reg_id = req.params.active.id;
  const { instance, user_id } = req.params;

  const [_, err] = await query_database(res, queries.unregister_instance, [
    reg_id,
    instance,
    user_id,
  ]);
  if (err) return;

  res
    .status(202)
    .json({ msg: `${user_id} unregistered instance number ${instance}` });
};

module.exports = {
  get_registrations,
  get_active_registration,
  add_registration,
  set_status,
  next_phase,
  reset,
  delete_registration,
  get_courses_with_reg_data,
  register_course,
  unregister_course,
  get_instances_with_reg_data,
  register_instance,
  update_instance_registration,
  unregister_instance,
};
