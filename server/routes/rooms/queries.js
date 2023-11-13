const get_all_rooms = "select * from rooms;";

const add_room =
  "insert into rooms (room_id, room_building, room_number, room_capacity) values ($1, $2, $3, $4) returning *;";

const get_room_by_id = "select * from rooms where room_id = $1;";

const delete_room = "delete from rooms where room_id = $1;";

module.exports = {
  get_all_rooms,
  add_room,
  get_room_by_id,
  delete_room,
};
