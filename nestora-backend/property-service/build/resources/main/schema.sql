CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    property_type VARCHAR(50) NOT NULL, -- RESIDENTIAL, COMMERCIAL, RENTAL, LAND
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, SOLD, RENTED
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    pricing DECIMAL(15,2) NOT NULL,
    area_size DOUBLE NOT NULL,
    number_of_bedrooms INT NOT NULL DEFAULT 0,
    number_of_bathrooms INT NOT NULL DEFAULT 0,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    location_lat DOUBLE,
    location_long DOUBLE,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_thumbnail BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_amenities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    amenity_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE(user_id, property_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    visit_proof_image_url VARCHAR(500),
    moderation_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, SPAM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
