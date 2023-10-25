
const get_all_courses = "select * from courses;";
const get_course_by_id = "select * from courses where course_id=$1;"
const get_guarantor_id = "select user_id from users where user_login=$1;"
const add_course = "insert into courses (course_id, course_name, course_annotation, course_guarantor_id) values ($1, $2, $3, $4) returning *;";

module.exports = {
	get_all_courses,
	get_course_by_id,
	get_guarantor_id,
	add_course
}