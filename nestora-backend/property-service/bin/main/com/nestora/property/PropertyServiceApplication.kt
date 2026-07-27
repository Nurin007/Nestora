package com.nestora.property

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PropertyServiceApplication

fun main(args: Array<String>) {
    runApplication<PropertyServiceApplication>(*args)
}
