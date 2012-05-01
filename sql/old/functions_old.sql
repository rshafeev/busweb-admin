
CREATE OR REPLACE FUNCTION bus.drop_functions()
RETURNS void AS
$BODY$
DECLARE
 --DROP TYPE bus.markers;
 --DROP TYPE bus.short_path;
BEGIN
   
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;			

 SELECT  bus.drop_functions();
--DROP FUNCTION bus.calc_dejkstra_ru(character,character,character,day_enum, time without time zone, bigint);
--DROP FUNCTION bus.calc_dejkstra(bigint,bigint,day_enum, time without time zone, bigint);



CREATE TYPE bus.short_path AS
   (route_way_id bigint,
    station_id bigint,
    ind bigint,
    time_in                   time without time zone,
    station_delay             interval,
    money_cost                 money
    );
CREATE TYPE bus.markers AS
(
                node_id                    bigint,
                time_in                    time without time zone,
                node_delay                 interval,
                
                prev_route_way_node_id     bigint,
                prev_route_type_id         bus.route_type_enum,
                prev_route_way_id          bigint,
                prev_node_id               bigint,
                 
                cost       	           double  precision,
                money_cost 	           money,
                time_cost 	           interval,
                is_visit 	           bit

);


--=================================================================================================================--
-- 
-- CREATE OR REPLACE FUNCTION bus.fill_markers_table(curr_node bigint)
--   RETURNS void AS
-- $BODY$
-- DECLARE
--  node_record            bus.route_way_nodes%ROWTYPE;
--  v_count bigint:=0;
-- BEGIN
--      FOR node_record IN SELECT * FROM bus.route_way_nodes WHERE prev_node_id = curr_node  LOOP
--         SELECT count(*) INTO  v_count FROM markers_table WHERE node_id = node_record.curr_node_id;
--         IF  v_count=0 THEN
-- 		INSERT INTO markers_table (node_id) VALUES (node_record.curr_node_id);
-- 		EXECUTE bus.fill_markers_table(node_record.curr_node_id);
--         END IF;
--   END LOOP;
-- 
--   
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;					   
-- --=================================================================================================================--  
-- CREATE OR REPLACE FUNCTION bus.calc_dejkstra(
-- 						   v_stationA_id        bigint,
-- 						   v_stationB_id        bigint,
-- 						   v_day_id              day_enum,
-- 						   time_start            time without time zone,
-- 						   optimize              bigint
-- 						  )
--   RETURNS SETOF bus.short_path AS
-- $BODY$
-- DECLARE
--  shortestway 		bus.short_path;
--  tmp_elem    		bus.short_path;
--  marker_record          bus.markers;
--  curr_marker_record     bus.markers;
--  node_way_record        bus.route_way_nodes%ROWTYPE;
--  node_way_ex_rec        record;
--  v_route_metro_id             bigint;
--  v_route_metro_transition_id  bigint;
--  v_visit_count                bigint:=0;
--  v_node_count                 bigint;
--  v_min_node                   bigint;
--  v_index                      bigint;
--  v_opt                        double precision := 1.0 / optimize;
--  v_time_in                    time without time zone;
--  v_curr_node                  bigint;
--  v_node_delay                 interval;           
-- BEGIN
--  -- create temporary tables for storage data to RAM
--   BEGIN 
--        -- DROP TABLE markers_table;
--         CREATE TEMPORARY TABLE markers_table (
--                 node_id      	   bigint,
--                 time_in                    time without time zone,
--                 node_delay                 interval,
--                 
--                 prev_route_way_node_id     bigint  DEFAULT -1,
--                 prev_route_type_id         bus.route_type_enum  DEFAULT NULL,    
--                 prev_route_way_id          bigint  DEFAULT -1,
--                 prev_node_id               bigint  DEFAULT -1,
--                 
--                 cost       	           double  precision  DEFAULT 999999999.0,
--                 money_cost 	           money,
--                 time_cost 	           interval DEFAULT '0 minute',
--                 is_visit 	           bit DEFAULT B'0'
-- 
--         );
-- 
-- 
-- 		       
--     EXCEPTION WHEN OTHERS THEN 
--         TRUNCATE TABLE markers_table; -- TRUNCATE if the table already exists within the session.
--   END;
--   
--   BEGIN 
--      --   DROP TABLE short_way_table;
--         CREATE TEMPORARY TABLE short_way_table (
-- 		route_way_id 	bigint,
-- 		station_id 	bigint,
-- 		ind 		bigint,
-- 		time_in         time without time zone,
-- 		station_delay   interval,
-- 		money_cost      money
--          );
--         EXCEPTION WHEN OTHERS THEN
--           TRUNCATE TABLE short_way_table; 
--   END;
--       
--   -- fill markers table
--   EXECUTE bus.fill_markers_table(v_stationA_id);
-- 
-- 
--    v_node_delay := '0 minute';
--    curr_marker_record.node_id := v_stationA_id;
--    curr_marker_record.cost := 0;
--    curr_marker_record.time_in = time_start;
-- 
--    UPDATE  markers_table SET cost = 0.0, time_in = time_start,node_delay = v_node_delay
--                         WHERE node_id = curr_marker_record.node_id;
-- 
--    SELECT count(*) INTO v_node_count FROM markers_table;
--    
--    
--   WHILE v_visit_count < v_node_count LOOP
--      UPDATE  markers_table SET is_visit = B'1' WHERE node_id = curr_marker_record.node_id;
--      FOR node_way_ex_rec IN SELECT prev_node_id,curr_node_id,route_way_id,route_type_id,bus.route_way_nodes.id as id,time,distance
--       FROM bus.route_way_nodes
--                                      JOIN bus.route_ways ON bus.route_ways.id = bus.route_way_nodes.route_way_id
--                                      JOIN bus.routes ON bus.routes.id =  bus.route_ways.route_id
--                                      WHERE prev_node_id = curr_marker_record.node_id  
-- 
--       LOOP
--         SELECT * INTO marker_record FROM markers_table WHERE node_id = node_way_ex_rec.curr_node_id;
--         --v_time_wait
--         IF (node_way_ex_rec.route_way_id = curr_marker_record.prev_route_way_id)
--          THEN
--             v_node_delay := '7 sec';
--         ELSE
--             v_node_delay := '1 minute';
--         END IF;
--         
--         v_time_in := curr_marker_record.time_in + node_way_ex_rec.time + v_node_delay;
--        
--         --RAISE NOTICE 'time: %', curr_marker_record;
--         IF marker_record.cost> curr_marker_record.cost + node_way_ex_rec.distance THEN
--           UPDATE  markers_table SET cost = (curr_marker_record.cost + node_way_ex_rec.distance),
--                                   
--                                     time_in = v_time_in,
--                                     node_delay = v_node_delay,
-- 
-- 				    prev_node_id = node_way_ex_rec.prev_node_id,
--                                     prev_route_way_id = node_way_ex_rec.route_way_id,
--                                     prev_route_way_node_id = node_way_ex_rec.id,
--                                     prev_route_type_id = node_way_ex_rec.route_type_id
--                                  WHERE node_id = node_way_ex_rec.curr_node_id;
--         END IF; 
--         
--      END LOOP;
--     --v_tmp_cost
-- 
--     
--     SELECT * INTO curr_marker_record FROM markers_table WHERE is_visit = B'0' AND
--                         cost = (select min(cost) FROM markers_table WHERE is_visit = B'0') ;
--     v_visit_count := v_visit_count + 1;  
--   END LOOP;
-- 
-- 
-- 
--  
--   -- find shortest way
--     DELETE FROM  short_way_table;
-- 
--     v_curr_node := v_stationB_id;
-- 
--     
--     
--     v_index :=0;
--     WHILE v_curr_node <>-1 AND v_index<=v_node_count LOOP
--         
--         SELECT * INTO marker_record FROM markers_table WHERE node_id =  v_curr_node;
--         IF marker_record.prev_route_way_node_id >=0 THEN
--           INSERT INTO short_way_table (route_way_id,station_id,ind,time_in,station_delay,money_cost) 
--                                VALUES (marker_record.prev_route_way_node_id,v_curr_node,
--                                        v_index,marker_record.time_in,marker_record.node_delay,marker_record.money_cost);
--         END IF;
--         v_curr_node := marker_record.prev_node_id;
--         v_index := v_index + 1;
--         
--     END LOOP;
-- 
--   
-- 
--   -- return table
--   FOR shortestway IN SELECT * FROM short_way_table LOOP
--         RETURN NEXT shortestway;
--   END LOOP;
--    
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;

