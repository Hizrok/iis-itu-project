const pool = require("../../db");
const queries = require("./queries");

const get_courses = async (req, res) => {
  try {
    const search_query = await pool.query(queries.get_all_courses);
    const courses = await Promise.all(
      search_query.rows.map(async (course) => {
        const activities_query = await pool.query(queries.get_activities, [
          course.id,
        ]);
        const activities = await Promise.all(
          activities_query.rows.map(async (activity) => {
            const lecturers_query = await pool.query(queries.get_lecturers, [
              course.id,
              activity.id,
            ]);
            const instances_query = await pool.query(queries.get_instances, [
              activity.id,
            ]);

            return {
              ...activity,
              lecturers: lecturers_query.rows,
              instaces: instances_query.rows,
            };
          })
        );

        return {
          id: course.id,
          name: course.name,
          annotation: course.annotation,
          guarantor: {
            id: course.guarantor,
            name: course.guarantor_name,
            surname: course.surname,
            email: course.email,
          },
          activities,
        };
      })
    );
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const get_course = async (req, res) => {
  try {
    const id = req.params.id;
    const course_query = await pool.query(queries.get_course, [id]);
    if (!course_query.rowCount) return res.sendStatus(404);

    const activities_query = await pool.query(queries.get_activities, [id]);

    const course = {
      id: course_query.rows[0].id,
      name: course_query.rows[0].name,
      annotation: course_query.rows[0].annotation,
      guarantor: {
        id: course_query.rows[0].guarantor,
        name: course_query.rows[0].guarantor_name,
        surname: course_query.rows[0].surname,
        email: course_query.rows[0].email,
      },
      activities: await Promise.all(
        activities_query.rows.map(async (activity) => {
          const lecturers_query = await pool.query(queries.get_lecturers, [
            id,
            activity.id,
          ]);
          return { ...activity, lecturers: lecturers_query.rows };
        })
      ),
    };

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const get_activities = async (req, res) => {
  try {
    const course = req.params.course;

    const search_query = await pool.query(queries.get_activities, [course]);

    if (!search_query.rowCount) return res.sendStatus(404);

    res.status(200).json(search_query.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const get_activity = async (req, res) => {
  try {
    const { course, id } = req.params;

    const activity_query = await pool.query(queries.get_activity, [course, id]);

    if (!activity_query.rowCount) return res.sendStatus(404);

    const lecturers_query = await pool.query(queries.get_lecturers, [
      course,
      id,
    ]);

    const instances_query = await pool.query(queries.get_instances, [id]);

    res.status(200).json({
      ...activity_query.rows[0],
      lecturers: lecturers_query.rows,
      instaces: instances_query.rows,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const get_lecturers = async (req, res) => {
  try {
    const { course, id } = req.params;
    const search_query = await pool.query(queries.get_lecturers, [course, id]);

    console.log(search_query);

    if (!search_query.rowCount) return res.sendStatus(404);

    res.status(200).json(search_query.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const get_instances = async (req, res) => {
  try {
    const activity = req.params.activity;

    const search_query = await pool.query(queries.get_instances, [activity]);
    if (!search_query.rowCount) return res.sendStatus(404);

    res.status(200).json(search_query.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const get_instance = async (req, res) => {
  try {
    const id = req.params.id;

    const find_query = await pool.query(queries.get_instance, [id]);
    if (!find_query.rowCount) return res.sendStatus(404);

    res.status(200).json(find_query.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const add_course = async (req, res) => {
  try {
    const { id, name, annotation, guarantor } = req.body;

    if (!id || !name || !guarantor) return res.sendStatus(400);

    const add_query = await pool.query(queries.add_course, [
      id,
      name,
      annotation,
      guarantor,
    ]);

    res.status(201).json(add_query.rows[0]);
  } catch (error) {
    // course already exists
    if (error.code === "23505") return res.sendStatus(400);
    // guarantor does not exist
    if (error.code === "23503") return res.sendStatus(404);
    console.error(error);
    res.sendStatus(500);
  }
};

const add_activity = async (req, res) => {
  try {
    const course = req.params.course;
    const { type, recurrence, capacity, duration } = req.body;

    const add_query = await pool.query(queries.add_activity, [
      course,
      type,
      recurrence,
      capacity,
      duration,
    ]);

    res.status(201).json(add_query.rows[0]);
  } catch (error) {
    if (error.code === "22P02") return res.sendStatus(400);
    console.log(error);
    res.sendStatus(500);
  }
};

const add_lecturer = async (req, res) => {
  try {
    const id = req.params.id;
    const lecturer = req.body.lecturer;

    const add_query = await pool.query(queries.add_lecturer, [id, lecturer]);

    if (!add_query.rowCount) return res.sendStatus(404);

    res.sendStatus(201);
  } catch (error) {
    if (error.code === "23505") return res.sendStatus(400);
    console.log(error);
    res.sendStatus(500);
  }
};

const add_instance = async (req, res) => {
  try {
    const id = req.params.id;
    const { room, lecturer, start_time, day } = req.body;

    const add_query = await pool.query(queries.add_instance, [
      id,
      room,
      lecturer,
      start_time,
      day,
    ]);

    if (!add_query.rowCount) return res.sendStatus(404);

    res.status(201).json(add_query.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const edit_course = async (req, res) => {
  try {
    const old_id = req.params.id;
    const { id, name, annotation, guarantor } = req.body;

    if (guarantor && req.params.user.role !== "admin")
      return res.sendStatus(403);

    const values = [id, name, annotation, guarantor].filter((value) => value);

    const edit_query = await pool.query(
      queries.get_course_edit_query(id, name, annotation, guarantor),
      [old_id, ...values]
    );

    if (!edit_query.rowCount) return res.sendStatus(404);

    res.status(202).json(edit_query.rows[0]);
  } catch (error) {
    // course id already exists
    if (error.code === "23505") return res.sendStatus(400);
    // guarantor does not exist
    if (error.code === "23503") return res.sendStatus(404);
    console.log(error);
    res.sendStatus(500);
  }
};

const edit_activity = async (req, res) => {
  try {
    const { course, id } = req.params;
    const { type, recurrence, capacity, duration } = req.body;

    const values = [type, recurrence, capacity, duration].filter(
      (value) => value
    );

    const edit_query = await pool.query(
      queries.get_activity_edit_query(type, recurrence, capacity, duration),
      [course, id, ...values]
    );

    if (!edit_query.rowCount) return res.sendStatus(404);

    res.status(202).json(edit_query.rows[0]);
  } catch (error) {
    if (error.code === "22P02") return res.sendStatus(400);
    console.log(error);
    res.sendStatus(500);
  }
};

const edit_instance = async (req, res) => {
  try {
    const id = req.params.id;
    const { room, lecturer, start_time, day } = req.body;

    const values = [room, lecturer, start_time, day].filter((value) => value);

    const edit_query = await pool.query(
      queries.get_instance_edit_query(room, lecturer, start_time, day),
      [id, ...values]
    );

    if (!edit_query.rowCount) return res.sendStatus(404);

    res.status(202).json(edit_query.rows[0]);
  } catch (error) {
    if (error.code === "22P02") return res.sendStatus(400);
    console.log(error);
    res.sendStatus(500);
  }
};

const delete_course = async (req, res) => {
  try {
    const id = req.params.id;

    const delete_query = await pool.query(queries.delete_course, [id]);
    if (!delete_query.rowCount) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const delete_activity = async (req, res) => {
  try {
    const { course, id } = req.params;

    const delete_query = await pool.query(queries.delete_activity, [
      course,
      id,
    ]);
    if (!delete_query.rowCount) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const delete_lecturer = async (req, res) => {
  try {
    const { id, lecturer } = req.params;

    const delete_query = await pool.query(queries.delete_lecturer, [
      id,
      lecturer,
    ]);
    if (!delete_query.rowCount) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const delete_instance = async (req, res) => {
  try {
    const id = req.params.id;

    const delete_query = await pool.query(queries.delete_instance, [id]);
    if (!delete_query.rowCount) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  get_courses,
  get_course,
  get_activities,
  get_activity,
  get_lecturers,
  get_instances,
  get_instance,
  add_course,
  add_activity,
  add_lecturer,
  add_instance,
  edit_course,
  edit_activity,
  edit_instance,
  delete_course,
  delete_activity,
  delete_lecturer,
  delete_instance,
};
