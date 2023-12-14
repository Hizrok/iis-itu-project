const get_all_activities = "select * from course_activities;";

const get_course_activities =
  "select * from course_activities where course=$1;";

const get_activity = "select * from course_activities where id=$1;";

const get_activity_lecturers =
  "select lecturer from course_activity_lecturers where course_activity=$1;";

const add_activity =
  "insert into course_activities (course, type, recurrence, capacity, duration) values ($1, $2, $3, $4, $5) returning id;";

const add_lecturer =
  "insert into course_activity_lecturers (course_activity, lecturer) values ($1, $2);";

const get_activity_edit_query = (type, recurrence, capacity, duration) => {
  let index = 2;
  let query = "update course_activities set ";

  const fields = [];

  type && fields.push(`type=$${index++}`);
  recurrence && fields.push(`recurrence=$${index++}`);
  capacity && fields.push(`capacity=$${index++}`);
  duration && fields.push(`duration=$${index++}`);

  query += fields.join(",");

  query += " where id=$1;";

  return query;
};

const delete_activity = "delete from course_activities where id=$1;";

const delete_lecturer =
  "delete from course_activity_lecturers where course_activity=$1 and lecturer=$2;";

module.exports = {
  get_all_activities,
  get_course_activities,
  get_activity,
  get_activity_lecturers,
  add_lecturer,
  add_activity,
  get_activity_edit_query,
  delete_activity,
  delete_lecturer,
};
