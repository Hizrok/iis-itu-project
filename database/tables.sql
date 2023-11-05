-- @file tables.sql creating tables
-- @author Jan Kapsa (xkapsa00)
-- @brief db = postgresql

drop table if exists course_act_time_reqs;
drop table if exists course_act_room_reqs;
drop table if exists lecturer_time_reqs;
drop table if exists time_requirements;
drop table if exists course_activities;
drop table if exists courses;
drop table if exists rooms;
drop table if exists users cascade;

drop type if exists role cascade;
drop type if exists ca_type cascade;
drop type if exists recurrence_type cascade;
drop type if exists day cascade;

create type role as enum ('student', 'scheduler', 'lecturer', 'guarantor', 'admin');
create type ca_type as enum ('přednáška', 'cvičení', 'laboratoř', 'democvičení', 'seminář');
create type recurrence_type as enum ('každý', 'lichý', 'sudý', 'jednorázová aktivita');
create type day as enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday');

create table users (
	user_login varchar(10) primary key,
	user_role role default 'student',
	user_name varchar(50),
	user_surname varchar(50)
);

create table courses (
	course_id char(3) primary key,
	course_name varchar(50) not null,
	course_annotation text,
	course_guarantor_login varchar(10) not null,
	foreign key (course_guarantor_login) references users(user_login)
);

create table rooms (
	room_id char(4) primary key,
	room_building char(1) not null default 'A' check ((room_building >= 'A') and (room_building <= 'Z')),
	room_number char(3) not null default '100' check (length(room_number) = 3),
	room_capacity integer not null default 20
);

create table course_activities (
	ca_id serial primary key,
	type ca_type not null,
	ca_recurrence recurrence_type not null,
	ca_capacity integer not null,
	ca_start_time time not null,
	ca_end_time time not null,
	ca_day_of_week day not null,
	ca_registration_start timestamp not null,
	ca_registration_end timestamp not null
);

create table time_requirements (
	tr_id serial primary key,
	tr_start_time time not null,
	tr_end_time time not null,
	tr_day_of_week day not null,
	tr_available boolean default false
);

create table course_act_time_reqs (
	ca_id serial,
	tr_id serial,
	foreign key (ca_id) references course_activities (ca_id),
	foreign key (tr_id) references time_requirements (tr_id),
	primary key (ca_id, tr_id)
);

create table course_act_room_reqs (
	ca_id serial,
	room_id char(4),
	foreign key (ca_id) references course_activities (ca_id),
	foreign key (room_id) references rooms (room_id),
	primary key (ca_id, room_id)
);

create table lecturer_time_reqs (
	user_login varchar(10),
	tr_id serial,
	foreign key (user_login) references users (user_login),
	foreign key (tr_id) references time_requirements (tr_id),
	primary key (user_login, tr_id)
);
