/*
 * Copyright (C) 2005-2007 Alfresco Software Limited.
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
 * http://www.alfresco.com/legal/licensing
 */

package org.alfresco.repo.attributes.hibernate;

import java.util.List;

import org.alfresco.repo.attributes.ListAttribute;
import org.alfresco.repo.attributes.ListEntry;
import org.alfresco.repo.attributes.ListEntryDAO;
import org.alfresco.repo.attributes.ListEntryImpl;
import org.alfresco.repo.attributes.ListEntryKey;
import org.alfresco.repo.domain.hibernate.DirtySessionMethodInterceptor;
import org.hibernate.Query;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

/**
 * @author britt
 *
 */
public class ListEntryDAOHibernate extends HibernateDaoSupport implements
        ListEntryDAO
{
    /* (non-Javadoc)
     * @see org.alfresco.repo.attributes.ListEntryDAO#delete(org.alfresco.repo.attributes.ListEntry)
     */
    public void delete(ListEntry entry)
    {
        getSession().delete(entry);
    }

    /* (non-Javadoc)
     * @see org.alfresco.repo.attributes.ListEntryDAO#delete(org.alfresco.repo.attributes.ListAttribute)
     */
    public void delete(ListAttribute list)
    {
        Query query = getSession().createQuery("delete from ListEntryImpl le where le.key.list = :list");
        query.setEntity("list", list);
        query.executeUpdate();
    }

    /* (non-Javadoc)
     * @see org.alfresco.repo.attributes.ListEntryDAO#get(org.alfresco.repo.attributes.ListAttribute, int)
     */
    public ListEntry get(ListEntryKey key)
    {
        return (ListEntry)getSession().get(ListEntryImpl.class, key);
    }

    /* (non-Javadoc)
     * @see org.alfresco.repo.attributes.ListEntryDAO#get(org.alfresco.repo.attributes.ListAttribute)
     */
    @SuppressWarnings("unchecked")
    public List<ListEntry> get(ListAttribute list)
    {
        Query query = getSession().createQuery("from ListEntryImpl le where le.key.list = :list");
        query.setEntity("list", list);
        DirtySessionMethodInterceptor.setQueryFlushMode(getSession(), query);
        return (List<ListEntry>)query.list();
    }

    /* (non-Javadoc)
     * @see org.alfresco.repo.attributes.ListEntryDAO#save(org.alfresco.repo.attributes.ListEntry)
     */
    public void save(ListEntry entry)
    {
        getSession().save(entry);
    }

    /* (non-Javadoc)
     * @see org.alfresco.repo.attributes.ListEntryDAO#size(org.alfresco.repo.attributes.ListAttribute)
     */
    public int size(ListAttribute list)
    {
        Query query = getSession().createQuery("select count(*) from ListEntryImpl le where le.key.list = :list");
        query.setEntity("list", list);
        DirtySessionMethodInterceptor.setQueryFlushMode(getSession(), query);
        return ((Long)query.uniqueResult()).intValue();
    }
}
