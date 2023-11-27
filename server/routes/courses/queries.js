const get_all_courses =
  "select c.id, c.name, guarantor, u.name as guarantor_name, surname from courses as c left join users as u on u.id=guarantor;";

const get_all_courses_of_guarantor =
  "select c.id, c.name, guarantor, u.name as guarantor_name, surname from courses as c left join users as u on u.id=guarantor where guarantor=$1;";

const get_course =
  "select courses.id, courses.name, annotation, guarantor, users.name as guarantor_name, surname, email from courses left join users on users.id=guarantor where courses.id=$1;";

const get_activities =
  "select id, type, recurrence, capacity, duration from course_activities where course=$1;";

const get_activity =
  "select type, recurrence, capacity, duration from course_activities where course=$1 and id=$2;";

const get_lecturers =
  "select u.id, role, name, surname, email from course_activity_lecturers as cal left join users as u on u.id=cal.lecturer left join course_activities as ca on ca.id=course_activity where ca.course=$1 and course_activity=$2;";

const get_instances =
  "select id, room, lecturer, start_time, day from course_activity_instances where course_activity=$1;";

const get_all_instances =
  "select cai.id, ca.course, ca.type, ca.recurrence, ca.capacity, cai.day, cai.start_time, ca.duration, cai.room, cai.lecturer, u.name, u.surname from course_activity_instances as cai left join course_activities as ca on cai.course_activity=ca.id left join users as u on cai.lecturer=u.id;";

const get_all_instances_of_lecturer =
  "select cai.id, ca.course, ca.type, ca.recurrence, ca.capacity, cai.day, cai.start_time, ca.duration, cai.room, cai.lecturer, u.name, u.surname from course_activity_instances as cai left join course_activities as ca on cai.course_activity=ca.id left join users as u on cai.lecturer=u.id where lecturer=$1;";

// const get_instance =
//   "select room, lecturer, start_time, day from course_activity_instances where id=$1;";

const get_instance =
  "select cai.id, ca.type, ca.recurrence, cai.day, cai.start_time, ca.duration, cai.room, cai.lecturer, u.name, u.surname from course_activity_instances as cai left join course_activities as ca on cai.course_activity=ca.id left join users as u on cai.lecturer=u.id where ca.course=$1;";

const add_course =
  "insert into courses (id, name, annotation, guarantor) values ($1, $2, $3, $4) returning id, name, annotation, guarantor;";

const add_activity =
  "insert into course_activities (course, type, recurrence, capacity, duration) values ($1, $2, $3, $4, $5) returning id, course, type, recurrence, capacity, duration;";

const add_lecturer =
  "insert into course_activity_lecturers (course_activity, lecturer) values ($1, $2);";

const add_instance =
  "insert into course_activity_instances (course_activity, room, lecturer, start_time, day) values ($1, $2, $3, $4, $5) returning id, course_activity, room, lecturer, start_time, day;";

const get_course_edit_query = (id, name, annotation, guarantor) => {
  let index = 2;
  let query = "update courses set ";

  const fields = [];

  id && fields.push(`id=$${index++}`);
  name && fields.push(`name=$${index++}`);
  annotation && fields.push(`annotation=$${index++}`);
  guarantor && fields.push(`guarantor=$${index++}`);

  query += fields.join(",");

  query += " where id=$1 returning id, name, annotation, guarantor;";

  return query;
};

const get_activity_edit_query = (type, recurrence, capacity, duration) => {
  let index = 3;
  let query = "update course_activities set ";

  const fields = [];

  type && fields.push(`type=$${index++}`);
  recurrence && fields.push(`recurrence=$${index++}`);
  capacity && fields.push(`capacity=$${index++}`);
  duration && fields.push(`duration=$${index++}`);

  query += fields.join(",");

  query +=
    " where course=$1 and id=$2 returning id, course, type, recurrence, capacity, duration;";

  return query;
};

const get_instance_edit_query = (room, lecturer, start_time, day) => {
  let index = 2;
  let query = "update course_activity_instances set ";

  const fields = [];

  room && fields.push(`room=$${index++}`);
  lecturer && fields.push(`capacity=$${index++}`);
  start_time && fields.push(`start_time=$${index++}`);
  day && fields.push(`day=$${index++}`);

  query += fields.join(",");

  query +=
    " where id=$1 returning id, course_activity, room, lecturer, start_time, day;";

  return query;
};

const delete_course = "delete from courses where id=$1;";

const delete_activity =
  "delete from course_activities where course=$1 and id=$2;";

const delete_lecturer =
  "delete from course_activity_lecturers where course_activity=$1 and lecturer=$2;";

const delete_instance = "delete from course_activity_instances where id=$1;";

module.exports = {
  get_all_courses,
  get_all_courses_of_guarantor,
  get_all_instances,
  get_all_instances_of_lecturer,
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
  get_course_edit_query,
  get_activity_edit_query,
  get_instance_edit_query,
  delete_course,
  delete_activity,
  delete_lecturer,
  delete_instance,
};
