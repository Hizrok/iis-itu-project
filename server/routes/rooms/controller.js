const pool = require("../../db");
const queries = require("./queries");

const check_room_id = (id) => {
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
  console.log("recieved GET request - /rooms");
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

    console.log("sending response 200");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const get_room_by_id = async (req, res) => {
  console.log(`recieved GET request - /rooms/${req.params.id}`);
  try {
    const id = req.params.id;

    if (!check_room_id(id)) {
      console.log("sending response 400");
      return res.status(400).json({ error: "invalid room id" });
    }

    const find_query = await pool.query(queries.get_room_by_id, [id]);
    if (find_query.rowCount) {
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

      console.log("sending response 200");
      res.status(200).json(room);
    } else {
      console.log("sending response 404");
      res.status(404).json({ error: `room ${id} not found` });
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const add_room = async (req, res) => {
  console.log("recieved POST request - /rooms");
  try {
    if (req.user.role !== "admin") {
      console.log("sending response 403");
      return res
        .status(403)
        .json({ error: "you don't have permission to create a new room" });
    }

    const { building, floor, number, capacity } = req.body;

    const id = `${building}${floor}${number < 10 ? "0" : ""}${number}`;

    if (!check_room_id(id)) {
      console.log("sending response 400");
      return res.status(400).json({ error: "invalid room attributes" });
    }

    await pool.query(queries.add_room, [id, capacity]);

    const room = {
      id,
      building,
      floor,
      number,
      capacity,
    };

    console.log("sending response 201");
    res.status(201).json({ msg: "successfully added a new room", room });
  } catch (error) {
    if (error.code) {
      if (error.code === "23505") {
        console.log("sending response 400");
        return res.status(400).json({ error: "room already exists" });
      }
    }
    res.status(500).json(error);
    console.error(error);
  }
};

const edit_room = async (req, res) => {
  console.log(`recieved PUT request - /rooms/${req.params.id}`);
  try {
    if (req.user.role !== "admin") {
      console.log("sending response 403");
      return res
        .send(403)
        .json({ error: "you don't have permission to delete this room" });
    }

    const old_id = req.params.id;
    let { building, floor, number, capacity } = req.body;

    if (!check_room_id(old_id)) {
      console.log("sending response 400");
      return res.status(400).json({ error: "invalid room id" });
    }

    const new_id = get_new_room_id(old_id, building, floor, number);

    if (!check_room_id(new_id)) {
      console.log("sending response 400");
      return res.status(400).json({ error: "invalid room attributes" });
    }

    const values = [new_id, capacity].filter((value) => value);

    const edit_query = await pool.query(queries.get_edit_query(capacity), [
      old_id,
      ...values,
    ]);

    if (edit_query.rowCount) {
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

      console.log("sending response 202");
      res.status(202).json({ msg: "successfully edited room", room });
    } else {
      console.log("sending response 404");
      res.status(404).json({ error: `room ${old_id} was not found` });
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
};

const delete_room = async (req, res) => {
  console.log(`recieved DELETE request - /rooms/${req.params.id}`);
  try {
    if (req.user.role !== "admin") {
      console.log("sending response 403");
      return res
        .send(403)
        .json({ error: "you don't have permission to delete this room" });
    }

    const id = req.params.id;

    if (!check_room_id(id)) {
      console.log("sending response 400");
      return res.status(400).json({ error: "invalid room id" });
    }

    const delete_query = await pool.query(queries.delete_room, [id]);
    if (delete_query.rowCount) {
      console.log("sending response 202");
      res.status(202).json({ msg: `successfully deleted room ${id}` });
    } else {
      console.log("sending response 404");
      res.status(404).json({ error: `room ${id} was not found` });
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
  edit_room,
  delete_room,
};
