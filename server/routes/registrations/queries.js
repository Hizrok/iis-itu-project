const get_registrations = "select id, state, status from registrations;";

const get_registration =
  "select id, state, status from registrations where id=$1;";

const get_active_registration =
  "select id, state, status from registrations where status='ACTIVE';";

const add_registration = "insert into registrations default values;";

const delete_registration = "delete from registrations where id=$1;";

const check_status = "select id from registrations where status='ACTIVE';";

const set_status = "update registrations set status=$1 where id=$2;";

const set_state = "update registrations set state=$1 where id=$2;";

const get_registered_courses =
  "select c.id, c.name from course_registrations as cr join courses as c on c.id=cr.course where cr.registration=$1 and cr.student=$2;";

const get_instances_of_course =
  "select cai.id, ca.type, ca.recurrence, ca.capacity, ca.duration, cai.room, cai.lecturer, cai.start_time, cai.day from course_activity_instances as cai left join course_activities as ca on ca.id=cai.course_activity left join courses as c on c.id=ca.course where c.id=$1;";

const get_selected_instances =
  "select ca.course, ca.type, ca.recurrence, ca.duration, ca.recurrence, cai.room, cai.lecturer, cai.start_time, cai.day, cair.order_number as order from course_activity_instance_registrations as cair left join course_activity_instances as cai on cai.id=cair.course_activity_instance left join course_activities as ca on ca.id=cai.course_activity where cair.registration=$1 and cair.student=$2;";

const get_registered_instances =
  "select ca.course, ca.type, ca.recurrence, ca.duration, ca.recurrence, cai.room, cai.lecturer, cai.start_time, cai.day from course_activity_instance_registrations as cair left join course_activity_instances as cai on cai.id=cair.course_activity_instance left join course_activities as ca on ca.id=cai.course_activity where cair.registration=$1 and cair.student=$2 and registered=true;";

const register_course =
  "insert into course_registrations (registration, course, student) values ($1, $2, $3);";

const unregister_course =
  "delete from course_registrations where registration=$1 and course=$2 and student=$3;";

const register_activity =
  "insert into course_activity_instance_registrations (registration, course_activity_instance, student, order_number) values ($1, $2, $3, $4);";

const unregister_activity =
  "delete from course_activity_instance_registrations where registration=$1 and course_activity_instance=$2 and student=$3;";

module.exports = {
  get_registrations,
  get_registration,
  get_active_registration,
  add_registration,
  delete_registration,
  check_status,
  set_status,
  set_state,
  get_registered_courses,
  get_instances_of_course,
  register_course,
  register_activity,
  unregister_course,
  unregister_activity,
  get_selected_instances,
  get_registered_instances,
};
