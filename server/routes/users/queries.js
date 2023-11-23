const get_all_users =
  "select user_role as role, user_login as login, user_name as name, user_surname as surname from users;";

const get_user_by_login =
  "select user_role as role, user_login as login, user_password as password, user_name as name, user_surname as surname from users where user_login = $1";

const add_user =
  "insert into users (user_role, user_login, user_password, user_name, user_surname) values ($1, $2, $3, $4, $5) returning user_role as role, user_login as login, user_name as name, user_surname as surname;";

const get_similar_logins =
  "select user_login from users where user_login like $1 || '%';";

const edit_user =
  "update users set user_role=$1, user_name=$2, user_surname=$3, user_password=$4 where user_login=$5 returning user_role as role, user_name as name, user_surname as surname;";

const delete_user = "delete from users where user_login=$1;";

module.exports = {
  get_all_users,
  get_user_by_login,
  add_user,
  get_similar_logins,
  edit_user,
  delete_user,
};
