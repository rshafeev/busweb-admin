

-- get metro line: "Салтовская линия"
/*
select bus.nodes.ru_name,bus.nodes.street_name,bus.nodes.lat,bus.nodes.lon from 
 ( select curr_node_id,index from bus.route_way_nodes where route_way_id in 
                       (select bus.route_ways.id from bus.route_ways JOIN bus.routes ON bus.routes.id = bus.route_ways.route_id
                        where direct_type = B'0' AND ru_number='Салтовская линия')
) as virtTable

JOIN bus.nodes ON bus.nodes.id = virtTable.curr_node_id
ORDER BY index;

*/
/*
  select * from 
  (
     select * from bus.route_schedule JOIN 
     (select * from bus.route_way_days where day_id in (select id from bus.days where ru_name = 'Понедельник')) as rwdays
          ON rwdays.route_daygroup_id =  bus.route_schedule.route_daygroup_id
       JOIN bus.route_ways ON bus.route_ways.id = rwdays.route_way_id
       JOIN bus.routes ON bus.route_ways.route_id = bus.routes.id
  ) as tempTable;
  
  */
  /*
SELECT table1.ru_number,table1.cur_station, ru_name as next_station,time_in,station_delay,money_cost FROM 
(
           SELECT   bus.routes.ru_number,ru_name as cur_station,curr_node_id,base_cost,ind,time_in,station_delay,money_cost FROM 
           bus.calc_dejkstra_ru('Харьков','с.м. Героев труда','с.м. Спортивная','c_Sunday','13:00',2) as table2
           JOIN bus.route_way_nodes ON bus.route_way_nodes.id = table2.route_way_id
           JOIN bus.route_ways      ON bus.route_ways.id = bus.route_way_nodes.route_way_id
           JOIN bus.routes          ON bus.routes.id =  bus.route_ways.route_id
           JOIN bus.nodes           ON bus.nodes.id = bus.route_way_nodes.prev_node_id
           ORDER BY ind DESC
) as table1 
JOIN bus.nodes ON bus.nodes.id = table1.curr_node_id;             
*/
 SELECT  * FROM 
 (
 SELECT   bus.lang_routes.name, bus.lang_nodes.name as cur_station,  curr_node_id,base_cost,ind,time_in,station_delay,money_cost FROM 
           bus.calc_dejkstra_ru('Харьков','Героев труда','Спортивная','c_Sunday','13:00',2) as table2
           JOIN bus.route_way_nodes ON bus.route_way_nodes.id = table2.route_way_id
           JOIN bus.route_ways      ON bus.route_ways.id = bus.route_way_nodes.route_way_id
           JOIN bus.routes          ON bus.routes.id =  bus.route_ways.route_id
           JOIN bus.lang_routes     ON bus.routes.id = bus.lang_routes.route_id
           JOIN bus.lang_nodes      ON bus.route_way_nodes.prev_node_id = bus.lang_nodes.node_id
           WHERE bus.lang_routes.lang_id = 'c_ru' AND bus.lang_nodes.lang_id = 'c_ru'
           ORDER BY ind DESC
 ) as t1
 JOIN bus.lang_nodes ON t1.curr_node_id = bus.lang_nodes.node_id  
 WHERE bus.lang_nodes.lang_id = 'c_ru';    









/*
SELECT wayTable.ru_name, bus.nodes.ru_name ,time,distance from
(SELECT * from bus.route_way_nodes JOIN bus.nodes ON bus.route_way_nodes.curr_node_id = bus.nodes.id
                                   JOIN bus.route_ways ON bus.route_ways.id = bus.route_way_nodes.route_way_id
                                   JOIN bus.routes ON bus.routes.id = bus.route_ways.route_id

                                   WHERE bus.routes.ru_number = 'Салтовская линия' AND
                                         bus.route_ways.direct_type = B'0'
) as wayTable
                                  JOIN bus.nodes ON wayTable.prev_node_id = bus.nodes.id;*/

    /* SELECT sum(distance) from
(SELECT * from bus.route_way_nodes JOIN bus.nodes ON bus.route_way_nodes.curr_node_id = bus.nodes.id
                                   JOIN bus.route_ways ON bus.route_ways.id = bus.route_way_nodes.route_way_id
                                   JOIN bus.routes ON bus.routes.id = bus.route_ways.route_id

                                   WHERE bus.routes.ru_number = 'Салтовская линия' AND
                                         bus.route_ways.direct_type = B'0'
) as wayTable
                                  JOIN bus.nodes ON wayTable.prev_node_id = bus.nodes.id;*/    
