-- @file schemas.sql creating tables
-- @author Jan Kapsa (xkapsa00)
-- @brief db = postgresql

drop table if exists users;
drop table if exists courses;
drop table if exists rooms;

drop type if exists role;

create type role as enum ('student', 'lecturer', 'guarantor', 'admin');

create table users (
	user_id char(5) primary key,
	user_role role not null default 'student',
	name varchar(50) not null,
	surname varchar(50) not null
);

create table courses (
	course_id char(3) primary key,
	name varchar(50) not null,
	annotation text,
	guarantor_id char(5) not null,
	foreign key (guarantor_id) references users(user_id)
);

create table rooms (
	room_id char(4) primary key,
	building char(1) not null default 'A' check ((building >= 'A') and (building <= 'Z')),
	number char(3) not null default '100' check (length(number) == 3),
	capacity integer not null default 20
);
