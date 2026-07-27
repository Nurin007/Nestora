plugins {
    kotlin("jvm") version "1.9.22" apply false
    id("org.springframework.boot") version "3.2.2" apply false
    id("io.spring.dependency-management") version "1.1.4" apply false
}

allprojects {
    group = "com.nestora"
    version = "1.0.0"

    repositories {
        mavenCentral()
    }
}
