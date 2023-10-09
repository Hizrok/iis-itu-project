-- @file insert_dummy_data.sql populates the db with dummy data
-- @author Jan Kapsa (xkapsa00)
-- @brief db = postgresql

call create_user('admin', 'admin', null, null);
call create_user('guarantor', 'guarantor', null, null);
call create_user('lecturer', 'lecturer', null, null);
call create_user('scheduler', 'scheduler', null, null);
call create_user('student', 'student', null, null);

call create_user(null, null, 'Jan', 'Kapsa');
call create_user(null, null, 'Jan', 'Kapsa');
call create_user(null, null, 'Jan', 'Kapsa');
call create_user(null, null, 'Jan', 'Kapsa');
call create_user(null, null, 'Jan', 'Kapsa');

select * from users;