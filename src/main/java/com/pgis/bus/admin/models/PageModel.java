package com.pgis.bus.admin.models;

import java.util.Locale;



public class PageModel {
	/**
	 * Язык локализации: ru,en,uk
	 */
	private String language = "ru"; 

	public PageModel() {
		super();
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(Locale locale){
		
		if (locale.getLanguage() == null
				|| locale.getLanguage().equalsIgnoreCase("rus"))
			this.language = "ru";
		else 
			this.language = locale.getLanguage();
	}
	public void setLanguage(String language) {
		this.language = language;
	}
}
