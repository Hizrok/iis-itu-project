const pool = require("../../db");
const queries = require("./queries");

const get_rooms = async (req, res) => {
  try {
    const rooms = await pool.query(queries.get_all_rooms);
    res.status(200).json(rooms.rows);
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const get_room_by_id = async (req, res) => {
  try {
    const id = req.params.id;
    const room = await pool.query(queries.get_room_by_id, [id]);
    if (room.rowCount) {
      res.status(200).json(room.rows);
    } else {
      res.status(404).json({ error: `room ${id} not found` });
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const add_room = async (req, res) => {
  try {
    const { building, number, capacity } = req.body;
    const id = building + number;

    const room = await pool.query(queries.add_room, [
      id,
      building,
      number,
      capacity,
    ]);
    res.status(201).json(room.rows);
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const delete_room = async (req, res) => {
  try {
    const id = req.params.id;
    const delete_query = await pool.query(queries.delete_room, [id]);
    if (delete_query.rowCount) {
      res.status(202).json({ message: `successfully deleted room ${id}` });
    } else {
      res.status(404).json({ message: `room ${id} was not found` });
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

module.exports = {
  get_rooms,
  get_room_by_id,
  add_room,
  delete_room,
};
