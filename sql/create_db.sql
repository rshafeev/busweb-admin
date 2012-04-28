

--CREATE SCHEMA bus AUTHORIZATION postgres
        
CREATE TYPE lang_enum AS ENUM
   (
     'c_en',
     'c_ru',
     'c_uk',
     'c_be',
     'c_kk'
   );
   
CREATE TYPE day_enum AS ENUM
   ( 
      'c_Sunday',
      'c_Monday',
      'c_Tuesday',
      'c_Wednesday',
      'c_Thursday',
      'c_Friday',
      'c_Saturday'
   );
   
CREATE TYPE bus.transport_type_enum AS ENUM
   (
    'c_metro',
    'c_bus',
    'c_trolley',
    'c_tram',
    'c_foot'
    );

CREATE TYPE bus.route_type_enum AS ENUM
   (
    'c_route_metro',
    'c_route_metro_transition',
    'c_route_metro_exit',
    'c_route_trolley',
    'c_route_bus',
    'c_route_tram'
    ); 

CREATE TYPE bus.node_type_enum AS ENUM
   (
     'c_station',
     'c_object'
   );


CREATE TYPE bus.short_path AS
   (route_way_id bigint,
    station_id bigint,
    ind bigint,
    time_in time without time zone,
    station_delay interval,
    money_cost money);
ALTER TYPE bus.short_path OWNER TO postgres;

------------------------------------ create database --------------------------------------
CREATE TABLE bus.languages
(
  id        lang_enum       NOT NULL,
  name      character(255)      NOT NULL,
  
  CONSTRAINT languages_pk PRIMARY KEY (id)
);

CREATE TABLE bus.string_keys
(
  id     bigint NOT NULL,
  name   character(256),

   CONSTRAINT string_keys_pk PRIMARY KEY (id)
);

