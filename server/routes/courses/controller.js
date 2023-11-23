const pool = require("../../db");
const queries = require("./queries");

const get_courses = async (req, res) => {
  console.log("recieved GET request - /courses");
  try {
    const search_query = await pool.query(queries.get_all_courses);
    const courses = search_query.rows.map((course) => {
      return {
        id: course.course_id,
        name: course.course_name,
        annotation: course.course_annotation,
        guarantor: {
          login: course.course_guarantor_login,
          name: course.user_name,
          surname: course.user_surname,
          email: course.user_email,
        },
      };
    });
    console.log("sending response 200");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const get_course_by_id = async (req, res) => {
  console.log("recieved GET request - /courses/:id");
  try {
    const id = req.params.id;
    const find_query = await pool.query(queries.get_course_by_id, [id]);
    if (find_query.rowCount) {
      const course = {
        id: find_query.rows[0].course_id,
        name: find_query.rows[0].course_name,
        annotation: find_query.rows[0].course_annotation,
        guarantor: {
          login: find_query.rows[0].course_guarantor_login,
          name: find_query.rows[0].user_name,
          surname: find_query.rows[0].user_surname,
          email: find_query.rows[0].user_email,
        },
      };

      console.log("sending response 200");
      res.status(200).json(course);
    } else {
      console.log("sending response 404");
      res.status(404).json({ message: `course ${id} was not found` });
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const add_course = async (req, res) => {
  console.log("recieved POST request - /courses");
  try {
    if (req.user.role !== "admin" && req.user.role !== "garant") {
      console.log("sending response 403");
      return res
        .send(403)
        .json({ error: "you don't have permission to add a new course" });
    }

    const { id, name, annotation, guarantor } = req.body;

    if (!id || !name) {
      console.log("sending response 400");
      return res.status(400).json({ error: "missing attributes in body" });
    }

    const add_query = await pool.query(queries.add_course, [
      id,
      name,
      annotation,
      guarantor ?? req.user.login,
    ]);
    res.status(201).json({
      msg: `successfully created course ${id}`,
      course: add_query.rows[0],
    });
  } catch (error) {
    if (error.code) {
      if (error.code === "23505") {
        console.log("sending response 400");
        return res.status(400).json({ error: "course id already exists" });
      } else if (error.code === "23503") {
        console.log("sending response 400");
        return res.status(400).json({ error: "guarantor does not exist" });
      }
    }
    res.status(500).json(error);
    console.error(error);
  }
};

const edit_course = async (req, res) => {
  console.log(`recieved PUT request - /courses/${req.params.id}`);
  try {
    if (req.user.role !== "admin" && req.user.role !== "garant") {
      console.log("sending response 403");
      return res
        .send(403)
        .json({ error: "you don't have permission to edit this course" });
    }

    const old_id = req.params.id;
    const { id, name, annotation, guarantor } = req.body;

    const values = [id, name, annotation, guarantor].filter((value) => value);

    const edit_query = await pool.query(
      queries.get_edit_query(id, name, annotation, guarantor),
      [old_id, ...values]
    );

    if (edit_query.rowCount) {
      console.log("sending response 202");
      res.status(202).json({
        msg: "successfully edited course",
        course: edit_query.rows[0],
      });
    } else {
      console.log("sending response 404");
      res.status(404).json({ error: `course ${old_id} was not found` });
    }
  } catch (error) {
    if (error.code) {
      if (error.code === "23505") {
        console.log("sending response 400");
        return res.status(400).json({ error: "course id already exists" });
      } else if (error.code === "23503") {
        console.log("sending response 400");
        return res.status(400).json({ error: "guarantor does not exist" });
      }
    }
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

const delete_course = async (req, res) => {
  console.log(`recieved DELETE request - /courses/${req.params.id}`);
  try {
    if (req.user.role !== "admin" && req.user.role !== "garant") {
      console.log("sending response 403");
      return res
        .send(403)
        .json({ error: "you don't have permission to delete this course" });
    }

    const id = req.params.id;

    const delete_query = await pool.query(queries.delete_course, [id]);
    if (delete_query.rowCount) {
      console.log("sending response 202");
      res.status(202).json({ msg: "successfully deleted course" });
    } else {
      console.log("sending response 404");
      res.status(404).json({ error: `course ${id} does not exist` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = {
  get_courses,
  get_course_by_id,
  add_course,
  edit_course,
  delete_course,
};
