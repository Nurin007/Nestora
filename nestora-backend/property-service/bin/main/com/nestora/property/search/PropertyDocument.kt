package com.nestora.property.search

import org.springframework.data.annotation.Id
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field
import org.springframework.data.elasticsearch.annotations.FieldType
import org.springframework.data.elasticsearch.annotations.GeoPointField
import org.springframework.data.elasticsearch.core.geo.GeoPoint

@Document(indexName = "properties")
data class PropertyDocument(
    @Id
    val id: String,
    
    @Field(type = FieldType.Text, analyzer = "standard")
    val title: String,
    
    @Field(type = FieldType.Text, analyzer = "standard")
    val description: String,
    
    @Field(type = FieldType.Keyword)
    val propertyType: String,
    
    @Field(type = FieldType.Keyword)
    val status: String,
    
    @Field(type = FieldType.Keyword)
    val verificationStatus: String,
    
    @Field(type = FieldType.Double)
    val pricing: Double,
    
    @Field(type = FieldType.Double)
    val areaSize: Double,
    
    @Field(type = FieldType.Integer)
    val numberOfBedrooms: Int,
    
    @Field(type = FieldType.Integer)
    val numberOfBathrooms: Int,
    
    @Field(type = FieldType.Text)
    val address: String,
    
    @Field(type = FieldType.Keyword)
    val city: String,
    
    @GeoPointField
    val location: GeoPoint?,
    
    @Field(type = FieldType.Keyword)
    val amenities: List<String> = emptyList(),
    
    @Field(type = FieldType.Keyword)
    val thumbnail: String? = null,
    
    @Field(type = FieldType.Long)
    val ownerId: Long
)