CREATE TABLE bus.string_values
(
  id       bigint    NOT NULL,
  key_id   bigint    NOT NULL,
  lang_id  lang_enum NOT NULL,
  value    character(256),

  CONSTRAINT string_values_pk PRIMARY KEY (id),

  CONSTRAINT lang_string_values_fk FOREIGN KEY (lang_id)
      REFERENCES bus.languages (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  
  CONSTRAINT key_string_values_fk FOREIGN KEY (key_id)
      REFERENCES bus.string_keys(id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
      
);





--######################################

CREATE TABLE bus.node_types
(
  id                bus.node_type_enum     NOT NULL,
  name_key          bigint	           NOT NULL,

  CONSTRAINT node_type_id_pk PRIMARY KEY (id),
  CONSTRAINT node_type_name_fk FOREIGN KEY (name_key)
      REFERENCES bus.string_keys (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL
)
WITH (
  OIDS=FALSE
);

--######################################

CREATE TABLE bus.cities
(
  id bigserial NOT NULL,
  name_key      bigint	NOT NULL,

  
  CONSTRAINT city_pk PRIMARY KEY (id),

  CONSTRAINT city_name_fk FOREIGN KEY (name_key)
      REFERENCES bus.string_keys (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL
      
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.cities OWNER TO postgres;

--######################################
CREATE TABLE bus.transport_types
(
  id 		bus.transport_type_enum	NOT NULL,
  ev_speed 	double precision 	NOT NULL,
  CONSTRAINT    "transport_type_pk" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

ALTER TABLE bus.transport_types OWNER TO postgres;
--######################################
CREATE TABLE bus.route_types
(
  id 		bus.route_type_enum	NOT NULL,
  transport_id 	bus.transport_type_enum	NOT NULL,
  CONSTRAINT    "route_type_pk" PRIMARY KEY (id),
  CONSTRAINT route_type_transporttype_fk FOREIGN KEY (transport_id)
      REFERENCES bus.transport_types (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE 
)
WITH (
  OIDS=FALSE
);

ALTER TABLE bus.transport_types OWNER TO postgres;

--######################################

CREATE TABLE bus.discounts
(
  id bigserial NOT NULL,
  name_key          bigint		NOT NULL,
  
  CONSTRAINT discounts_pk PRIMARY KEY (id),
  
  CONSTRAINT discount_name_fk FOREIGN KEY (name_key)
      REFERENCES bus.string_keys (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.discounts OWNER TO postgres;

--######################################


CREATE TABLE bus.discount_transports
(
  discount_id 		bigint 			NOT NULL,
  transport_type_id 	bus.transport_type_enum NOT NULL,
  discount_after 	double precision 	NOT NULL,
  
  CONSTRAINT facility_transports_pk PRIMARY KEY (discount_id, transport_type_id),

  CONSTRAINT discount_tr_disid_fk FOREIGN KEY (discount_id)
      REFERENCES bus.discounts (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,

  CONSTRAINT discount_tr_trid_fk FOREIGN KEY (transport_type_id)
      REFERENCES bus.transport_types (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,

  CONSTRAINT discount_transports_discount_after_check 
             CHECK (discount_after > 0::double precision AND discount_after <= 1::double precision)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.discount_transports OWNER TO postgres;


--######################################

CREATE TABLE bus.terms
(
  id 			bigserial NOT NULL,
  optimize_method 	bigint    NOT NULL,

  CONSTRAINT term_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.terms OWNER TO postgres;

--######################################

CREATE TABLE bus.term_transports
(
  term_id 		bigint NOT NULL,
  transport_type_id 	bus.transport_type_enum NOT NULL,
  
  CONSTRAINT term_transports_pk PRIMARY KEY (term_id, transport_type_id),

  CONSTRAINT term_tr_termid_fk FOREIGN KEY (term_id)
      REFERENCES bus.terms (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
          
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.term_transports OWNER TO postgres;


--######################################

CREATE TABLE bus.term_discounts
(
  term_id     bigint NOT NULL,
  discount_id bigint NOT NULL,
  
  CONSTRAINT term_discount_pk PRIMARY KEY (term_id, discount_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.term_discounts OWNER TO postgres;

--######################################
CREATE TABLE bus.nodes
(
  id 			bigserial 		NOT NULL,
  type_id 		bus.node_type_enum 	NOT NULL,
  city_id 		bigint 			NOT NULL,
  name_key              bigint                  NOT NULL,
  CONSTRAINT node_pk PRIMARY KEY (id),

  CONSTRAINT node_city_id_fk FOREIGN KEY (city_id)
      REFERENCES bus.cities (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,

  CONSTRAINT node_name_fk FOREIGN KEY (name_key)
      REFERENCES bus.string_keys (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.nodes OWNER TO postgres;
SELECT AddGeometryColumn('','bus','nodes', 'location', 4326, 'POINT', 2);

--######################################

CREATE TABLE bus.node_transports
(
  node_id 		bigint 			NOT NULL,
  transport_type_id 	bus.transport_type_enum NOT NULL,
  
  CONSTRAINT node_transport_pk PRIMARY KEY (node_id,transport_type_id),

  CONSTRAINT node_trasnport_nid_fk FOREIGN KEY (node_id)
      REFERENCES bus.nodes (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
      
  CONSTRAINT node_trasnport_ttid_fk FOREIGN KEY (transport_type_id)
      REFERENCES bus.transport_types (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION      
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.node_transports OWNER TO postgres;


--######################################

CREATE TABLE bus.routes
(
  id 		  bigserial 		NOT NULL,
  city_id 	  bigint 		NOT NULL,
  route_type_id   bus.route_type_enum   NOT NULL,
  number          character(256)        ,
  base_cost 	  money 		NOT NULL,
  name_key        bigint                NOT NULL,
     
  CONSTRAINT routes_pk PRIMARY KEY (id),
      
  CONSTRAINT routes_city_id_fk FOREIGN KEY (city_id)
      REFERENCES bus.cities (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
      
  CONSTRAINT routes_route_type_id_fk FOREIGN KEY (route_type_id)
      REFERENCES bus.route_types (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,

        
  CONSTRAINT routes_name_fk FOREIGN KEY (name_key)
      REFERENCES bus.string_keys (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
             
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.routes OWNER TO postgres;


--######################################

CREATE TABLE bus.route_ways
(
  id bigserial NOT NULL,
  route_id bigint NOT NULL,
  direct_type bit NOT NULL, -- 1 - direct...
  CONSTRAINT route_ways_pkey PRIMARY KEY (id),
  CONSTRAINT route_way_direct_uniq UNIQUE(route_id, direct_type),

  CONSTRAINT route_way_routeid_fk FOREIGN KEY (route_id)
      REFERENCES bus.routes (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.route_ways OWNER TO postgres;
COMMENT ON COLUMN bus.route_ways.direct_type IS
'0 - direct
1 - reverse';


--######################################

CREATE TABLE bus.route_way_daygroups
(
  id bigserial NOT NULL,
  CONSTRAINT route_way_daygroup_id_pk PRIMARY KEY (id)

)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.route_way_daygroups OWNER TO postgres;

--######################################

CREATE TABLE bus.route_way_days
(
  route_daygroup_id   bigint   NOT NULL,
  day_id              day_enum NOT NULL,
  route_way_id        bigint   NOT NULL,
  
  CONSTRAINT route_way_day_id_pk PRIMARY KEY (route_daygroup_id,day_id),

  CONSTRAINT route_way_day_daygroup_id_fk FOREIGN KEY (route_daygroup_id)
      REFERENCES bus.route_way_daygroups (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
      
  CONSTRAINT route_way_day_wayid_fk FOREIGN KEY (route_way_id)
      REFERENCES bus.route_ways (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,

   CONSTRAINT route_way_day_secondpk_uniq UNIQUE (day_id, route_way_id)        
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.route_way_days OWNER TO postgres;

--######################################


CREATE TABLE bus.route_schedule
(
  id                bigserial NOT NULL,
  route_daygroup_id bigint NOT NULL,
  time_a            time without time zone NOT NULL,
  time_b            time without time zone NOT NULL,
  time_frequancy    interval NOT NULL,
  
  CONSTRAINT route_schedule_pk PRIMARY KEY (id),
  CONSTRAINT route_schedule_fk FOREIGN KEY (route_daygroup_id)
      REFERENCES bus.route_way_daygroups (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.route_schedule OWNER TO postgres;

--######################################

CREATE TABLE bus.route_way_nodes
(
  id bigserial NOT NULL,
  route_way_id bigint NOT NULL,
  prev_node_id bigint,
  curr_node_id bigint NOT NULL,
  distance     double precision NOT NULL,
  time         interval NOT NULL,
  "index" bigint,
  
  CONSTRAINT route_node_pk PRIMARY KEY (id),
  CONSTRAINT route_curr_node_id_fk FOREIGN KEY (curr_node_id)
      REFERENCES bus.nodes (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT route_prev_node_id_fk FOREIGN KEY (prev_node_id)
      REFERENCES bus.nodes (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT route_way_fk FOREIGN KEY (route_way_id)
      REFERENCES bus.route_ways (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT route_node_index_uniq UNIQUE (route_way_id, index),
  CONSTRAINT route_node_secondpk_uniq UNIQUE (route_way_id, curr_node_id)
)
WITH (
  OIDS=FALSE
);



--######################################


CREATE TABLE bus.calc_shortest_ways
(
  id bigint NOT NULL,
  term_id bigint,
  full_cost money NOT NULL,
  full_time interval NOT NULL,
  rating_program bigint NOT NULL,
  rating_expert bigint,
  node_start_id bigint,
  node_finish_id bigint,
  CONSTRAINT calc_shortest_way_id_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.calc_shortest_ways OWNER TO postgres;


--######################################

CREATE TABLE bus.calc_shortest_way_times
(
  id bigserial NOT NULL,
  shortest_way_id bigint NOT NULL,
  time1 time without time zone NOT NULL,
  time2 time without time zone NOT NULL,
  
  CONSTRAINT calc_shortest_way_time_id_pk PRIMARY KEY (id),
  CONSTRAINT calc_shortest_way_id_fk FOREIGN KEY (shortest_way_id)
      REFERENCES bus.calc_shortest_ways (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bus.calc_shortest_way_times OWNER TO postgres;
/*
CREATE  TYPE bus.short_path AS
   (route_id bigint,
    station_id bigint,
    ind bigint
   );
*/

COMMIT;





