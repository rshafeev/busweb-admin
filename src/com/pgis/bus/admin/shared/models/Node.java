package com.pgis.bus.admin.shared.models;

import com.google.gwt.user.client.rpc.IsSerializable;

public class Node implements IsSerializable{
 public int id;
 public int city_id;
 public String ru_name;
 public String en_name;
 public String street_name;
 public double lat;
 public double lon;
 public int type_id;
}
