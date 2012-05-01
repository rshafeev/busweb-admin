

delete from bus.languages;

delete from bus.route_way_days;
delete from bus.route_schedule;
delete from bus.route_way_daygroups;

delete from bus.route_way_nodes;
delete from bus.route_ways;
delete from bus.routes;


delete from bus.node_transports;
delete from bus.nodes;
delete from bus.cities;

delete from bus.transport_types;

delete from bus.user_roles;
delete from bus.users;

--- init ---

INSERT INTO bus.languages(id,name) VALUES('c_en', 'English');
INSERT INTO bus.languages(id,name) VALUES('c_ru', 'Русский');

select bus.insert_user_role('admin');
select bus.insert_user('admin','roma','rar');
select bus.insert_user('admin','marianna','rar');

select * from bus.authenticate('admin','marianna','rar') as t1;
/*
select bus.add_city('{"c_en","c_ru"}','{"Kharkov","Харьков"}');
select bus.add_city('{"c_en","c_ru"}','{"Kiev","Киев"}');
*/

