package com.pgis.bus.admin.listeners;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;

public class CustomAuthListener implements ApplicationListener<AbstractAuthenticationEvent> {
	private  static final Logger log = LoggerFactory.getLogger( CustomAuthListener.class ); // 1. Объявляем переменную логгера
	//private static final Log logger = LogFactory.getLog(CustomAuthListener.class);

	@Override
	public void onApplicationEvent(AbstractAuthenticationEvent event) {
		
		log.info("open AbstractAuthenticationEvent( )  function");
		final StringBuilder builder = new StringBuilder();
        builder.append("Authentication event ");
        builder.append(event.getClass().getSimpleName());
        builder.append(": ");
        builder.append(event.getAuthentication().getName());
        builder.append("; details: ");
        builder.append(event.getAuthentication().getDetails());

        if (event instanceof AbstractAuthenticationFailureEvent) {
            builder.append("; exception: ");
            builder.append(((AbstractAuthenticationFailureEvent) event).getException().getMessage());
        }

        log.warn(builder.toString());
          
	}

}
