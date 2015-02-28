create database mod1_DB;
use mod1_DB;
grant all on mod1_DB.* to mod1_user@localhost;
set password for mod1_user@localhost=password('***');
