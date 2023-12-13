const get_all_instance_query = (course, activity) => {
  let index = 1;
  let query =
    "select cai.id, course, type, room, lecturer, recurrence, day, start_time, duration, capacity from course_activity_instances as cai join course_activities as ca on cai.course_activity=ca.id";

  if (course || activity) {
    query += " where ";
  }

  if (course) {
    query += `ca.course=$${index++}`;
  }

  if (course && activity) {
    query += " and ";
  }

  if (activity) {
    query += `cai.course_activity=$${index++}`;
  }

  query += ";";
  return query;
};

const add_instance =
  "insert into course_activity_instances (course_activity, room, lecturer, start_time, day) values ($1, $2, $3, $4, $5) returning id;";

const get_instance_edit_query = (room, lecturer, start_time, day) => {
  let index = 2;
  let query = "update course_activity_instances set ";

  const fields = [];

  room && fields.push(`room=$${index++}`);
  lecturer && fields.push(`lecturer=$${index++}`);
  start_time && fields.push(`start_time=$${index++}`);
  day && fields.push(`day=$${index++}`);

  query += fields.join(",");

  query += " where id=$1;";

  return query;
};
const delete_instance = "delete from course_activity_instances where id=$1;";

module.exports = {
  get_all_instance_query,
  add_instance,
  get_instance_edit_query,
  delete_instance,
};
