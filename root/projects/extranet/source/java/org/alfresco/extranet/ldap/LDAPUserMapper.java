/*
 * Copyright (C) 2005-2008 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing"
 */
package org.alfresco.extranet.ldap;

import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;

import org.springframework.ldap.core.AttributesMapper;

/**
 * The Class LDAPUserMapper.
 * 
 * @author muzquiano
 */
public class LDAPUserMapper implements AttributesMapper
{
    
    /* (non-Javadoc)
     * @see org.springframework.ldap.core.AttributesMapper#mapFromAttributes(javax.naming.directory.Attributes)
     */
    public Object mapFromAttributes(Attributes attributes) 
        throws NamingException 
    {
        LDAPUser user = null;
        
        //String userId = (String) attributes.get("cn").get();
        String userId = (String) attributes.get("uid").get();
        if(userId != null)
        {
            user = new LDAPUser(userId);

            String firstName = (String) attributes.get("givenName").get();
            if(firstName != null)
            {
                user.setFirstName(firstName);
            }
            
            String middleName = null; // TODO
            if(middleName != null)
            {
                user.setMiddleName(middleName);
            }
            
            String lastName = (String)attributes.get("sn").get();
            if(lastName != null)
            {
                user.setLastName(lastName);
            }
            
            String email = (String) attributes.get("email").get();
            if(email == null)
            {
                email = (String) attributes.get("emailAddress").get();
            }
            if(email != null)
            {
                user.setEmail(email);
            }
            
            Attribute description = attributes.get("description");
            if(description != null)
            {
                user.setDescription((String)description.get());
            }

            Attribute userPassword = attributes.get("userPassword");
            if(userPassword != null)
            {
                byte[] array = (byte[]) userPassword.get();
                String pw = new String(array);
                user.setPassword(pw);
            }
        }
        
        return user;
    }
}