--=================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.calc_dejkstra_lang(
-- 						   lang             lang_enum,
-- 						   city_name        character,
-- 						   station_A        character,
-- 						   station_B        character,
-- 						   v_day            day_enum,
-- 						   time_start       time without time zone,
-- 						   optimize         bigint
-- 						   )
--   RETURNS SETOF bus.short_path AS
-- $BODY$
-- DECLARE
-- v_city_id           bigint;
-- station_A_id        bigint;
-- station_B_id        bigint;
-- path                bus.short_path;						   
-- BEGIN
--     SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.string_keys ON bus.string_keys.id = bus.cities.name_key 
--                                                         JOIN bus.string_values ON bus.string_values.key_id = bus.string_keys.id
-- 				      WHERE bus.string_values.lang_id = lang AND bus.string_values.value = city_name;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'city % not found', ru_city_name;
--   END IF;
-- 
--   
--   SELECT bus.nodes.id INTO station_A_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- 				        WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = station_A;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'node % not found', station_A;
--   END IF;
--   				        
--   SELECT bus.nodes.id INTO station_B_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- 				        WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = station_B;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'node % not found', station_B;
--   END IF;
-- 
--   FOR path IN SELECT * FROM bus.calc_dejkstra(station_A_id,station_B_id,v_day,time_start,optimize) LOOP
--      RETURN NEXT path;
--   END LOOP;	      				      
--   
-- END;
-- $BODY$
-- LANGUAGE plpgsql VOLATILE  COST 100;
  
--================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.set_route_timetable_directboth_ru(
-- 						   v_city_name        character,
-- 						   v_route_name          character,
-- 						   v_name_or_number    bit,
-- 						   v_time_interval     time without time zone [],
-- 						   v_time_frequancy    interval[],
-- 						   v_days              day_enum[]
-- 						  )
--   RETURNS void AS
-- $BODY$
-- DECLARE
-- BEGIN
--   EXECUTE bus.set_route_timetable_ru(v_city_name,v_route_name,B'0',v_name_or_number,v_time_interval,v_time_frequancy,v_days);
--   EXECUTE bus.set_route_timetable_ru(v_city_name,v_route_name,B'1',v_name_or_number,v_time_interval,v_time_frequancy,v_days);
--   
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;	
--================================================================================================================--

-- CREATE OR REPLACE FUNCTION bus.set_route_timetable_ru(
-- 						   v_city_name        character,
-- 						   v_route_name          character,
-- 						   direct              bit,
-- 						   v_name_or_number    bit,
-- 						   v_time_interval     time without time zone [],
-- 						   v_time_frequancy    interval[],
-- 						   v_days              day_enum[]
-- 						   )
--   RETURNS void AS
-- $BODY$
-- DECLARE
--   v_route_id  bigint;
--   v_city_id   bigint;
-- BEGIN
--     SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.lang_cities ON bus.cities.id = bus.lang_cities.city_id
-- 				      WHERE lang_id = 'c_ru' AND name = v_city_name;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'city % not found', ru_city_name;
--   END IF;
-- 
--   IF v_name_or_number = B'1' THEN
-- 	SELECT bus.routes.id INTO v_route_id FROM bus.routes JOIN bus.lang_routes ON bus.routes.id = bus.lang_routes.route_id
-- 				      WHERE  city_id = v_city_id AND lang_id = 'c_ru' AND name = v_route_name;
-- 	IF NOT FOUND THEN
-- 		RAISE EXCEPTION 'route name  % not found', v_route_name;
-- 	END IF;
--   ELSE
-- 	SELECT bus.routes.id INTO v_route_id FROM bus.routes WHERE city_id = v_city_id AND number = v_route_name;
-- 	IF NOT FOUND THEN
-- 		RAISE EXCEPTION 'route number % not found', v_route_name;
-- 	END IF;
--   END IF;
-- 
--   EXECUTE bus.set_route_timetable(v_route_id,direct,v_time_interval,v_time_frequancy,v_days);
--   
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;			
--================================================================================================================--
CREATE OR REPLACE FUNCTION bus.set_route_timetable_directboth(
						   route_id 	       bigint,
						   v_time_interval     time without time zone [],
						   v_time_frequancy    interval[],
						   v_days        day_enum[]      
						  )
  RETURNS void AS
$BODY$
DECLARE
BEGIN
  EXECUTE bus.set_route_timetable(route_id,B'0',v_time_interval,v_time_frequancy,v_days);
  EXECUTE bus.set_route_timetable(route_id,B'1',v_time_interval,v_time_frequancy,v_days);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;	          
--================================================================================================================--
CREATE OR REPLACE FUNCTION bus.set_route_timetable(
						   v_route_id 	       bigint,
						   direct              bit,
						   v_time_interval     time without time zone [],
						   v_time_frequancy    interval[],
						   v_days        day_enum[]       
						  )
  RETURNS void AS
$BODY$
DECLARE
 v_route_way_id bigint;
 v_day_id day_enum;
 v_route_daydroup_id bigint; 
 
 size_frequancy bigint;
 size_interval bigint;
 size_days bigint;
 i bigint;

BEGIN
 size_interval = array_upper(v_time_interval,1);
 size_frequancy = array_upper(v_time_frequancy,1);
 size_days =  array_upper(v_days,1);
 IF (size_interval<=0) OR (size_interval <> (size_frequancy +1)) THEN
    RAISE EXCEPTION 'dimantion error';
 END IF;
 
 SELECT id INTO v_route_way_id  FROM bus.route_ways 
				WHERE bus.route_ways.route_id = v_route_id AND bus.route_ways.direct_type = direct;
 IF NOT FOUND THEN
   RAISE EXCEPTION 'route_way  for route (id = %) not found', route_id;
 END IF;
 

 INSERT INTO bus.route_way_daygroups (id) VALUES(default)  returning id INTO v_route_daydroup_id;

 i := 1;
 WHILE i<= size_days LOOP
   INSERT INTO bus.route_way_days (route_daygroup_id,day_id,route_way_id) VALUES(v_route_daydroup_id,v_days[i],v_route_way_id);
   i:= i + 1;
 END LOOP;
  
 i := 1;
 WHILE i<= size_frequancy LOOP
   INSERT INTO bus.route_schedule (route_daygroup_id,time_a,time_b,time_frequancy)
                           VALUES (v_route_daydroup_id,v_time_interval[i],v_time_interval[i+1],v_time_frequancy[i]);
   i:= i + 1;
 END LOOP;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.add_last_station_to_route_ru(
--                                            v_city_name      character,
-- 					   v_route_name     character,
--                                            v_node_name      character,
-- 					   v_direct         bit,
-- 					   v_name_or_number bit
-- 					                 )
--   RETURNS void AS
-- $BODY$
-- DECLARE
--   v_route_id  bigint;
--   v_node_id   bigint;
--   v_city_id   bigint;
-- BEGIN
--     SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.lang_cities ON bus.cities.id = bus.lang_cities.city_id
-- 				      WHERE lang_id = 'c_ru' AND name = v_city_name;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'city % not found', ru_city_name;
--   END IF;
-- 
--   IF v_name_or_number = B'1' THEN
-- 	SELECT bus.routes.id INTO v_route_id FROM bus.routes JOIN bus.lang_routes ON bus.routes.id = bus.lang_routes.route_id
-- 				      WHERE  city_id = v_city_id AND lang_id = 'c_ru' AND name = v_route_name;
-- 	IF NOT FOUND THEN
-- 		RAISE EXCEPTION 'route name  % not found', v_route_name;
-- 	END IF;
--   ELSE
-- 	SELECT bus.routes.id INTO v_route_id FROM bus.routes WHERE city_id = v_city_id AND number = v_route_name;
-- 	IF NOT FOUND THEN
-- 		RAISE EXCEPTION 'route number % not found', v_route_name;
-- 	END IF;
--   END IF;
--   
--   SELECT bus.nodes.id INTO v_node_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- 				      WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = v_node_name;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'node % not found', v_node_name;
--   END IF;
--   
-- 
--   EXECUTE bus.add_last_station_to_route(v_route_id,v_node_id,v_direct);
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
				                 
