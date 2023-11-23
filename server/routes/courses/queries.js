const get_all_courses =
  "select course_id, course_name, course_annotation, course_guarantor_login, user_name, user_surname, user_email from courses left join users on user_login=course_guarantor_login;";

const get_course_by_id =
  "select course_id, course_name, course_annotation, course_guarantor_login, user_name, user_surname, user_email from courses left join users on user_login=course_guarantor_login where course_id=$1;";

const add_course =
  "insert into courses (course_id, course_name, course_annotation, course_guarantor_login) values ($1, $2, $3, $4) returning course_id as id, course_name as name, course_annotation as annotation, course_guarantor_login as guarantor;";

const get_edit_query = (id, name, annotation, guarantor) => {
  let index = 2;
  let query = "update courses set ";

  const fields = [];

  id && fields.push(`course_id=$${index++}`);
  name && fields.push(`course_name=$${index++}`);
  annotation && fields.push(`course_annotation=$${index++}`);
  guarantor && fields.push(`course_guarantor_login=$${index++}`);

  query += fields.join(",");

  query +=
    " where course_id=$1 returning course_id as id, course_name as name, course_annotation as annotation, course_guarantor_login as login;";

  return query;
};

const delete_course = "delete from courses where course_id=$1;";

module.exports = {
  get_all_courses,
  get_course_by_id,
  add_course,
  get_edit_query,
  delete_course,
};
