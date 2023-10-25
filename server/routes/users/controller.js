
const pool = require("../../db");
const queries = require("./queries");

const get_users = async (req, res) => {
	try {
		const users = await pool.query(queries.get_all_users);
		res.status(200).json(users.rows);
	} catch (error) {
		res.status(500).json(error);
		console.error(error);
	}
};

const get_user_by_login = async (req, res) => {
	try {
		const login = req.params.login;
		const user = await pool.query(queries.get_user_by_login, [login]);
		if (user.rows.length) {
			res.status(200).json(user.rows);
		} else {
			res.status(404).json({error: `user ${login} not found`});
		}
	} catch (error) {
		res.status(500).json(error);
		console.error(error);
	}
};

const generate_login = async surname_substring => {
	let login = surname_substring;
	const similar_logins = await pool.query(queries.get_similar_logins, [login]);

	taken_numbers = similar_logins.rows.map(l => l.user_login);
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

	return login;
}

const add_user = async (req, res) => {
	try {
		const { role, name, surname } = req.body;
		const surname_substring = surname.substring(0, 5).toLowerCase();
		const login = await generate_login(surname_substring);

		const user = await pool.query(queries.add_user, [role, login, name, surname]);
		res.status(201).json(user.rows);		
	} catch (error) {
		res.status(500).json(error);
		console.error(error);
	}
};

const edit_user = async (req, res) => {
	try {
		const login = req.params.login;
		const { role, name, surname } = req.body;
	
		const user = await pool.query(queries.edit_user, [role, name, surname, login]);
		res.status(202).json(user.rows);
	} catch (error) {
		res.status(500).json(error);
		console.error(error);
	}
}

const delete_user = async (req, res) => {
	try {
		const login = req.params.login;
		const delete_query = await pool.query(queries.delete_user, [login]);	
		// delete query will be one if user with that login was found
		if (delete_query.rowCount) {
			res.status(202).json({message: `successfully deleted user ${login}`});
		} else {
			res.status(404).json({message: `user ${login} was not found`});
		}
	} catch (error) {
		res.status(500).json(error);
		console.error(error);	
	}
}

module.exports = {
	get_users,
	get_user_by_login,
	add_user,
	edit_user,
	delete_user
}