--================================================================================================================--

CREATE OR REPLACE FUNCTION bus.add_last_station_to_route(
					   v_route_id        bigint,
                                           node_id           bigint,
					   direct            bit 
					                 )
  RETURNS void AS
$BODY$
DECLARE
 v_route_way_id  bigint;
 v_curr_node_id  bigint; 
 v_prev_node_id  bigint :=null; 
 node_index      bigint;

 v_prev_loc      geometry;
 v_curr_loc      geometry;
 
 v_distance      double precision :=0.0;
 v_time          interval:='0 minute';
 v_speed         double precision;
BEGIN


 SELECT id INTO v_route_way_id  FROM bus.route_ways 
				WHERE bus.route_ways.route_id = v_route_id AND bus.route_ways.direct_type = direct;
 IF NOT FOUND THEN
   RAISE EXCEPTION 'route_way  for "%" not found', route_ru_numb;
 END IF;

 SELECT count(*) INTO node_index FROM bus.route_way_nodes WHERE route_way_ID =v_route_way_id;

 SELECT id,location INTO v_curr_node_id,v_curr_loc  FROM bus.nodes WHERE id = node_id;
 
 IF node_index >0 THEN
   SELECT curr_node_id INTO v_prev_node_id FROM bus.route_way_nodes WHERE route_way_ID =v_route_way_id AND bus.route_way_nodes.index = node_index;

   SELECT location INTO v_prev_loc  FROM bus.nodes WHERE id = v_prev_node_id;

   v_distance  := st_distance_sphere(v_prev_loc,v_curr_loc) / 1000.0;

   v_speed := 1;
   SELECT bus.transport_types.ev_speed INTO v_speed FROM 
                     (SELECT route_type_id from bus.routes where id = v_route_id) as routeTable 
                     JOIN bus.route_types ON bus.route_types.id = routeTable.route_type_id
                     JOIN bus.transport_types ON bus.transport_types.id = bus.route_types.transport_id; 

                                                          
   v_time := (v_distance/v_speed*60)::text || ' minute';
 END IF;
 


    node_index := node_index + 1;	
  
  INSERT INTO bus.route_way_nodes (route_way_id,"index",prev_node_id,curr_node_id,distance,time) 
                            VALUES(v_route_way_id,node_index,v_prev_node_id,v_curr_node_id,v_distance,v_time);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
--================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.add_route_link_ru(
-- 					      ru_city_name      character,
--                                               node1_ru_name      character,
--                                               node2_ru_name      character,
--                                               v_route_type       bus.route_type_enum,
--                                               v_base_cost        money
-- 					     )
--   RETURNS void AS
-- $BODY$
-- DECLARE
--   v_route_id        bigint;
--   v_node1_id        bigint;
--   v_node2_id        bigint;
--   v_city_id         bigint;
-- BEGIN
--   SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.lang_cities ON bus.cities.id = bus.lang_cities.city_id
-- 				      WHERE lang_id = 'c_ru' AND name = ru_city_name;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'city % not found', ru_city_name;
--   END IF;
-- 
--   SELECT bus.nodes.id INTO v_node1_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- 				      WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = node1_ru_name;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'node % not found', node1_ru_name;
--   END IF;
-- 
--   SELECT bus.nodes.id INTO v_node2_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- 				      WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = node2_ru_name;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'node % not found', node2_ru_name;
--   END IF;
-- 
--   v_route_id:= bus.add_route_link(v_city_id,v_node1_id,v_node2_id,v_route_type,v_base_cost);
--   
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
--================================================================================================================--
CREATE OR REPLACE FUNCTION bus.add_route_link(
					      v_city_id       bigint,
                                              node1_id      bigint,
                                              node2_id      bigint,
                                              v_route_type    bus.route_type_enum,
                                              v_base_cost   money
					     )
  RETURNS bigint AS
$BODY$
DECLARE
  v_route_id       bigint;
  v_way1_id        bigint;
  v_way2_id        bigint;
  v_distance       double precision;
  v_speed          double precision;
  v_time           interval;
  v_node1_loc      geometry;
  v_node2_loc      geometry;  
BEGIN
  SELECT location INTO v_node1_loc  FROM bus.nodes WHERE id = node1_id;
  IF NOT FOUND THEN
     RAISE EXCEPTION 'location (id = %) was not found', v_node1_loc;
  END IF; 
 
  SELECT location INTO v_node2_loc  FROM bus.nodes WHERE id = node2_id;
  IF NOT FOUND THEN
     RAISE EXCEPTION 'location (id = %) was not found', v_node2_loc;
  END IF; 

  SELECT bus.transport_types.ev_speed INTO v_speed FROM bus.route_types JOIN bus.transport_types ON
                                      bus.route_types.transport_id = bus.transport_types.id
                                      WHERE bus.route_types.id = v_route_type;
  IF NOT FOUND THEN
   RAISE EXCEPTION 'transport_type-route_type (id = %) was not found', v_route_type;
 END IF;   
  
  v_distance  := st_distance_sphere(v_node1_loc,v_node2_loc) / 1000.0;
  v_speed := 1;
  v_time := (v_distance/v_speed*60)::text || ' minute';
   



 INSERT INTO bus.routes (city_id,route_type_id,number,base_cost) 
                 VALUES (v_city_id,v_route_type,NULL,v_base_cost) RETURNING id INTO v_route_id;
 INSERT INTO bus.route_ways(route_id,direct_type) VALUES (v_route_id,B'0') RETURNING id INTO v_way1_id;
 INSERT INTO bus.route_ways(route_id,direct_type) VALUES (v_route_id,B'1') RETURNING id INTO v_way2_id;

 INSERT INTO bus.route_way_nodes (route_way_id, prev_node_id,curr_node_id,distance,time,index) 
                           VALUES(v_way1_id,NULL,node1_id,v_distance,v_time,1);
 INSERT INTO bus.route_way_nodes (route_way_id, prev_node_id,curr_node_id,distance,time,index) 
                           VALUES(v_way1_id,node1_id,node2_id,v_distance,v_time,2);                           

 INSERT INTO bus.route_way_nodes (route_way_id, prev_node_id,curr_node_id,distance,time,index) 
                           VALUES(v_way2_id,NULL,node2_id,v_distance,v_time,1);
 INSERT INTO bus.route_way_nodes (route_way_id, prev_node_id,curr_node_id,distance,time,index) 
                           VALUES(v_way2_id,node2_id,node1_id,v_distance,v_time,2);     
                            

  return v_route_id;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
--================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.add_route_with_names(
-- 						ru_city_name  character,
-- 						number        character,
-- 						v_langs       lang_enum[],
-- 					        v_names       text[],
-- 						route_type    bus.route_type_enum,
-- 						v_base_cost   money
-- 					      )
--   RETURNS void AS
-- $BODY$
-- DECLARE
--  v_city_id   bigint;
--  v_route_id  bigint;
--  i           integer;
--  size_langs  integer;
--  size_names  integer;
-- BEGIN
--  size_langs = array_upper(v_langs,1);
--  size_names = array_upper(v_names,1);
--  IF size_langs<>size_names THEN
--    RAISE EXCEPTION 'dimention of input parameters is failed';
--  END IF;
--  
--  SELECT city_id INTO v_city_id FROM bus.lang_cities  WHERE name = ru_city_name AND lang_id = 'c_ru';
--  IF NOT FOUND THEN
--    RAISE EXCEPTION 'city % not found', ru_city_name;
--  END IF; 
-- 
--  v_route_id := bus.add_route(v_city_id,number,route_type,v_base_cost);
-- 
--  i:=1;
--  WHILE i<=size_langs LOOP
--     INSERT INTO bus.lang_routes(lang_id,route_id,name) VALUES(v_langs[i],v_route_id,v_names[i]);
--     i:= i+1;
--  END LOOP;
-- 
--  
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
  
