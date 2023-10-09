-- @file procedures.sql procedures for inserting into tables
-- @author Jan Kapsa (xkapsa00)
-- @brief db = postgresql

-- create user

create or replace function generate_login(surname varchar(50))
returns varchar(10)
as $$
declare
	new_login varchar(10);
	surname_substr char(5);
	biggest_login varchar(10);
	login_number integer;
begin

	surname_substr := lower(substring(surname, 0, 6));
	select user_login into biggest_login from users
		where user_login like concat(surname_substr, '%')
		order by user_login desc limit 1;
	
	if biggest_login is null then
		login_number := 0;
	else
		biggest_login := substring(biggest_login, 6);
		login_number := cast(biggest_login as integer);
		login_number := login_number + 1;
	end if;

	new_login := concat(surname_substr, login_number);
	return new_login;

end
$$ language plpgsql;

create or replace function create_user(
	new_login varchar(10), new_role role, new_name varchar(50), new_surname varchar(50)
)
returns users
as $$
declare
	new_user users%rowtype;
begin

	if new_login is null and new_surname is null then
		raise exception 'both login and surname are null, cannot create user';
	end if;

	if new_login is null then
		select generate_login(new_surname) into new_login;
	end if;

	if new_role is null then
		new_role := 'student';
	end if;

	insert into users (user_login, user_role, user_name, user_surname) values (new_login, new_role, new_name, new_surname)
		returning * into new_user;

	return new_user;

end
$$ language plpgsql;

-- edit user

create or replace function edit_user(
	old_login varchar(10), new_role role, new_name varchar(50), new_surname varchar(50)
)
returns users
as $$
declare
	old_user users%rowtype;
	new_user users%rowtype;
begin

	select * into old_user from users where user_login = old_login;

	if lower(substring(old_user.user_surname, 0, 6)) != lower(substring(new_surname, 0, 6)) then
		select generate_login(new_surname) into old_login;
	end if;

	update users set (user_login, user_role, user_name, user_surname) = (old_login, new_role, new_name, new_surname)
		where user_id = old_user.user_id
		returning * into new_user;

	return new_user;

end
$$ language plpgsql;

-- remove user

create or replace procedure remove_user (u_login varchar(10))
as $$
begin

	delete from users where user_login = u_login;

end
$$ language plpgsql;

-- create course
-- edit course
-- remove course

-- create room
-- edit room
-- remove room

-- create course activity
-- edit course activity
-- remove course activity

-- create time requirement [lecturer, course]
-- edit time requirement
-- remove time requirement

-- create room requirement
-- remove room requirement