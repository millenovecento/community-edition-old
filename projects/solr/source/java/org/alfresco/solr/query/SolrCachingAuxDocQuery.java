/*
 * #%L
 * Alfresco Solr
 * %%
 * Copyright (C) 2005 - 2016 Alfresco Software Limited
 * %%
 * This file is part of the Alfresco software. 
 * If the software was purchased under a paid Alfresco license, the terms of 
 * the paid license agreement will prevail.  Otherwise, the software is 
 * provided under the following open source license terms:
 * 
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 * #L%
 */
package org.alfresco.solr.query;

import java.io.IOException;
import java.util.ArrayList;

import org.alfresco.repo.search.impl.lucene.query.AbsoluteStructuredFieldPosition;
import org.alfresco.repo.search.impl.lucene.query.DescendantAndSelfStructuredFieldPosition;
import org.alfresco.repo.search.impl.lucene.query.RelativeStructuredFieldPosition;
import org.alfresco.repo.search.impl.lucene.query.SelfAxisStructuredFieldPosition;
import org.alfresco.repo.search.impl.lucene.query.StructuredFieldPosition;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.Explanation;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.Scorer;
import org.apache.lucene.search.Searcher;
import org.apache.lucene.search.Similarity;
import org.apache.lucene.search.Weight;
import org.apache.lucene.search.Explanation.IDFExplanation;
import org.apache.solr.search.SolrIndexReader;
import org.apache.solr.search.SolrIndexSearcher;

/**
 * @author Andy
 */
public class SolrCachingAuxDocQuery extends Query
{

    Query query;

    public SolrCachingAuxDocQuery(Query query)
    {
        this.query = query;
    }

    /*
     * @see org.apache.lucene.search.Query#createWeight(org.apache.lucene.search.Searcher)
     */
    public Weight createWeight(Searcher searcher) throws IOException
    {
        if (!(searcher instanceof SolrIndexSearcher))
        {
            throw new IllegalStateException("Must have a SolrIndexSearcher");
        }
        return new SolrCachingAuxDocQueryWeight((SolrIndexSearcher) searcher);
    }

    /*
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("CACHED -> :");
        stringBuilder.append("AuxDocQuery " + query);
        return stringBuilder.toString();
    }

    /*
     * @see org.apache.lucene.search.Query#toString(java.lang.String)
     */
    public String toString(String field)
    {
        return toString();
    }

    @Override
    public int hashCode()
    {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((query == null) ? 0 : query.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj)
    {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        SolrCachingAuxDocQuery other = (SolrCachingAuxDocQuery) obj;
        if (query == null)
        {
            if (other.query != null)
                return false;
        }
        else if (!query.equals(other.query))
            return false;
        return true;
    }

    private class SolrCachingAuxDocQueryWeight extends Weight
    {
        SolrIndexSearcher searcher;

        private Similarity similarity;

        private float value;

        private float idf;

        private float queryNorm;

        private float queryWeight;

        private IDFExplanation idfExp;

        public SolrCachingAuxDocQueryWeight(SolrIndexSearcher searcher) throws IOException
        {
            this.searcher = searcher;
            this.similarity = getSimilarity(searcher);
            idfExp = new IDFExplanation()
            {
                
                @Override
                public float getIdf()
                {
                    // TODO Auto-generated method stub
                    return 1.0f;
                }
                
                @Override
                public String explain()
                {
                    return "Aux doc wrapper shoud pass through the underlying stuff";
                }
            };
            idf = idfExp.getIdf();
        }

        /*
         * @see org.apache.lucene.search.Weight#explain(org.apache.lucene.index.IndexReader, int)
         */
        public Explanation explain(IndexReader reader, int doc) throws IOException
        {
            throw new UnsupportedOperationException();
        }

        /*
         * @see org.apache.lucene.search.Weight#getQuery()
         */
        public Query getQuery()
        {
            return SolrCachingAuxDocQuery.this;
        }

        /*
         * (non-Javadoc)
         * @see org.apache.lucene.search.Weight#getValue()
         */
        public float getValue()
        {
            return value;
        }

        /*
         * (non-Javadoc)
         * @see org.apache.lucene.search.Weight#normalize(float)
         */
        public void normalize(float queryNorm)
        {
            this.queryNorm = queryNorm;
            queryWeight *= queryNorm; // normalize query weight
            value = queryWeight * idf; // idf for document
        }

        /*
         * (non-Javadoc)
         * @see org.apache.lucene.search.Weight#sumOfSquaredWeights()
         */
        public float sumOfSquaredWeights() throws IOException
        {
            queryWeight = idf * getBoost(); // compute query weight
            return queryWeight * queryWeight; // square it
        }

        /*
         * (non-Javadoc)
         * @see org.apache.lucene.search.Weight#scorer(org.apache.lucene.index.IndexReader, boolean, boolean)
         */
        @Override
        public Scorer scorer(IndexReader reader, boolean scoreDocsInOrder, boolean topScorer) throws IOException
        {
            if (!(reader instanceof SolrIndexReader))
            {
                throw new IllegalStateException("Must have a SolrIndexReader");
            }
            return SolrCachingAuxDocScorer.createAuxDocScorer(searcher, getSimilarity(searcher), SolrCachingAuxDocQuery.this.query, (SolrIndexReader) reader);
        }
    }
}