--================================================================================================================--

CREATE OR REPLACE FUNCTION bus.add_route(
                                           v_city_id 	       bigint,
					   route_number        character,
					   route_type          bus.route_type_enum,
					   v_base_cost         money
					)
  RETURNS bigint AS
$BODY$
DECLARE
 v_route_id bigint; -- id from table 'node_types' variable "m_station"
 v_route_type_id bigint; -- id after inserting new node to table 'nodes'
BEGIN


 INSERT INTO bus.routes (city_id,route_type_id,number,base_cost) 
                 VALUES (v_city_id,route_type,route_number,v_base_cost) 
                                                                  RETURNING id INTO v_route_id;

 INSERT INTO bus.route_ways(route_id,direct_type) VALUES (v_route_id,B'0');
 INSERT INTO bus.route_ways(route_id,direct_type) VALUES (v_route_id,B'1');
 RETURN v_route_id;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--================================================================================================================--
CREATE OR REPLACE FUNCTION bus.add_station(langs lang_enum[],
					   station_names text[],
					   ru_city_name character,
					   lat double precision,
					   lon double precision,
					   use_trolley bit,
					   use_metro bit,
					   use_tram bit,
					   use_bus bit
					    )
				 RETURNS void AS
$BODY$
DECLARE
	v_city_id bigint;
BEGIN
  SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.lang_cities ON bus.cities.id = bus.lang_cities.city_id
				      WHERE lang_id = 'c_ru' AND name = ru_city_name;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'city % not found', ru_city_name;
  END IF;
  EXECUTE bus.add_station(langs,station_names,v_city_id,lat,lon,use_trolley,use_metro,use_tram,use_bus);
END;
$BODY$
LANGUAGE plpgsql VOLATILE 
 COST 100;
				 	    
-- CREATE OR REPLACE FUNCTION bus.add_station(langs lang_enum[],
-- 					   station_names text[],
-- 					   v_city_id bigint,
-- 					   lat double precision,
-- 					   lon double precision,
-- 					   use_trolley bit,
-- 					   use_metro bit,
-- 					   use_tram bit,
-- 					   use_bus bit
-- 					    )
--   RETURNS void AS
-- $BODY$
-- DECLARE
--  v_node_id   bigint; -- id after inserting new node to table 'nodes'
--  loc         text;
--  i           smallint;
--  v_lang_size smallint;
--  v_name_size smallint;  
-- BEGIN
-- 
--  v_lang_size := array_upper(langs,1);
--  v_name_size := array_upper(station_names,1);
-- 
--  IF v_lang_size<>v_name_size THEN
--    RAISE EXCEPTION 'dimention of input parameters is failed';
--  END IF;
-- 
--  loc := 'POINT('||lat::text || ' '||lon::text || ')';
--  INSERT INTO bus.nodes (city_id,type_id,location) 
--                 VALUES (v_city_id,'c_station',GeomFromText(loc,4326)) 
--                                                                   RETURNING id INTO v_node_id;
--  i:= 1;
--  WHILE i <= v_lang_size LOOP
--         INSERT INTO bus.lang_nodes (lang_id,node_id,name) VALUES(langs[i],v_node_id,station_names[i]);        	
-- 	i := i + 1;
--  END LOOP;
--  
--  IF use_trolley = B'1' THEN
--    INSERT INTO bus.node_transports (node_id,transport_type_id) 
--          VALUES (v_node_id,'c_trolley');
--  END IF;
-- 
--  IF use_metro = B'1' THEN
--    INSERT INTO bus.node_transports (node_id,transport_type_id) 
--          VALUES (v_node_id,'c_metro');
--  END IF;
--  
--  IF use_tram = B'1' THEN
--    INSERT INTO bus.node_transports (node_id,transport_type_id) 
--          VALUES (v_node_id,'c_tram');
--  END IF;
-- 
--  IF use_bus = B'1' THEN
--    INSERT INTO bus.node_transports (node_id,transport_type_id) 
--          VALUES (v_node_id,'c_bus');
--  END IF; 
--  
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;



--================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.add_route_type(v_ru_name  character,v_en_name  character,route_variable  character, transport_variable character)
--   RETURNS void AS
-- $BODY$
-- DECLARE
--  v_transport_type_id integer;
-- BEGIN
--  SELECT id INTO v_transport_type_id FROM bus.transport_types WHERE  variable = transport_variable;
--  insert into bus.route_types (transport_type_id,ru_name,en_name,variable) VALUES(v_transport_type_id,v_ru_name,v_en_name,route_variable);
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- ALTER FUNCTION bus.add_route_type(character,character,character,character) OWNER TO postgres;
--================================================================================================================--
-- 
-- CREATE OR REPLACE FUNCTION bus.fill_calc_relations()
--   RETURNS void AS
-- $BODY$
-- DECLARE
-- 
-- BEGIN
-- 
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- ALTER FUNCTION bus.fill_calc_relations() OWNER TO postgres;
-- 
-- 
-- 
-- CREATE OR REPLACE FUNCTION bus.add_city(
--                                            v_langs lang_enum[],
--                                            v_names text[]
-- 					)
-- 					RETURNS void AS
-- $BODY$
-- DECLARE
--  i integer;
--  size_langs integer;
--  size_names integer;
--  v_city_id integer;
-- BEGIN
--  size_langs = array_upper(v_langs,1);
--  size_names = array_upper(v_names,1);
--  IF size_langs<>size_names THEN
--    RAISE EXCEPTION 'dimention of input parameters is failed';
--  END IF;
--  i:=1;
-- 
--  INSERT INTO bus.cities (id) VALUES(DEFAULT) RETURNING id INTO v_city_id;
-- 
--  WHILE i<=size_langs LOOP
--     INSERT INTO bus.lang_cities(city_id,lang_id,name) VALUES(v_city_id,v_langs[i],v_names[i]);
--     i:= i+1;
--  END LOOP;
-- 
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- ALTER FUNCTION bus.add_route_type(character,character,character,character) OWNER TO postgres;
-- 
-- 
-- 
-- 
-- 
--   a :=0;
-- 
-- 
-- END;
-- 
-- DROP TYPE bus.markers;
-- DROP TYPE bus.short_path;
-- 
-- CREATE TYPE bus.short_path AS
--    (route_way_id bigint,
--     station_id bigint,
--     ind bigint,
--     time_in                   time without time zone,
--     station_delay             interval,
--     money_cost                 money
--     );
-- CREATE TYPE bus.markers AS
-- (
--                 node_id                    bigint,
--                 time_in                    time without time zone,
--                 node_delay                 interval,
--                 
--                 prev_route_way_node_id     bigint,
--                 prev_route_type_id         bus.route_type_enum,
--                 prev_route_way_id          bigint,
--                 prev_node_id               bigint,
--                  
--                 cost       	           double  precision,
--                 money_cost 	           money,
--                 time_cost 	           interval,
--                 is_visit 	           bit
-- 
-- );

