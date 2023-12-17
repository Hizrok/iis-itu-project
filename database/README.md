# IIS-ITU-PROJECT DATABASE

## Inicialization 

This setup requires an already prepared SQL service running, for our testing and deployment we used Postgresql.
Once a running service is setup all that is needed is to run the script [`tables.sql`](./tables.sql) and the script should prepare all the tables and base users for you.
After the script finishes preparing the database don't forget to add credentials for access to it into server `.env` file.

## Base users

- login: `admin`, password: `admin`
- login: `garant`, password: `garant`
- login: `rozvrhar`, password: `rozvrhar`
- login: `vyucujici`, password: `vyucujici`
- login: `student`, password: `student`
