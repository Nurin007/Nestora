package com.nestora.property.search

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository
import org.springframework.stereotype.Repository

@Repository
interface PropertySearchRepository : ElasticsearchRepository<PropertyDocument, String>