--=================================================================================================================--
-- 
-- CREATE OR REPLACE FUNCTION bus.fill_markers_table(curr_node bigint)
--   RETURNS void AS
-- $BODY$
-- DECLARE
--  node_record            bus.route_way_nodes%ROWTYPE;
--  v_count bigint:=0;
-- BEGIN
--      FOR node_record IN SELECT * FROM bus.route_way_nodes WHERE prev_node_id = curr_node  LOOP
--         SELECT count(*) INTO  v_count FROM markers_table WHERE node_id = node_record.curr_node_id;
--         IF  v_count=0 THEN
-- 		INSERT INTO markers_table (node_id) VALUES (node_record.curr_node_id);
-- 		EXECUTE bus.fill_markers_table(node_record.curr_node_id);
--         END IF;
--   END LOOP;
-- 
--   
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;					   
-- --=================================================================================================================--  
-- CREATE OR REPLACE FUNCTION bus.calc_dejkstra(
-- 						   v_stationA_id        bigint,
-- 						   v_stationB_id        bigint,
-- 						   v_day_id              day_enum,
-- 						   time_start            time without time zone,
-- 						   optimize              bigint
-- 						  )
--   RETURNS SETOF bus.short_path AS
-- $BODY$
-- DECLARE
--  shortestway 		bus.short_path;
--  tmp_elem    		bus.short_path;
--  marker_record          bus.markers;
--  curr_marker_record     bus.markers;
--  node_way_record        bus.route_way_nodes%ROWTYPE;
--  node_way_ex_rec        record;
--  v_route_metro_id             bigint;
--  v_route_metro_transition_id  bigint;
--  v_visit_count                bigint:=0;
--  v_node_count                 bigint;
--  v_min_node                   bigint;
--  v_index                      bigint;
--  v_opt                        double precision := 1.0 / optimize;
--  v_time_in                    time without time zone;
--  v_curr_node                  bigint;
--  v_node_delay                 interval;           
-- BEGIN
--  -- create temporary tables for storage data to RAM
--   BEGIN 
--        -- DROP TABLE markers_table;
--         CREATE TEMPORARY TABLE markers_table (
--                 node_id      	   bigint,
--                 time_in                    time without time zone,
--                 node_delay                 interval,
--                 
--                 prev_route_way_node_id     bigint  DEFAULT -1,
--                 prev_route_type_id         bus.route_type_enum  DEFAULT NULL,    
--                 prev_route_way_id          bigint  DEFAULT -1,
--                 prev_node_id               bigint  DEFAULT -1,
--                 
--                 cost       	           double  precision  DEFAULT 999999999.0,
--                 money_cost 	           money,
--                 time_cost 	           interval DEFAULT '0 minute',
--                 is_visit 	           bit DEFAULT B'0'
-- 
--         );
-- 
-- 
-- 		       
--     EXCEPTION WHEN OTHERS THEN 
--         TRUNCATE TABLE markers_table; -- TRUNCATE if the table already exists within the session.
--   END;
--   
--   BEGIN 
--      --   DROP TABLE short_way_table;
--         CREATE TEMPORARY TABLE short_way_table (
-- 		route_way_id 	bigint,
-- 		station_id 	bigint,
-- 		ind 		bigint,
-- 		time_in         time without time zone,
-- 		station_delay   interval,
-- 		money_cost      money
--          );
--         EXCEPTION WHEN OTHERS THEN
--           TRUNCATE TABLE short_way_table; 
--   END;
--       
--   -- fill markers table
--   EXECUTE bus.fill_markers_table(v_stationA_id);
-- 
-- 
--    v_node_delay := '0 minute';
--    curr_marker_record.node_id := v_stationA_id;
--    curr_marker_record.cost := 0;
--    curr_marker_record.time_in = time_start;
-- 
--    UPDATE  markers_table SET cost = 0.0, time_in = time_start,node_delay = v_node_delay
--                         WHERE node_id = curr_marker_record.node_id;
-- 
--    SELECT count(*) INTO v_node_count FROM markers_table;
--    
--    
--   WHILE v_visit_count < v_node_count LOOP
--      UPDATE  markers_table SET is_visit = B'1' WHERE node_id = curr_marker_record.node_id;
--      FOR node_way_ex_rec IN SELECT prev_node_id,curr_node_id,route_way_id,route_type_id,bus.route_way_nodes.id as id,time,distance
--       FROM bus.route_way_nodes
--                                      JOIN bus.route_ways ON bus.route_ways.id = bus.route_way_nodes.route_way_id
--                                      JOIN bus.routes ON bus.routes.id =  bus.route_ways.route_id
--                                      WHERE prev_node_id = curr_marker_record.node_id  
-- 
--       LOOP
--         SELECT * INTO marker_record FROM markers_table WHERE node_id = node_way_ex_rec.curr_node_id;
--         --v_time_wait
--         IF (node_way_ex_rec.route_way_id = curr_marker_record.prev_route_way_id)
--          THEN
--             v_node_delay := '7 sec';
--         ELSE
--             v_node_delay := '1 minute';
--         END IF;
--         
--         v_time_in := curr_marker_record.time_in + node_way_ex_rec.time + v_node_delay;
--        
--         --RAISE NOTICE 'time: %', curr_marker_record;
--         IF marker_record.cost> curr_marker_record.cost + node_way_ex_rec.distance THEN
--           UPDATE  markers_table SET cost = (curr_marker_record.cost + node_way_ex_rec.distance),
--                                   
--                                     time_in = v_time_in,
--                                     node_delay = v_node_delay,
-- 
-- 				    prev_node_id = node_way_ex_rec.prev_node_id,
--                                     prev_route_way_id = node_way_ex_rec.route_way_id,
--                                     prev_route_way_node_id = node_way_ex_rec.id,
--                                     prev_route_type_id = node_way_ex_rec.route_type_id
--                                  WHERE node_id = node_way_ex_rec.curr_node_id;
--         END IF; 
--         
--      END LOOP;
--     --v_tmp_cost
-- 
--     
--     SELECT * INTO curr_marker_record FROM markers_table WHERE is_visit = B'0' AND
--                         cost = (select min(cost) FROM markers_table WHERE is_visit = B'0') ;
--     v_visit_count := v_visit_count + 1;  
--   END LOOP;
-- 
-- 
-- 
--  
--   -- find shortest way
--     DELETE FROM  short_way_table;
-- 
--     v_curr_node := v_stationB_id;
-- 
--     
--     
--     v_index :=0;
--     WHILE v_curr_node <>-1 AND v_index<=v_node_count LOOP
--         
--         SELECT * INTO marker_record FROM markers_table WHERE node_id =  v_curr_node;
--         IF marker_record.prev_route_way_node_id >=0 THEN
--           INSERT INTO short_way_table (route_way_id,station_id,ind,time_in,station_delay,money_cost) 
--                                VALUES (marker_record.prev_route_way_node_id,v_curr_node,
--                                        v_index,marker_record.time_in,marker_record.node_delay,marker_record.money_cost);
--         END IF;
--         v_curr_node := marker_record.prev_node_id;
--         v_index := v_index + 1;
--         
--     END LOOP;
-- 
--   
-- 
--   -- return table
--   FOR shortestway IN SELECT * FROM short_way_table LOOP
--         RETURN NEXT shortestway;
--   END LOOP;
--    
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- 
-- --=================================================================================================================--
-- -- CREATE OR REPLACE FUNCTION bus.calc_dejkstra_lang(
-- -- 						   lang             lang_enum,
-- -- 						   city_name        character,
-- -- 						   station_A        character,
-- -- 						   station_B        character,
-- -- 						   v_day            day_enum,
-- -- 						   time_start       time without time zone,
-- -- 						   optimize         bigint
-- -- 						   )
-- --   RETURNS SETOF bus.short_path AS
-- -- $BODY$
-- -- DECLARE
-- -- v_city_id           bigint;
-- -- station_A_id        bigint;
-- -- station_B_id        bigint;
-- -- path                bus.short_path;						   
-- -- BEGIN
-- --     SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.string_keys ON bus.string_keys.id = bus.cities.name_key 
-- --                                                         JOIN bus.string_values ON bus.string_values.key_id = bus.string_keys.id
-- -- 				      WHERE bus.string_values.lang_id = lang AND bus.string_values.value = city_name;
-- --   IF NOT FOUND THEN
-- --     RAISE EXCEPTION 'city % not found', ru_city_name;
-- --   END IF;
-- -- 
-- --   
-- --   SELECT bus.nodes.id INTO station_A_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- -- 				        WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = station_A;
-- --   IF NOT FOUND THEN
-- --     RAISE EXCEPTION 'node % not found', station_A;
-- --   END IF;
-- --   				        
-- --   SELECT bus.nodes.id INTO station_B_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- -- 				        WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = station_B;
-- --   IF NOT FOUND THEN
-- --     RAISE EXCEPTION 'node % not found', station_B;
-- --   END IF;
-- -- 
-- --   FOR path IN SELECT * FROM bus.calc_dejkstra(station_A_id,station_B_id,v_day,time_start,optimize) LOOP
-- --      RETURN NEXT path;
-- --   END LOOP;	      				      
-- --   
-- -- END;
-- -- $BODY$
-- -- LANGUAGE plpgsql VOLATILE  COST 100;
--   
-- --================================================================================================================--
-- -- CREATE OR REPLACE FUNCTION bus.set_route_timetable_directboth_ru(
-- -- 						   v_city_name        character,
-- -- 						   v_route_name          character,
-- -- 						   v_name_or_number    bit,
-- -- 						   v_time_interval     time without time zone [],
-- -- 						   v_time_frequancy    interval[],
-- -- 						   v_days              day_enum[]
-- -- 						  )
-- --   RETURNS void AS
-- -- $BODY$
-- -- DECLARE
-- -- BEGIN
-- --   EXECUTE bus.set_route_timetable_ru(v_city_name,v_route_name,B'0',v_name_or_number,v_time_interval,v_time_frequancy,v_days);
-- --   EXECUTE bus.set_route_timetable_ru(v_city_name,v_route_name,B'1',v_name_or_number,v_time_interval,v_time_frequancy,v_days);
-- --   
-- -- END;
-- -- $BODY$
-- --   LANGUAGE plpgsql VOLATILE
-- --   COST 100;	
-- --================================================================================================================--
-- 
-- -- CREATE OR REPLACE FUNCTION bus.set_route_timetable_ru(
-- -- 						   v_city_name        character,
-- -- 						   v_route_name          character,
-- -- 						   direct              bit,
-- -- 						   v_name_or_number    bit,
-- -- 						   v_time_interval     time without time zone [],
-- -- 						   v_time_frequancy    interval[],
-- -- 						   v_days              day_enum[]
-- -- 						   )
-- --   RETURNS void AS
-- -- $BODY$
-- -- DECLARE
-- --   v_route_id  bigint;
-- --   v_city_id   bigint;
-- -- BEGIN
-- --     SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.lang_cities ON bus.cities.id = bus.lang_cities.city_id
-- -- 				      WHERE lang_id = 'c_ru' AND name = v_city_name;
-- --   IF NOT FOUND THEN
-- --     RAISE EXCEPTION 'city % not found', ru_city_name;
-- --   END IF;
-- -- 
-- --   IF v_name_or_number = B'1' THEN
-- -- 	SELECT bus.routes.id INTO v_route_id FROM bus.routes JOIN bus.lang_routes ON bus.routes.id = bus.lang_routes.route_id
-- -- 				      WHERE  city_id = v_city_id AND lang_id = 'c_ru' AND name = v_route_name;
-- -- 	IF NOT FOUND THEN
-- -- 		RAISE EXCEPTION 'route name  % not found', v_route_name;
-- -- 	END IF;
-- --   ELSE
-- -- 	SELECT bus.routes.id INTO v_route_id FROM bus.routes WHERE city_id = v_city_id AND number = v_route_name;
-- -- 	IF NOT FOUND THEN
-- -- 		RAISE EXCEPTION 'route number % not found', v_route_name;
-- -- 	END IF;
-- --   END IF;
-- -- 
-- --   EXECUTE bus.set_route_timetable(v_route_id,direct,v_time_interval,v_time_frequancy,v_days);
-- --   
-- -- END;
-- -- $BODY$
-- --   LANGUAGE plpgsql VOLATILE
-- --   COST 100;			
-- --================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.set_route_timetable_directboth(
-- 						   route_id 	       bigint,
-- 						   v_time_interval     time without time zone [],
-- 						   v_time_frequancy    interval[],
-- 						   v_days        day_enum[]      
-- 						  )
--   RETURNS void AS
-- $BODY$
-- DECLARE
-- BEGIN
--   EXECUTE bus.set_route_timetable(route_id,B'0',v_time_interval,v_time_frequancy,v_days);
--   EXECUTE bus.set_route_timetable(route_id,B'1',v_time_interval,v_time_frequancy,v_days);
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;	          
-- --================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.set_route_timetable(
-- 						   v_route_id 	       bigint,
-- 						   direct              bit,
-- 						   v_time_interval     time without time zone [],
-- 						   v_time_frequancy    interval[],
-- 						   v_days        day_enum[]       
-- 						  )
--   RETURNS void AS
-- $BODY$
-- DECLARE
--  v_route_way_id bigint;
--  v_day_id day_enum;
--  v_route_daydroup_id bigint; 
--  
--  size_frequancy bigint;
--  size_interval bigint;
--  size_days bigint;
--  i bigint;
-- 
-- BEGIN
--  size_interval = array_upper(v_time_interval,1);
--  size_frequancy = array_upper(v_time_frequancy,1);
--  size_days =  array_upper(v_days,1);
--  IF (size_interval<=0) OR (size_interval <> (size_frequancy +1)) THEN
--     RAISE EXCEPTION 'dimantion error';
--  END IF;
--  
--  SELECT id INTO v_route_way_id  FROM bus.route_ways 
-- 				WHERE bus.route_ways.route_id = v_route_id AND bus.route_ways.direct_type = direct;
--  IF NOT FOUND THEN
--    RAISE EXCEPTION 'route_way  for route (id = %) not found', route_id;
--  END IF;
--  
-- 
--  INSERT INTO bus.route_way_daygroups (id) VALUES(default)  returning id INTO v_route_daydroup_id;
-- 
--  i := 1;
--  WHILE i<= size_days LOOP
--    INSERT INTO bus.route_way_days (route_daygroup_id,day_id,route_way_id) VALUES(v_route_daydroup_id,v_days[i],v_route_way_id);
--    i:= i + 1;
--  END LOOP;
--   
--  i := 1;
--  WHILE i<= size_frequancy LOOP
--    INSERT INTO bus.route_schedule (route_daygroup_id,time_a,time_b,time_frequancy)
--                            VALUES (v_route_daydroup_id,v_time_interval[i],v_time_interval[i+1],v_time_frequancy[i]);
--    i:= i + 1;
--  END LOOP;
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- 
-- --================================================================================================================--
-- -- CREATE OR REPLACE FUNCTION bus.add_last_station_to_route_ru(
-- --                                            v_city_name      character,
-- -- 					   v_route_name     character,
-- --                                            v_node_name      character,
-- -- 					   v_direct         bit,
-- -- 					   v_name_or_number bit
-- -- 					                 )
-- --   RETURNS void AS
-- -- $BODY$
-- -- DECLARE
-- --   v_route_id  bigint;
-- --   v_node_id   bigint;
-- --   v_city_id   bigint;
-- -- BEGIN
-- --     SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.lang_cities ON bus.cities.id = bus.lang_cities.city_id
-- -- 				      WHERE lang_id = 'c_ru' AND name = v_city_name;
-- --   IF NOT FOUND THEN
-- --     RAISE EXCEPTION 'city % not found', ru_city_name;
-- --   END IF;
-- -- 
-- --   IF v_name_or_number = B'1' THEN
-- -- 	SELECT bus.routes.id INTO v_route_id FROM bus.routes JOIN bus.lang_routes ON bus.routes.id = bus.lang_routes.route_id
-- -- 				      WHERE  city_id = v_city_id AND lang_id = 'c_ru' AND name = v_route_name;
-- -- 	IF NOT FOUND THEN
-- -- 		RAISE EXCEPTION 'route name  % not found', v_route_name;
-- -- 	END IF;
-- --   ELSE
-- -- 	SELECT bus.routes.id INTO v_route_id FROM bus.routes WHERE city_id = v_city_id AND number = v_route_name;
-- -- 	IF NOT FOUND THEN
-- -- 		RAISE EXCEPTION 'route number % not found', v_route_name;
-- -- 	END IF;
-- --   END IF;
-- --   
-- --   SELECT bus.nodes.id INTO v_node_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- -- 				      WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = v_node_name;
-- --   IF NOT FOUND THEN
-- --     RAISE EXCEPTION 'node % not found', v_node_name;
-- --   END IF;
-- --   
-- -- 
-- --   EXECUTE bus.add_last_station_to_route(v_route_id,v_node_id,v_direct);
-- -- END;
-- -- $BODY$
-- --   LANGUAGE plpgsql VOLATILE
-- --   COST 100;
-- 				                 
-- --================================================================================================================--
-- 
-- CREATE OR REPLACE FUNCTION bus.add_last_station_to_route(
-- 					   v_route_id        bigint,
--                                            node_id           bigint,
-- 					   direct            bit 
-- 					                 )
--   RETURNS void AS
-- $BODY$
-- DECLARE
--  v_route_way_id  bigint;
--  v_curr_node_id  bigint; 
--  v_prev_node_id  bigint :=null; 
--  node_index      bigint;
-- 
--  v_prev_loc      geometry;
--  v_curr_loc      geometry;
--  
--  v_distance      double precision :=0.0;
--  v_time          interval:='0 minute';
--  v_speed         double precision;
-- BEGIN
-- 
-- 
--  SELECT id INTO v_route_way_id  FROM bus.route_ways 
-- 				WHERE bus.route_ways.route_id = v_route_id AND bus.route_ways.direct_type = direct;
--  IF NOT FOUND THEN
--    RAISE EXCEPTION 'route_way  for "%" not found', route_ru_numb;
--  END IF;
-- 
--  SELECT count(*) INTO node_index FROM bus.route_way_nodes WHERE route_way_ID =v_route_way_id;
-- 
--  SELECT id,location INTO v_curr_node_id,v_curr_loc  FROM bus.nodes WHERE id = node_id;
--  
--  IF node_index >0 THEN
--    SELECT curr_node_id INTO v_prev_node_id FROM bus.route_way_nodes WHERE route_way_ID =v_route_way_id AND bus.route_way_nodes.index = node_index;
-- 
--    SELECT location INTO v_prev_loc  FROM bus.nodes WHERE id = v_prev_node_id;
-- 
--    v_distance  := st_distance_sphere(v_prev_loc,v_curr_loc) / 1000.0;
-- 
--    v_speed := 1;
--    SELECT bus.transport_types.ev_speed INTO v_speed FROM 
--                      (SELECT route_type_id from bus.routes where id = v_route_id) as routeTable 
--                      JOIN bus.route_types ON bus.route_types.id = routeTable.route_type_id
--                      JOIN bus.transport_types ON bus.transport_types.id = bus.route_types.transport_id; 
-- 
--                                                           
--    v_time := (v_distance/v_speed*60)::text || ' minute';
--  END IF;
--  
-- 
-- 
--     node_index := node_index + 1;	
--   
--   INSERT INTO bus.route_way_nodes (route_way_id,"index",prev_node_id,curr_node_id,distance,time) 
--                             VALUES(v_route_way_id,node_index,v_prev_node_id,v_curr_node_id,v_distance,v_time);
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- --================================================================================================================--
-- -- CREATE OR REPLACE FUNCTION bus.add_route_link_ru(
-- -- 					      ru_city_name      character,
-- --                                               node1_ru_name      character,
-- --                                               node2_ru_name      character,
-- --                                               v_route_type       bus.route_type_enum,
-- --                                               v_base_cost        money
-- -- 					     )
-- --   RETURNS void AS
-- -- $BODY$
-- -- DECLARE
-- --   v_route_id        bigint;
-- --   v_node1_id        bigint;
-- --   v_node2_id        bigint;
-- --   v_city_id         bigint;
-- -- BEGIN
-- --   SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.lang_cities ON bus.cities.id = bus.lang_cities.city_id
-- -- 				      WHERE lang_id = 'c_ru' AND name = ru_city_name;
-- --   IF NOT FOUND THEN
-- --     RAISE EXCEPTION 'city % not found', ru_city_name;
-- --   END IF;
-- -- 
-- --   SELECT bus.nodes.id INTO v_node1_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- -- 				      WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = node1_ru_name;
-- --   IF NOT FOUND THEN
-- --     RAISE EXCEPTION 'node % not found', node1_ru_name;
-- --   END IF;
-- -- 
-- --   SELECT bus.nodes.id INTO v_node2_id FROM bus.nodes JOIN bus.lang_nodes ON bus.nodes.id = bus.lang_nodes.node_id
-- -- 				      WHERE city_id = v_city_id AND lang_id = 'c_ru' AND name = node2_ru_name;
-- --   IF NOT FOUND THEN
-- --     RAISE EXCEPTION 'node % not found', node2_ru_name;
-- --   END IF;
-- -- 
-- --   v_route_id:= bus.add_route_link(v_city_id,v_node1_id,v_node2_id,v_route_type,v_base_cost);
-- --   
-- -- END;
-- -- $BODY$
-- --   LANGUAGE plpgsql VOLATILE
-- --   COST 100;
-- --================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.add_route_link(
-- 					      v_city_id       bigint,
--                                               node1_id      bigint,
--                                               node2_id      bigint,
--                                               v_route_type    bus.route_type_enum,
--                                               v_base_cost   money
-- 					     )
--   RETURNS bigint AS
-- $BODY$
-- DECLARE
--   v_route_id       bigint;
--   v_way1_id        bigint;
--   v_way2_id        bigint;
--   v_distance       double precision;
--   v_speed          double precision;
--   v_time           interval;
--   v_node1_loc      geometry;
--   v_node2_loc      geometry;  
-- BEGIN
--   SELECT location INTO v_node1_loc  FROM bus.nodes WHERE id = node1_id;
--   IF NOT FOUND THEN
--      RAISE EXCEPTION 'location (id = %) was not found', v_node1_loc;
--   END IF; 
--  
--   SELECT location INTO v_node2_loc  FROM bus.nodes WHERE id = node2_id;
--   IF NOT FOUND THEN
--      RAISE EXCEPTION 'location (id = %) was not found', v_node2_loc;
--   END IF; 
-- 
--   SELECT bus.transport_types.ev_speed INTO v_speed FROM bus.route_types JOIN bus.transport_types ON
--                                       bus.route_types.transport_id = bus.transport_types.id
--                                       WHERE bus.route_types.id = v_route_type;
--   IF NOT FOUND THEN
--    RAISE EXCEPTION 'transport_type-route_type (id = %) was not found', v_route_type;
--  END IF;   
--   
--   v_distance  := st_distance_sphere(v_node1_loc,v_node2_loc) / 1000.0;
--   v_speed := 1;
--   v_time := (v_distance/v_speed*60)::text || ' minute';
--    
-- 
-- 
-- 
--  INSERT INTO bus.routes (city_id,route_type_id,number,base_cost) 
--                  VALUES (v_city_id,v_route_type,NULL,v_base_cost) RETURNING id INTO v_route_id;
--  INSERT INTO bus.route_ways(route_id,direct_type) VALUES (v_route_id,B'0') RETURNING id INTO v_way1_id;
--  INSERT INTO bus.route_ways(route_id,direct_type) VALUES (v_route_id,B'1') RETURNING id INTO v_way2_id;
-- 
--  INSERT INTO bus.route_way_nodes (route_way_id, prev_node_id,curr_node_id,distance,time,index) 
--                            VALUES(v_way1_id,NULL,node1_id,v_distance,v_time,1);
--  INSERT INTO bus.route_way_nodes (route_way_id, prev_node_id,curr_node_id,distance,time,index) 
--                            VALUES(v_way1_id,node1_id,node2_id,v_distance,v_time,2);                           
-- 
--  INSERT INTO bus.route_way_nodes (route_way_id, prev_node_id,curr_node_id,distance,time,index) 
--                            VALUES(v_way2_id,NULL,node2_id,v_distance,v_time,1);
--  INSERT INTO bus.route_way_nodes (route_way_id, prev_node_id,curr_node_id,distance,time,index) 
--                            VALUES(v_way2_id,node2_id,node1_id,v_distance,v_time,2);     
--                             
-- 
--   return v_route_id;
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- --================================================================================================================--
-- -- CREATE OR REPLACE FUNCTION bus.add_route_with_names(
-- -- 						ru_city_name  character,
-- -- 						number        character,
-- -- 						v_langs       lang_enum[],
-- -- 					        v_names       text[],
-- -- 						route_type    bus.route_type_enum,
-- -- 						v_base_cost   money
-- -- 					      )
-- --   RETURNS void AS
-- -- $BODY$
-- -- DECLARE
-- --  v_city_id   bigint;
-- --  v_route_id  bigint;
-- --  i           integer;
-- --  size_langs  integer;
-- --  size_names  integer;
-- -- BEGIN
-- --  size_langs = array_upper(v_langs,1);
-- --  size_names = array_upper(v_names,1);
-- --  IF size_langs<>size_names THEN
-- --    RAISE EXCEPTION 'dimention of input parameters is failed';
-- --  END IF;
-- --  
-- --  SELECT city_id INTO v_city_id FROM bus.lang_cities  WHERE name = ru_city_name AND lang_id = 'c_ru';
-- --  IF NOT FOUND THEN
-- --    RAISE EXCEPTION 'city % not found', ru_city_name;
-- --  END IF; 
-- -- 
-- --  v_route_id := bus.add_route(v_city_id,number,route_type,v_base_cost);
-- -- 
-- --  i:=1;
-- --  WHILE i<=size_langs LOOP
-- --     INSERT INTO bus.lang_routes(lang_id,route_id,name) VALUES(v_langs[i],v_route_id,v_names[i]);
-- --     i:= i+1;
-- --  END LOOP;
-- -- 
-- --  
-- -- END;
-- -- $BODY$
-- --   LANGUAGE plpgsql VOLATILE
-- --   COST 100;
--   
-- --================================================================================================================--
-- 
-- CREATE OR REPLACE FUNCTION bus.add_route(
--                                            v_city_id 	       bigint,
-- 					   route_number        character,
-- 					   route_type          bus.route_type_enum,
-- 					   v_base_cost         money
-- 					)
--   RETURNS bigint AS
-- $BODY$
-- DECLARE
--  v_route_id bigint; -- id from table 'node_types' variable "m_station"
--  v_route_type_id bigint; -- id after inserting new node to table 'nodes'
-- BEGIN
-- 
-- 
--  INSERT INTO bus.routes (city_id,route_type_id,number,base_cost) 
--                  VALUES (v_city_id,route_type,route_number,v_base_cost) 
--                                                                   RETURNING id INTO v_route_id;
-- 
--  INSERT INTO bus.route_ways(route_id,direct_type) VALUES (v_route_id,B'0');
--  INSERT INTO bus.route_ways(route_id,direct_type) VALUES (v_route_id,B'1');
--  RETURN v_route_id;
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- 
-- --================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.add_station(langs lang_enum[],
-- 					   station_names text[],
-- 					   ru_city_name character,
-- 					   lat double precision,
-- 					   lon double precision,
-- 					   use_trolley bit,
-- 					   use_metro bit,
-- 					   use_tram bit,
-- 					   use_bus bit
-- 					    )
-- 				 RETURNS void AS
-- $BODY$
-- DECLARE
-- 	v_city_id bigint;
-- BEGIN
--   SELECT bus.cities.id INTO v_city_id FROM bus.cities JOIN bus.lang_cities ON bus.cities.id = bus.lang_cities.city_id
-- 				      WHERE lang_id = 'c_ru' AND name = ru_city_name;
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'city % not found', ru_city_name;
--   END IF;
--   EXECUTE bus.add_station(langs,station_names,v_city_id,lat,lon,use_trolley,use_metro,use_tram,use_bus);
-- END;
-- $BODY$
-- LANGUAGE plpgsql VOLATILE 
--  COST 100;
-- 				 	    
-- CREATE OR REPLACE FUNCTION bus.add_station(langs lang_enum[],
-- 					   station_names text[],
-- 					   v_city_id bigint,
-- 					   lat double precision,
-- 					   lon double precision,
-- 					   use_trolley bit,
-- 					   use_metro bit,
-- 					   use_tram bit,
-- 					   use_bus bit
-- 					    )
--   RETURNS void AS
-- $BODY$
-- DECLARE
--  v_node_id   bigint; -- id after inserting new node to table 'nodes'
--  loc         text;
--  i           smallint;
--  v_lang_size smallint;
--  v_name_size smallint;  
-- BEGIN
-- 
--  v_lang_size := array_upper(langs,1);
--  v_name_size := array_upper(station_names,1);
-- 
--  IF v_lang_size<>v_name_size THEN
--    RAISE EXCEPTION 'dimention of input parameters is failed';
--  END IF;
-- 
--  loc := 'POINT('||lat::text || ' '||lon::text || ')';
--  INSERT INTO bus.nodes (city_id,type_id,location) 
--                 VALUES (v_city_id,'c_station',GeomFromText(loc,4326)) 
--                                                                   RETURNING id INTO v_node_id;
--  i:= 1;
--  WHILE i <= v_lang_size LOOP
--         INSERT INTO bus.lang_nodes (lang_id,node_id,name) VALUES(langs[i],v_node_id,station_names[i]);        	
-- 	i := i + 1;
--  END LOOP;
--  
--  IF use_trolley = B'1' THEN
--    INSERT INTO bus.node_transports (node_id,transport_type_id) 
--          VALUES (v_node_id,'c_trolley');
--  END IF;
-- 
--  IF use_metro = B'1' THEN
--    INSERT INTO bus.node_transports (node_id,transport_type_id) 
--          VALUES (v_node_id,'c_metro');
--  END IF;
--  
--  IF use_tram = B'1' THEN
--    INSERT INTO bus.node_transports (node_id,transport_type_id) 
--          VALUES (v_node_id,'c_tram');
--  END IF;
-- 
--  IF use_bus = B'1' THEN
--    INSERT INTO bus.node_transports (node_id,transport_type_id) 
--          VALUES (v_node_id,'c_bus');
--  END IF; 
--  
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;



