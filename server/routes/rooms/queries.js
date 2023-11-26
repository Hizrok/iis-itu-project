const get_all_rooms = "select id, capacity from rooms;";

const get_room = "select id, capacity from rooms where id = $1;";

const add_room = "insert into rooms (id, capacity) values ($1, $2);";

const get_edit_query = (capacity) => {
  return `update rooms set id=$2${
    capacity ? ",capacity=$3" : ""
  } where id=$1 returning id, capacity;`;
};

const delete_room = "delete from rooms where id = $1;";

module.exports = {
  get_all_rooms,
  add_room,
  get_room,
  get_edit_query,
  delete_room,
};
