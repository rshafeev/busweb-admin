package com.pgis.bus.admin.shared.models;


import java.io.Serializable;
import com.google.gwt.core.client.GWT;

@SuppressWarnings("serial")

/**
 * This object holds information about the current session with a user.
 * It includes the user id, user email, and urls to logout and login to the application.
 *
 */

public class UserSessionInfo implements Serializable 
{

/**
 * Return a new object with information about the current session. 
 * This constructor can only be invoked on the
 * server.
 * 
 * @param userName String
 * @param userEmail String
 * @param loginUrl  String
 * @param logoutUrl String - a url that can be used to log the current user out
 */

public UserSessionInfo(String userName, String userEmail, String loginUrl, String logoutUrl)
{
   assert !GWT.isClient();
   setUserName (userName);
   setUserEmail (userEmail);
   setLoginUrl (loginUrl);
   setLogoutUrl (logoutUrl);
}

/* Property LoginUrl */
/**
 * This variable holds the value of the LoginUrl property.
 */

   private String pLoginUrl;

/**
 * Get the value of the LoginUrl property.
 * 
 * @return String
 */

public String getLoginUrl ()
{
   //if (pLoginUrl == null) {}
   return pLoginUrl;
} // end getLoginUrl

/**
 * Set the value of the LoginUrl property.
 * 
 * @param newValue String
 */

public void setLoginUrl (String newValue)
{
   pLoginUrl = newValue;
} // end setLoginUrl
/* end Property LoginUrl */

/* Property LogoutUrl */
/**
 * This variable holds the value of the LogoutUrl property.
 */

   private String pLogoutUrl;

/**
 * Get the value of the LogoutUrl property.
 * 
 * @return String
 */

public String getLogoutUrl ()
{
   //if (pLogoutUrl == null) {}
   return pLogoutUrl;
} // end getLogoutUrl

/**
 * Set the value of the LogoutUrl property.
 * 
 * @param newValue String
 */

public void setLogoutUrl (String newValue)
{
   pLogoutUrl = newValue;
} // end setLogoutUrl
/* end Property LogoutUrl */

/* Property UserEmail */
/**
 * This variable holds the value of the UserEmail property.
 */

   private String pUserEmail;

/**
 * Get the value of the UserEmail property.
 * 
 * @return String
 */

public String getUserEmail ()
{
   //if (pUserEmail == null) {}
   return pUserEmail;
} // end getUserEmail

/**
 * Set the value of the UserEmail property.
 * 
 * @param newValue String
 */

public void setUserEmail (String newValue)
{
   pUserEmail = newValue;
} // end setUserEmail
/* end Property UserEmail */

/* Property UserName */
/**
 * This variable holds the value of the UserName property.
 */

   private String pUserName;

/**
 * Get the value of the UserName property.
 * 
 * @return String
 */

public String getUserName ()
{
   //if (pUserName == null) {}
   return pUserName;
} // end getUserName

/**
 * Set the value of the UserName property.
 * 
 * @param newValue String
 */

private void setUserName (String newValue)
{
   pUserName = newValue;
} // end setUserName
/* end Property UserName */


/**
 * Return a new object.
 * Note that this one is used only for RPC serialization.
 */

public UserSessionInfo () {}

} // end of class UserSessionInfo
