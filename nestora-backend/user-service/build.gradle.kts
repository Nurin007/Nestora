plugins {
    kotlin("jvm")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

dependencies {
    implementation(project(":common"))
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.security:spring-security-crypto")
    
    // R2DBC H2 for local dev
    implementation("io.r2dbc:r2dbc-h2")
    implementation("com.h2database:h2")
    
    // R2DBC MySQL for prod
    implementation("io.asyncer:r2dbc-mysql:1.0.5")
    runtimeOnly("com.mysql:mysql-connector-j")
}
