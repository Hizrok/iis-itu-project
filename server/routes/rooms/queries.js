const get_all_rooms =
  "select room_id as id, room_capacity as capacity from rooms;";

const add_room = "insert into rooms (room_id, room_capacity) values ($1, $2);";

const get_room_by_id =
  "select room_id as id, room_capacity as capacity from rooms where room_id = $1;";

const get_edit_query = (capacity) => {
  return `update rooms set room_id=$2${
    capacity ? ",room_capacity=$3" : ""
  } where room_id=$1 returning room_id as id, room_capacity as capacity;`;
};

const delete_room = "delete from rooms where room_id = $1;";

module.exports = {
  get_all_rooms,
  add_room,
  get_room_by_id,
  get_edit_query,
  delete_room,
};
