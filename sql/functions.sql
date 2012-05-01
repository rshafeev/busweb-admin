
CREATE OR REPLACE FUNCTION bus.drop_functions()
RETURNS void AS
$BODY$
DECLARE
 --DROP TYPE bus.markers;
 --DROP TYPE bus.short_path;
BEGIN
   DROP FUNCTION bus.insert_user_role( character);
   DROP FUNCTION bus.insert_user(bigint,character, character);
   DROP FUNCTION bus.insert_user(character,character, character);
   DROP FUNCTION bus.authenticate(character,character, character);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;			

 SELECT  bus.drop_functions();

--====================================================================================================================
CREATE OR REPLACE FUNCTION bus.insert_user_role(role_name character)
RETURNS bigint AS
$BODY$
DECLARE
  role_id bigint;
BEGIN
  INSERT INTO bus.user_roles (name)  VALUES(role_name) RETURNING id INTO role_id;
  RETURN role_id;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE  COST 100;	

--====================================================================================================================
CREATE OR REPLACE FUNCTION bus.insert_user(role_id bigint,login character, password character)
RETURNS bigint AS
$BODY$
DECLARE
 user_id bigint;
BEGIN
  INSERT INTO bus.users (role_id,login,password)  VALUES(role_id,login,password) RETURNING id INTO user_id;
  RETURN user_id;
END;
$BODY$  LANGUAGE plpgsql VOLATILE  COST 100;	

--=============================

CREATE OR REPLACE FUNCTION bus.insert_user(role_name character,login character, password character)
RETURNS bigint AS
$BODY$
DECLARE
 user_id bigint;
 role_id bigint;
BEGIN
  SELECT id INTO role_id  FROM bus.user_roles WHERE name = role_name;
  IF NOT FOUND THEN
     RAISE EXCEPTION 'user_role % not found', role_name;
   END IF;
  RAISE NOTICE '%', role_id;
  SELECT * INTO user_id FROM bus.insert_user(role_id,login,password);
  RETURN 1;
END;
$BODY$  LANGUAGE plpgsql VOLATILE  COST 100;	

--====================================================================================================================
CREATE OR REPLACE FUNCTION bus.insert_user(role_id bigint,login character, password character)
RETURNS bigint AS
$BODY$
DECLARE
 user_id bigint;
BEGIN
  INSERT INTO bus.users (role_id,login,password)  VALUES(role_id,login,password) RETURNING id INTO user_id;
  RETURN user_id;
END;
$BODY$  LANGUAGE plpgsql VOLATILE  COST 100;	

--=============================
-- return 1 : invalid login
-- return 2 : invalid password
-- return 0 : ok
CREATE OR REPLACE FUNCTION bus.authenticate(role_name character,v_login character, v_password character)
RETURNS bigint AS
$BODY$
DECLARE
 user_id bigint;
 v_role_id bigint;
BEGIN
  SELECT id INTO v_role_id  FROM bus.user_roles WHERE name = role_name;
  IF NOT FOUND THEN
     RETURN 1;
   END IF;
  RAISE NOTICE '%', v_role_id;
  SELECT id INTO user_id  FROM bus.users WHERE bus.users.role_id = v_role_id AND bus.users.login = v_login 
                                                AND bus.users.password = v_password;
  IF NOT FOUND THEN
     RETURN 2;
   END IF;
  RETURN 0;
END;
$BODY$  LANGUAGE plpgsql VOLATILE  COST 100;	
--=============================