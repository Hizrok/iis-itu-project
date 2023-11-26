const pool = require("../../db");
const queries = require("./queries");

const get_registrations = async (req, res) => {
  try {
    const search_query = await pool.query(queries.get_registrations);
    res.status(200).json(search_query.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const add_registration = async (req, res) => {
  try {
    await pool.query(queries.add_registration);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const delete_registration = async (req, res) => {
  try {
    const id = req.params.id;

    const delete_query = await pool.query(queries.delete_registration, [id]);

    if (!delete_query.rowCount) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const set_status = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    if (status === "ACTIVE") {
      // find currently active registration and set it to not active
      const find_query = await pool.query(queries.check_status);

      if (find_query.rowCount) {
        const found = find_query.rows[0].id;
        const unset_query = await pool.query(queries.set_status, [
          "NOT ACTIVE",
          found,
        ]);
      }
    }

    // set registration
    const set_query = await pool.query(queries.set_status, [status, id]);

    if (!set_query.rowCount) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const start = async (req, res) => {
  try {
    const { id, state } = req.params;
    const type = req.body.type;

    if (type === "COURSE") {
      if (state === "IDLE") {
        await pool.query(queries.set_state, ["COURSES IN PROGRESS", id]);
        return res.sendStatus(202);
      }
    } else if (type === "ACTIVITY") {
      if (state === "SCHEDULING") {
        await pool.query(queries.set_state, ["ACTIVITIES IN PROGRESS", id]);
        return res.sendStatus(202);
      }
    }

    return res.sendStatus(400);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const stop = async (req, res) => {
  try {
    const { id, state } = req.params;
    const type = req.body.type;

    if (type === "COURSE") {
      if (state === "COURSES IN PROGRESS") {
        await pool.query(queries.set_state, ["SCHEDULING", id]);
        return res.sendStatus(202);
      }
    } else if (type === "ACTIVITY") {
      if (state === "ACTIVITIES IN PROGRESS") {
        await pool.query(queries.set_state, ["EVALUATING", id]);
        res.sendStatus(202);
        evaluate_activities(id);
        return;
      }
    }

    return res.sendStatus(400);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const reset = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query(queries.set_state, ["IDLE", id]);
    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
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
    const { id, student } = req.params;

    const search_query = await pool.query(queries.get_registered_courses, [
      id,
      student,
    ]);

    if (!search_query.rowCount) return res.sendStatus(404);

    const courses = await Promise.all(
      search_query.rows.map(async (course) => {
        const instances_query = await pool.query(
          queries.get_instances_of_course,
          [course.id]
        );
        return {
          ...course,
          instances: instances_query.rows,
        };
      })
    );

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const get_activities = async (req, res) => {
  try {
    const { id, student, state } = req.params;

    const query =
      state === "FINISHED"
        ? queries.get_registered_instances
        : queries.get_selected_instances;

    const search_query = await pool.query(query, [id, student]);

    if (!search_query.rowCount) return res.sendStatus(404);

    res.status(200).json(search_query.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const register_course = async (req, res) => {
  try {
    const { id, state } = req.params;
    const { course, student } = req.body;

    if (state !== "COURSES IN PROGRESS") return res.sendStatus(400);

    const add_query = await pool.query(queries.register_course, [
      id,
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

const register_activity = async (req, res) => {
  try {
    const { id, state } = req.params;
    const { activity, student, order } = req.body;

    if (state !== "ACTIVITIES IN PROGRESS") return res.sendStatus(400);

    const add_query = await pool.query(queries.register_activity, [
      id,
      activity,
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
    const { id, type, object_id, student, state } = req.params;

    const proper_state =
      type === "courses" ? "COURSES IN PROGRESS" : "ACTIVITIES IN PROGRESS";

    if (state !== proper_state) return res.sendStatus(400);

    const query =
      type === "courses"
        ? queries.unregister_course
        : queries.unregister_activity;

    const delete_query = await pool.query(query, [id, object_id, student]);

    if (!delete_query.rowCount) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  get_registrations,
  add_registration,
  delete_registration,
  set_status,
  start,
  stop,
  reset,
  register_course,
  get_registered_courses,
  unregister,
  register_activity,
  get_activities,
};
