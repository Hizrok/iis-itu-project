const pool = require("../../db");
const { query_database } = require("../../middleware");
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
  const [search_query, err] = await query_database(
    res,
    queries.get_all_rooms,
    []
  );
  if (err) return;

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
};

const get_room = async (req, res) => {
  const id = req.params.id;

  const [find_query, find_err] = await query_database(res, queries.get_room, [
    id,
  ]);
  if (find_err) return;

  if (!find_query.rowCount)
    return res.status(404).json({ error: `room ${id} was not found` });

  const building = find_query.rows[0].id.substring(0, 1);
  const floor = parseInt(find_query.rows[0].id.substring(1, 2));
  const number = parseInt(find_query.rows[0].id.substring(2, 4));

  const room = {
    id: find_query.rows[0].id,
    building,
    floor,
    number,
    capacity: find_query.rows[0].capacity,
    instances: [],
  };

  res.status(200).json(room);
};

const add_room = async (req, res) => {
  const { building, floor, number, capacity } = req.body;

  const id = `${building}${floor}${
    number >= 0 && number < 10 ? "0" : ""
  }${number}`;

  if (!check_room_id(id))
    return res.status(400).json({ error: "invalid request parameters" });

  const [_, err] = await query_database(res, queries.add_room, [id, capacity]);
  if (err) return;

  const room = {
    id,
  };

  res.status(201).json(room);
};

const edit_room = async (req, res) => {
  const old_id = req.params.id;
  let { building, floor, number, capacity } = req.body;

  const new_id = get_new_room_id(old_id, building, floor, number);

  if (!check_room_id(new_id))
    return res.status(400).json({ error: "invalid request parameters" });

  const values = [new_id, capacity].filter((value) => value);

  const [edit_query, err] = await query_database(
    res,
    queries.get_edit_query(capacity),
    [old_id, ...values]
  );
  if (err) return;

  if (!edit_query.rowCount)
    return res.status(404).json({ error: `room ${old_id} was not found` });

  res.status(202).json({ id: new_id });
};

const delete_room = async (req, res) => {
  const id = req.params.id;

  const [delete_query, err] = await query_database(res, queries.delete_room, [
    id,
  ]);
  if (err) return;

  if (!delete_query.rowCount)
    return res.status(404).json({ error: `room ${id} was not found` });

  res.status(202).json({ msg: `room ${id} was deleted` });
};

module.exports = {
  get_rooms,
  get_room,
  add_room,
  edit_room,
  delete_room,
};
