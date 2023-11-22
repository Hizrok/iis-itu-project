const pool = require("../../db");
const queries = require("./queries");

const get_courses = async (req, res) => {
  try {
    const courses = await pool.query(queries.get_all_courses);
    res.status(200).json(courses.rows);
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const get_course_by_id = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const course = await pool.query(queries.get_course_by_id, [course_id]);
    if (course.rowCount) {
      res.status(200).json(course.rows);
    } else {
      res.status(404).json({ message: `course ${course_id} was not found` });
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const add_course = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "garant")
      return res.sendStatus(403);

    const { course_id, course_name, course_annotation } = req.body;

    const course = await pool.query(queries.add_course, [
      course_id,
      course_name,
      course_annotation,
      req.user.login,
    ]);
    res.status(201).json(course.rows);
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

module.exports = {
  get_courses,
  get_course_by_id,
  add_course,
};