--================================================================================================================--
-- CREATE OR REPLACE FUNCTION bus.add_route_type(v_ru_name  character,v_en_name  character,route_variable  character, transport_variable character)
--   RETURNS void AS
-- $BODY$
-- DECLARE
--  v_transport_type_id integer;
-- BEGIN
--  SELECT id INTO v_transport_type_id FROM bus.transport_types WHERE  variable = transport_variable;
--  insert into bus.route_types (transport_type_id,ru_name,en_name,variable) VALUES(v_transport_type_id,v_ru_name,v_en_name,route_variable);
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- ALTER FUNCTION bus.add_route_type(character,character,character,character) OWNER TO postgres;
--================================================================================================================--
-- 
-- CREATE OR REPLACE FUNCTION bus.fill_calc_relations()
--   RETURNS void AS
-- $BODY$
-- DECLARE
-- 
-- BEGIN
-- 
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- ALTER FUNCTION bus.fill_calc_relations() OWNER TO postgres;
-- 
-- 
-- 
-- CREATE OR REPLACE FUNCTION bus.add_city(
--                                            v_langs lang_enum[],
--                                            v_names text[]
-- 					)
-- 					RETURNS void AS
-- $BODY$
-- DECLARE
--  i integer;
--  size_langs integer;
--  size_names integer;
--  v_city_id integer;
-- BEGIN
--  size_langs = array_upper(v_langs,1);
--  size_names = array_upper(v_names,1);
--  IF size_langs<>size_names THEN
--    RAISE EXCEPTION 'dimention of input parameters is failed';
--  END IF;
--  i:=1;
-- 
--  INSERT INTO bus.cities (id) VALUES(DEFAULT) RETURNING id INTO v_city_id;
-- 
--  WHILE i<=size_langs LOOP
--     INSERT INTO bus.lang_cities(city_id,lang_id,name) VALUES(v_city_id,v_langs[i],v_names[i]);
--     i:= i+1;
--  END LOOP;
-- 
-- END;
-- $BODY$
--   LANGUAGE plpgsql VOLATILE
--   COST 100;
-- ALTER FUNCTION bus.add_route_type(character,character,character,character) OWNER TO postgres;
-- 
-- 
-- 
-- 
