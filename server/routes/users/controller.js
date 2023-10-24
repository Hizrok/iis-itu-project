
const pool = require("../../db");
const queries = require("./queries");

const handle_error = (res, error) => {
	res.status(500).json({error});
	console.error(error);
}

const get_users = (req, res) => {
	pool.query(queries.get_all_users, (error, results) => {
		if (error) { handle_error(res, error); return; }
		res.status(200).json(results.rows);
	});
};

const get_user_by_login = (req, res) => {
	const login = req.params.login;
	pool.query(queries.get_user_by_login, [login], (error, results) => {
		if (error) { handle_error(res, error); return; }

		if (results.rows.length) {
			res.status(200).json(results.rows);
		} else {
			res.status(404).json({error: "user not found"});
		}
	});
};

const add_user = (req, res) => {
	
	const { role, name, surname } = req.body;

	let login = surname.substring(0, 5).toLowerCase();

	pool.query(queries.get_similar_logins, [login], (error, results) => {
		if (error) { handle_error(res, error); return; }

		// e.g.: login = kap, login kapsa00 in db will get returned
		taken_numbers = results.rows.map(l => l.user_login);
		taken_numbers = taken_numbers.filter(l => login.length === l.substring(0,l.length-2).length)
		taken_numbers = taken_numbers.map(l => parseInt(l.substring(l.length-2, l.length)));

		for (let i = 0; i < 100; i++) {
			if (!taken_numbers.includes(i)) {
				login_number = "";
				if (i < 10) {
					login_number += "0";
				}
				login_number += i.toString();
				login += login_number;
				break;
			}
		}

		pool.query(queries.add_user, [role, login, name, surname], (error, results) => {
			if (error) { handle_error(res, error); return; }
			res.status(201).json({message: "successfully created new user"});
		});

	});
};

const edit_user = (req, res) => {
	const login = req.params.login;
	const { role, name, surname } = req.body;

	pool.query(queries.edit_user, [role, name, surname, login], (error, results) => {
		if (error) {handle_error(res, error)}
		res.status(202).json({message: "successfully edited new user"});
	});

}

const delete_user = (req, res) => {
	const login = req.params.login;

	pool.query(queries.delete_user, [login], (error, results) => {
		if (error) {handle_error(res, error)}
		res.status(202).json({message: "successfully deleted new user"});
	});

}

module.exports = {
	get_users,
	get_user_by_login,
	add_user,
	edit_user,
	delete_user
}
