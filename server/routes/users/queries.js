const get_all_users = "select id, role, name, surname, email from users;";

const get_guarantors =
  "select id from users where role='admin' or role='garant';";

const get_user_data =
  "select id, role, name, surname, email from users where id=$1";

const add_user =
  "insert into users (id, role, password, name, surname, email) values ($1, $2, $3, $4, $5, $6) returning id, role, name, surname, email;";

const get_similar_ids = "select id from users where id like $1 || '%';";

const get_edit_query = (role, password, name, surname, email) => {
  let query = "update users set ";

  const fields = [];
  let index = 2;
  role && fields.push(`role=$${index++}`);
  password && fields.push(`password=$${index++}`);
  name && fields.push(`name=$${index++}`);
  surname && fields.push(`surname=$${index++}`);
  email && fields.push(`email=$${index++}`);

  query += fields.join(",");
  query += " where id=$1 returning id, role, name, surname, email;";
  return query;
};

const delete_user = "delete from users where id=$1;";

module.exports = {
  get_all_users,
  get_guarantors,
  get_user_data,
  add_user,
  get_similar_ids,
  get_edit_query,
  delete_user,
};
