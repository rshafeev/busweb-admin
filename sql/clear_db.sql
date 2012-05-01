--------------------- clear database -------------------------------


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



delete from bus.string_values;
delete from bus.string_keys;
delete from bus.languages;


--------------------- delete database -------------------------------





DROP TABLE bus.route_way_days;
DROP TABLE bus.route_schedule;
DROP TABLE bus.route_way_daygroups;

DROP TABLE bus.route_way_nodes;
DROP TABLE bus.route_ways;
DROP TABLE bus.routes;
DROP TABLE bus.node_transports;
DROP TABLE bus.nodes;
DROP TABLE bus.node_types;

DROP TABLE bus.term_discounts;
DROP TABLE bus.term_transports;
DROP TABLE bus.terms;


DROP TABLE bus.discount_transports;
DROP TABLE bus.discounts;

DROP TABLE bus.route_types;
DROP TABLE bus.transport_types;

DROP TABLE bus.cities;


DROP TABLE  bus.string_values;
DROP TABLE  bus.string_keys;
DROP TABLE  bus.languages;


DROP TABLE  bus.calc_shortest_way_times;
DROP TABLE  bus.calc_shortest_ways;

DROP TABLE  bus.users;
DROP TABLE  bus.user_roles;

DROP TYPE  bus.transport_type_enum;
DROP TYPE  bus.route_type_enum;
DROP TYPE  bus.node_type_enum;
DROP TYPE  bus.short_path;

DROP TYPE  day_enum;
DROP TYPE  lang_enum;
