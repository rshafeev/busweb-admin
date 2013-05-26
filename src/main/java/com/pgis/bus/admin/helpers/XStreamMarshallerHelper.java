package com.pgis.bus.admin.helpers;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.bind.Unmarshaller;
import org.springframework.oxm.XmlMappingException;

public class XStreamMarshallerHelper {

	public static String marshal(Object jaxbElement) throws XmlMappingException, IOException, JAXBException {
		JAXBContext jc = JAXBContext.newInstance(jaxbElement.getClass());
		Marshaller marshaller = jc.createMarshaller();
		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		marshaller.marshal(jaxbElement, stream);
		return stream.toString();
	}

	public static <T> T unmarshal(String xmlData, Class<T> type) throws XmlMappingException, IOException, JAXBException {

		JAXBContext jc = JAXBContext.newInstance(type);
		Unmarshaller unmarshaller = jc.createUnmarshaller();
		Source s = new StreamSource(new java.io.StringReader(xmlData));
		@SuppressWarnings("unchecked")
		T unmarshal = (T) unmarshaller.unmarshal(s);
		return unmarshal;
	}
}
