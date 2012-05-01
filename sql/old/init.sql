delete from bus.lang_cities;
delete from bus.lang_routes;
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



--- init ---

INSERT INTO bus.languages(id,name) VALUES('c_en', 'English');
INSERT INTO bus.languages(id,name) VALUES('c_ru', 'Русский');

select bus.add_city('{"c_en","c_ru"}','{"Kharkov","Харьков"}');
select bus.add_city('{"c_en","c_ru"}','{"Kiev","Киев"}');


insert into bus.transport_types (id,ev_speed) VALUES ('c_metro',44);
insert into bus.transport_types (id,ev_speed) VALUES ('c_bus',50);
insert into bus.transport_types (id,ev_speed) VALUES ('c_tram',48);
insert into bus.transport_types (id,ev_speed) VALUES ('c_trolley',45);
insert into bus.transport_types (id,ev_speed) VALUES ('c_foot',5);

insert into bus.route_types (id,transport_id) VALUES ('c_route_metro','c_metro');
insert into bus.route_types (id,transport_id) VALUES ('c_route_metro_transition','c_foot');
insert into bus.route_types (id,transport_id) VALUES ('c_route_metro_exit','c_foot');
insert into bus.route_types (id,transport_id) VALUES ('c_route_trolley','c_trolley');
insert into bus.route_types (id,transport_id) VALUES ('c_route_bus','c_bus');
insert into bus.route_types (id,transport_id) VALUES ('c_route_tram','c_tram');

    
-- sample ---

--bus.add_station(station_ru_name , station_en_name , ru_city_name , street_name , lat  , lon  , use_trolley , use_metro , use_tram , use_bus )
select bus.add_station('{"c_ru"}','{"Героев труда"}', 'Харьков', 50.0248660662900022, 36.3358723262009988, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Студенческая"}', 'Харьков', 50.0173799072800023, 36.3294350245660027,B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Академика Павлова"}', 'Харьков', 50.0088031682239986, 36.3178049662810025, B'0',B'1',B'0',B'0');;
select bus.add_station('{"c_ru"}','{"Академика Барабашова"}', 'Харьков', 50.0016317292229999, 36.304243717496, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Киевская"}', 'Харьков', 50.0012317520870013, 36.2694608309960032, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Пушкинская"}', 'Харьков',50.0041280630389977, 36.2459432223479965,B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Университет"}', 'Харьков',50.004445267445, 36.2345921138029965, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Исторический музей"}', 'Харьков', 49.9924555542229996, 36.2321995833519992, B'0',B'1',B'0',B'0');

select bus.add_station('{"c_ru"}','{"Алексеевская"}', 'Харьков', 50.0490157940580005, 36.2068956235070019, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"23 августа"}', 'Харьков', 50.035703764087998, 36.219941888153997, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Ботанический сад"}', 'Харьков', 50.0262480518729973, 36.2230532506079967, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Научная"}', 'Харьков', 50.0129572864570022, 36.2269156315890015, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Госпром"}', 'Харьков',50.0056037353219978, 36.2321030238320034, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Архитектора Бекетова"}', 'Харьков', 49.998014573585003, 36.2405841687290007, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Площадь восстания"}', 'Харьков',49.988785973467003, 36.2648957112360009, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Метростроителей им. Ващенка"}', 'Харьков', 49.9781895224160024, 36.2624388077850028, B'0',B'1',B'0',B'0');

select bus.add_station('{"c_ru"}','{"Холодная гора"}', 'Харьков', 49.9828085098929975, 36.1825197079759988, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Южный вокзал"}', 'Харьков',49.9898792894979991, 36.2063109019429987,B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Центральный рынок"}', 'Харьков',49.9931832291679967, 36.2194054463490005, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Советская"}', 'Харьков',49.9925314260590028, 36.2318026164180012, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Проспект Гагарина"}', 'Харьков', 49.9809043955170011, 36.243094716366997, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Спортивная"}','Харьков', 49.9792658309700002, 36.2612640002359967, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Завод имени Малышева"}','Харьков', 49.9760126837700014, 36.280860219297999, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Московский проспект"}','Харьков', 49.9722728451489999, 36.301792178451997, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Маршала Жукова"}', 'Харьков', 49.9663105826180001, 36.3212006428810028, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Советской Армиии"}', 'Харьков', 49.9618729101670027, 36.3430230954270002, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Имени О.С. Масельского"}', 'Харьков',49.9585254060080004, 36.3602428773059998, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Тракторный завод"}', 'Харьков', 49.9527892444230019, 36.378996882731002, B'0',B'1',B'0',B'0');
select bus.add_station('{"c_ru"}','{"Пролетарская"}', 'Харьков', 49.9466174483790013, 36.3979976513950021,B'0',B'1',B'0',B'0');


