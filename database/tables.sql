-- @file tables.sql creating tables
-- @author Jan Kapsa (xkapsa00)
-- @brief db = postgresql

drop table if exists users cascade;
drop table if exists courses cascade;
drop table if exists rooms cascade;
drop table if exists course_activities cascade;
drop table if exists course_activity_lecturers cascade;
drop table if exists course_activity_instances cascade;
drop table if exists registrations cascade;
drop table if exists course_registrations cascade;
drop table if exists course_activity_instance_registrations cascade;
drop table if exists time_requirements cascade;

drop type if exists ROLE cascade;
drop type if exists COURSE_ACTIVITY cascade;
drop type if exists RECURRENCE cascade;
drop type if exists DAY cascade;

create type ROLE as enum ('student', 'rozvrhář', 'vyučující', 'garant', 'admin');
create type COURSE_ACTIVITY as enum ('přednáška', 'cvičení', 'laboratoř', 'democvičení', 'seminář');
create type RECURRENCE as enum ('každý', 'lichý', 'sudý', 'jednorázová aktivita');
create type DAY as enum ('pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek');

create table users (
	id varchar(10) primary key,
	password varchar(72) not null,
	role ROLE default 'student',
	name varchar(50),
	surname varchar(50),
	email varchar(50)
);

create table courses (
	id varchar(10) primary key,
	name varchar(50) not null,
	annotation text,
	guarantor varchar(10) not null,
	foreign key (guarantor) references users(id)
);

create table rooms (
	id char(4) primary key,
	capacity integer not null default 20
);

create table course_activities (
	id serial primary key,
	course varchar(10) not null,
	type COURSE_ACTIVITY not null,
	recurrence RECURRENCE not null,
	capacity integer not null,
	duration time not null,
	foreign key (course) references courses(id)
);

create table course_activity_lecturers (
	course_activity serial,
	lecturer varchar(10),
	foreign key (course_activity) references course_activities(id),
	foreign key (lecturer) references users(id),
	primary key (course_activity, lecturer)
);

create table course_activity_instances (
	id serial primary key,
	course_activity serial not null,
	room char(4),
	lecturer varchar(10),
	start_time time,
	day DAY,
	foreign key (course_activity) references course_activities(id),
	foreign key (room) references rooms(id),
	foreign key (lecturer) references users(id)
);

create table registrations (
	id serial primary key,
	type varchar(20) not null,
	state varchar(20) default 'NOT STARTED'
);

create table course_registrations (
	registration serial,
	course varchar(10),
	student varchar(10),
	foreign key (registration) references registrations(id),
	foreign key (course) references courses(id),
	foreign key (student) references users(id),
	primary key (registration, course, student)
);

create table course_activity_instance_registrations (
	registration serial,
	course_activity_instance serial,
	student varchar(10),
	order_number integer,
	registred boolean,
	foreign key (registration) references registrations(id),
	foreign key (course_activity_instance) references course_activity_instances(id),
	foreign key (student) references users(id),
	primary key (registration, course_activity_instance, student)
);

create table time_requirements (
	id serial primary key,
	start_time time,
	end_time time,
	day DAY not null,
	available boolean default false
);

insert into users (role, id, password) values ('admin', 'admin', '$2a$12$4fsW9MNF7EkCB26ZqyjBv.XePklapQIs22rqz/KySOFat75/3YSJK');
insert into users (role, id, password) values ('garant', 'garant', '$2a$12$fIkt71B3YPGl7jLVGmhuZ.MoxhIvteEt206gAGclrZoWtWZNhyTfe');
insert into users (role, id, password) values ('vyučující', 'vyucujici', '$2a$12$ioGGvtfQ0MJ3OXqNdBw6eOgRabokZW8pPnxGIq862ITwBR8yd2UZ2');
insert into users (role, id, password) values ('rozvrhář', 'rozvrhar', '$2a$12$d0jtwdQOIloBGlKa0SmcauSDg0Z5V13wsmKnrNOzbkJUsOggxVYlq');
insert into users (role, id, password) values ('student', 'student', '$2a$12$TuXkefAQEOzebxtTBH9YSeoP2/1Q3UcrjnoLx78bnTi51oEPRGIGC');
