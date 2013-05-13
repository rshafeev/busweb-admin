package com.pgis.bus.admin.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.net.models.LangEnumModel;

@XmlRootElement
public class StringValueModel implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8611252837510741391L;
	private int id;
	private LangEnumModel lang;
	private String value;

	public StringValueModel() {

	}

	public StringValueModel(StringValue sValue) {
		this.id = sValue.getId();
		this.lang = sValue.getLangID().toModel();
		this.value = sValue.getValue();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public LangEnumModel getLang() {
		return lang;
	}

	public void setLang(LangEnumModel lang) {
		this.lang = lang;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public StringValue toORMObject() {
		StringValue v = new StringValue();
		v.setId(this.id);
		v.setLangID(LangEnum.valueOf(this.lang));
		v.setValue(this.value);
		return v;
	}

	static public Collection<StringValueModel> createModels(Collection<StringValue> arr) {
		if (arr == null)
			return null;
		Collection<StringValueModel> models = new ArrayList<StringValueModel>();
		for (StringValue sValue : arr) {
			models.add(new StringValueModel(sValue));
		}
		return models;
	}

	static public Collection<StringValue> createORMObjects(Collection<StringValueModel> arr) {
		if (arr == null)
			return null;
		Collection<StringValue> ormObjects = new ArrayList<StringValue>();
		for (StringValueModel sValue : arr) {
			ormObjects.add(sValue.toORMObject());
		}
		return ormObjects;
	}
}
