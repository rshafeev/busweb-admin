package com.pgis.bus.admin.models;

import com.pgis.bus.data.orm.StringValue;

public class LocaleNameModel {

	private Integer id;
	private String langID;
	private String name;
	
	public LocaleNameModel(StringValue v){
		super();
		this.id = v.id;
		this.langID = v.lang_id;
		this.name = v.value;
	}
	public LocaleNameModel(Integer id, String langID, String name) {
		super();
		this.id = id;
		this.langID = langID;
		this.name = name;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getLangID() {
		return langID;
	}
	public void setLangID(String langID) {
		this.langID = langID;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
}
