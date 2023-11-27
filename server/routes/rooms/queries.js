const get_all_rooms = "select id, capacity from rooms;";

const get_room = "select id, capacity from rooms where id = $1;";

const get_instances_in_room =
  "select cai.id, ca.course, ca.type, ca.recurrence, cai.day, cai.start_time, ca.duration, cai.lecturer, u.name, u.surname from course_activity_instances as cai left join course_activities as ca on ca.id=cai.course_activity left join users as u on u.id=cai.lecturer where cai.room=$1;";

const add_room = "insert into rooms (id, capacity) values ($1, $2);";

const get_edit_query = (capacity) => {
  return `update rooms set id=$2${
    capacity ? ",capacity=$3" : ""
  } where id=$1 returning id, capacity;`;
};

const delete_room = "delete from rooms where id = $1;";

module.exports = {
  get_all_rooms,
  get_room,
  get_instances_in_room,
  add_room,
  get_edit_query,
  delete_room,
};
