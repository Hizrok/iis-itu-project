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

    if (type === "COURSES") {
      if (state === "IDLE") {
        await pool.query(queries.set_state, ["COURSES IN PROGRESS", id]);
        return res.sendStatus(202);
      }
    } else if (type === "INSTANCES") {
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

    if (type === "COURSES") {
      if (state === "COURSES IN PROGRESS") {
        await pool.query(queries.set_state, ["SCHEDULING", id]);
        return res.sendStatus(202);
      }
    } else if (type === "INSTANCES") {
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

const get_active_registration = async (req, res) => {
  try {
    res.status(200).json(req.params.state);
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
  start,
  stop,
  reset,
  register_course,
  unregister,
  register_instance,
  get_activities,
};