--bus.add_route(ru_city_name character, route_number character, transport_variable character, base_cost money)
select bus.add_route_with_names('Харьков',NULL,'{"c_ru"}', '{"Салтовская линия"}', 'c_route_metro', '2');
select bus.add_route_with_names('Харьков',NULL,'{"c_ru"}', '{"Алексеевская линия"}', 'c_route_metro', '2');
select bus.add_route_with_names('Харьков',NULL,'{"c_ru"}', '{"Холодногорско-заводская линия"}','c_route_metro', '2');

select bus.add_route_link_ru('Харьков','Университет','Госпром','c_route_metro_transition','2');
select bus.add_route_link_ru('Харьков','Спортивная','Метростроителей им. Ващенка','c_route_metro_transition','2');
select bus.add_route_link_ru('Харьков','Советская','Исторический музей','c_route_metro_transition','2');




----------------------------
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Университет',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Пушкинская',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Киевская',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Академика Барабашова',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Академика Павлова',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Студенческая',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Героев труда',B'0',B'1');

select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Героев труда',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Студенческая',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Академика Павлова',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Академика Барабашова',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Киевская',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Пушкинская',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Университет',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Салтовская линия','Исторический музей',B'1',B'1');

--
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Метростроителей им. Ващенка',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Площадь восстания',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Архитектора Бекетова',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Госпром',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Научная',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Ботанический сад',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','23 августа',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Алексеевская',B'0',B'1');

select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Алексеевская',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','23 августа',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Ботанический сад',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Научная',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Госпром',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Архитектора Бекетова',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Площадь восстания',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Алексеевская линия','Метростроителей им. Ващенка',B'1',B'1');

select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Холодная гора',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Южный вокзал',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Центральный рынок',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Советская',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Проспект Гагарина',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Спортивная',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Завод имени Малышева',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Московский проспект',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Маршала Жукова',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Советской Армиии',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Имени О.С. Масельского',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Тракторный завод',B'0',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Пролетарская',B'0',B'1');

select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Пролетарская',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Тракторный завод',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Имени О.С. Масельского',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Советской Армиии',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Маршала Жукова',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Московский проспект',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Завод имени Малышева',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Спортивная',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Проспект Гагарина',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Советская',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Центральный рынок',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Южный вокзал',B'1',B'1');
select bus.add_last_station_to_route_ru('Харьков', 'Холодногорско-заводская линия','Холодная гора',B'1',B'1');


                               
--==================================

select bus.set_route_timetable_directboth_ru('Харьков','Салтовская линия',B'1',
                               '{06:00,11:00,16:00,23:00}'::time without time zone [],
                               '{2.5 minute,3.5 minute,5 minute}'::interval[],
                               '{"c_Sunday","c_Monday","c_Tuesday","c_Wednesday","c_Thursday","c_Friday","c_Saturday"}');

select bus.set_route_timetable_directboth_ru('Харьков','Холодногорско-заводская линия',B'1',
                               '{06:00,11:00,16:00,23:00}'::time without time zone [],
                               '{2.5 minute,3.5 minute,5 minute}'::interval[],
                               '{"c_Sunday","c_Monday","c_Tuesday","c_Wednesday","c_Thursday","c_Friday","c_Saturday"}');

select bus.set_route_timetable_directboth_ru('Харьков','Алексеевская линия',B'1',
                               '{06:00,11:00,16:00,23:00}'::time without time zone [],
                               '{2.5 minute,3.5 minute,5 minute}'::interval[],
                               '{"c_Sunday","c_Monday","c_Tuesday","c_Wednesday","c_Thursday","c_Friday","c_Saturday"}');                   
/*
select bus.set_route_timetable_directboth('Харьков','Переход с.м. Университет - с.м. Госпром',
                               '{06:00,23:00}'::time without time zone [],
                               '{0 minute}'::interval[],
                               '{"Понедельник", "Вторник", "Среда","Четверг","Пятница","Суббота","Воскресенье"}'::text[]);       
                               
select bus.set_route_timetable_directboth('Харьков','Переход с.м. Спортивная - с.м. Метростроителей им. Ващенка',
                               '{06:00,23:00}'::time without time zone [],
                               '{0 minute}'::interval[],
                               '{"Понедельник", "Вторник", "Среда","Четверг","Пятница","Суббота","Воскресенье"}'::text[]);  
                                  
select bus.set_route_timetable_directboth('Харьков','Переход с.м. Советская - с.м. Исторический музей',
                               '{06:00,23:00}'::time without time zone [],
                               '{0 minute}'::interval[],
                               '{"Понедельник", "Вторник", "Среда","Четверг","Пятница","Суббота","Воскресенье"}'::text[]);  
                               */                                                                 
--==================================
                              

COMMIT;









