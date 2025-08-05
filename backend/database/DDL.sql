-- # Job Tracker Database Schema
-- This SQL script (`ddl.sql`) defines the database schema for the Job Tracker application. 
-- It sets up tables to manage users, jobs, skills, contacts, and their relationships.
-- Portions of this SQL schema creation and modification were assisted by ChatGPT. 
-- The AI helped with syntax correction, schema design alignment with application functionality, 
-- and ensuring proper database constraints.

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users_skills;
DROP TABLE IF EXISTS jobs_skills;
DROP TABLE IF EXISTS jobs_contacts;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(45) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,
    PRIMARY KEY (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE jobs (
    job_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    positionTitle VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    city VARCHAR(100) DEFAULT NULL,
    state VARCHAR(100) DEFAULT NULL,
    status ENUM('applied', 'interviewing', 'offer', 'rejected', 'interested') NOT NULL DEFAULT 'applied',
    salary_min DECIMAL(10, 2) DEFAULT NULL,
    salary_max DECIMAL(10, 2) DEFAULT NULL,
    application_date DATE DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    classification ENUM('Job', 'Internship') NOT NULL DEFAULT 'Job', 
    tier ENUM('Dream Position', 'Good Fit', 'Backup') DEFAULT NULL, 
    link VARCHAR(255) DEFAULT NULL, 
    PRIMARY KEY (job_id),
    KEY fk_jobs_users_idx (user_id),
    CONSTRAINT fk_jobs_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE skills (
    skill_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    name VARCHAR(45) NOT NULL,
    description TEXT,
    PRIMARY KEY (skill_id),
    KEY fk_skills_users_idx (user_id),
    CONSTRAINT fk_skills_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE contacts (
    contact_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    email VARCHAR(45) DEFAULT NULL,
    phone VARCHAR(45) DEFAULT NULL,
    position VARCHAR(100) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    PRIMARY KEY (contact_id),
    KEY fk_contacts_users_idx (user_id),
    CONSTRAINT fk_contacts_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE jobs_skills (
    job_id INT(11) NOT NULL,
    skill_id INT(11) NOT NULL,
    proficiency_required ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT NULL,
    PRIMARY KEY (job_id, skill_id),
    CONSTRAINT fk_jobs_skills_job FOREIGN KEY (job_id) REFERENCES jobs (job_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_jobs_skills_skill FOREIGN KEY (skill_id) REFERENCES skills (skill_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE jobs_contacts (
    job_id INT(11) NOT NULL,
    contact_id INT(11) NOT NULL,
    relationship_type ENUM('recruiter', 'hiring_manager', 'interviewer', 'network') DEFAULT NULL,
    PRIMARY KEY (job_id, contact_id),
    CONSTRAINT fk_jobs_contacts_job FOREIGN KEY (job_id) REFERENCES jobs (job_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_jobs_contacts_contact FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE users_skills (
    user_id INT(11) NOT NULL,
    skill_id INT(11) NOT NULL,
    proficiency ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT NULL,
    confidence_score TINYINT(3) UNSIGNED DEFAULT NULL COMMENT '1-10 rating',
    last_practiced DATE DEFAULT NULL,
    PRIMARY KEY (user_id, skill_id),
    CONSTRAINT fk_users_skills_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_users_skills_skill FOREIGN KEY (skill_id) REFERENCES skills (skill_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
