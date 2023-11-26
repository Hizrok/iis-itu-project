const pool = require("../../db");
const queries = require("./queries");

const check_room_id = (id) => {
  if (id.length !== 4) return false;

  const building = id.substring(0, 1);
  const floor = parseInt(id.substring(1, 2));
  const number = parseInt(id.substring(2, 4));

  if (!(building >= "A" && building <= "Z")) return false;
  if (!(floor >= 0 && floor <= 9)) return false;
  if (!(number >= 0 && number <= 99)) return false;

  return true;
};

const get_new_room_id = (old_id, building, floor, number) => {
  const old_building = old_id.substring(0, 1);
  const old_floor = parseInt(old_id.substring(1, 2));
  const old_number = parseInt(old_id.substring(2, 4));

  const new_building = building ?? old_building;
  const new_floor = floor ?? old_floor;
  const new_number = number ?? old_number;

  return `${new_building}${new_floor}${
    new_number < 10 ? "0" : ""
  }${new_number}`;
};

const get_rooms = async (req, res) => {
  try {
    const search_query = await pool.query(queries.get_all_rooms);

    const rooms = search_query.rows.map((room) => {
      const building = room.id.substring(0, 1);
      const floor = parseInt(room.id.substring(1, 2));
      const number = parseInt(room.id.substring(2, 4));
      return {
        id: room.id,
        building,
        floor,
        number,
        capacity: room.capacity,
      };
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const get_room = async (req, res) => {
  try {
    const id = req.params.id;

    if (!check_room_id(id)) return res.sendStatus(400);

    const find_query = await pool.query(queries.get_room, [id]);
    if (!find_query.rowCount) return res.sendStatus(404);

    const building = find_query.rows[0].id.substring(0, 1);
    const floor = parseInt(find_query.rows[0].id.substring(1, 2));
    const number = parseInt(find_query.rows[0].id.substring(2, 4));

    const room = {
      id: find_query.rows[0].id,
      building,
      floor,
      number,
      capacity: find_query.rows[0].capacity,
    };

    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const add_room = async (req, res) => {
  try {
    const { building, floor, number, capacity } = req.body;

    const id = `${building}${floor}${
      number >= 0 && number < 10 ? "0" : ""
    }${number}`;

    if (!check_room_id(id)) return res.sendStatus(400);

    await pool.query(queries.add_room, [id, capacity]);

    const room = {
      id,
      building,
      floor,
      number,
      capacity,
    };

    res.status(201).json(room);
  } catch (error) {
    if (error.code === "23505") return res.sendStatus(400);
    console.error(error);
    res.sendStatus(500);
  }
};

const edit_room = async (req, res) => {
  console.log(`recieved PUT request - /rooms/${req.params.id}`);
  try {
    const old_id = req.params.id;
    let { building, floor, number, capacity } = req.body;

    if (!check_room_id(old_id)) return res.sendStatus(400);

    const new_id = get_new_room_id(old_id, building, floor, number);

    if (!check_room_id(new_id)) return res.sendStatus(400);

    const values = [new_id, capacity].filter((value) => value);

    const edit_query = await pool.query(queries.get_edit_query(capacity), [
      old_id,
      ...values,
    ]);

    if (!edit_query.rowCount) return res.sendStatus(404);

    building = new_id.substring(0, 1);
    floor = parseInt(new_id.substring(1, 2));
    number = parseInt(new_id.substring(2, 4));
    const room = {
      id: new_id,
      building,
      floor,
      number,
      capacity: edit_query.rows[0].capacity,
    };

    res.status(202).json(room);
  } catch (error) {
    if (error.code === "23505") return res.sendStatus(400);
    console.error(error);
    res.sendStatus(500);
  }
};

const delete_room = async (req, res) => {
  try {
    const id = req.params.id;

    if (!check_room_id(id)) return res.sendStatus(400);

    const delete_query = await pool.query(queries.delete_room, [id]);
    if (!delete_query.rowCount) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  get_rooms,
  get_room,
  add_room,
  edit_room,
  delete_room,
};
