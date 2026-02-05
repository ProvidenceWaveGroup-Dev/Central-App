-- Drop and recreate database
DROP DATABASE IF EXISTS betti;
CREATE DATABASE betti;
USE betti;

-- Facilities where patients reside or receive care
CREATE TABLE facilities (
  facility_id   INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  address       VARCHAR(255),
  facility_type ENUM('senior_living','assisted_living','private_home','hospital') DEFAULT 'private_home',
  status        ENUM('active','inactive') DEFAULT 'active',
  is_active     BOOLEAN DEFAULT TRUE,
  archived_at   DATETIME,
  deleted_at   DATETIME
) ENGINE=InnoDB;

-- Users: global identities (seniors, caregivers, staff, responders)
CREATE TABLE users (
  user_id     INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  phone       VARCHAR(20),
  status      ENUM('active','suspended') DEFAULT 'active',
  created_at  DATETIME NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  archived_at DATETIME,
  deleted_at DATETIME
) ENGINE=InnoDB;

-- Authentication table
CREATE TABLE user_credentials (
  credential_id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id             INT NOT NULL,
  login_type          ENUM('email','username','social') DEFAULT 'email',
  login_identifier    VARCHAR(100) NOT NULL,
  password_hash       CHAR(60),          -- NULL for non‑password login
  password_salt       VARBINARY(16),     -- NULL if salt is included in the hash
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at       DATETIME,
  is_active           BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE (login_type, login_identifier)
) ENGINE=InnoDB;


-- Roles and permissions for RBAC
CREATE TABLE roles (
  role_id      INT AUTO_INCREMENT PRIMARY KEY,
  role_name    VARCHAR(50) NOT NULL UNIQUE,
  description  TEXT
) ENGINE=InnoDB;

CREATE TABLE permissions (
  permission_id INT AUTO_INCREMENT PRIMARY KEY,
  resource      VARCHAR(50) NOT NULL,
  action        VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
  role_id       INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
) ENGINE=InnoDB;

-- Assign roles globally to users (e.g., caregiver role)
CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB;

-- Map users to facilities with facility-specific roles (admin, staff, security, ems)
CREATE TABLE facility_memberships (
  user_id     INT NOT NULL,
  facility_id INT NOT NULL,
  facility_role ENUM('admin','staff','security','ems','fire_service') NOT NULL,
  PRIMARY KEY (user_id, facility_id, facility_role),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (facility_id) REFERENCES facilities(facility_id)
) ENGINE=InnoDB;

-- Patients (residents/care recipients)
CREATE TABLE patients (
  patient_id      INT AUTO_INCREMENT PRIMARY KEY,
  facility_id     INT,
  first_name      VARCHAR(50) NOT NULL,
  last_name       VARCHAR(50) NOT NULL,
  dob             DATE,
  gender          ENUM('male','female','other'),
  primary_language VARCHAR(50),
  #race_ethnicity  VARCHAR(100),
  contact_info    VARCHAR(255),
  status          ENUM('active','discharged') DEFAULT 'active',
  created_by      INT,
  created_at      DATETIME NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  archived_at     DATETIME,
  FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
  FOREIGN KEY (created_by)  REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Caregiver & family assignments
CREATE TABLE caregiver_patient_assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  patient_id    INT NOT NULL,
  assignment_type ENUM('caregiver','family') NOT NULL,
  is_primary    BOOLEAN DEFAULT FALSE,
  active_from   DATE NOT NULL,
  active_to     DATE,
  FOREIGN KEY (user_id)    REFERENCES users(user_id),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;




-- Static medical history for patients
CREATE TABLE patient_medical_profile (
  profile_id          INT AUTO_INCREMENT PRIMARY KEY,
  patient_id          INT NOT NULL,
  blood_type          VARCHAR(5),
  allergies           TEXT,
  chronic_conditions  TEXT,
  emergency_notes     TEXT,
  dnr_status          BOOLEAN DEFAULT FALSE,
  
  -- picture Storage Columns  Here
  file_name           VARCHAR(255),
  file_type           ENUM('png','jpg','jpeg','pdf'),
  file_data           LONGBLOB,
  uploaded_at         DATETIME,

  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Physical locations within a facility or private home
CREATE TABLE locations (
  location_id   INT AUTO_INCREMENT PRIMARY KEY,
  facility_id   INT NOT NULL,
  patient_id    INT,
  room_name     VARCHAR(100) NOT NULL,
  floor_level   VARCHAR(50),
  coordinates   VARCHAR(100),
  is_active     BOOLEAN DEFAULT TRUE,
  archived_at   DATETIME,
  deleted_at    DATETIME,
  FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
  FOREIGN KEY (patient_id)  REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Hub devices per room (control plane)
CREATE TABLE hubs (
  hub_id          INT AUTO_INCREMENT PRIMARY KEY,
  facility_id     INT NOT NULL,
  location_id     INT NOT NULL,
  serial_number   VARCHAR(100),
  firmware_version VARCHAR(50),
  status          ENUM('online','offline') DEFAULT 'online',
  installed_at    DATETIME,
  deleted_at     DATETIME,
  FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
) ENGINE=InnoDB;

-- Room pack kits installed in each room
CREATE TABLE room_packs (
  room_pack_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id   INT NOT NULL,
  hub_id       INT NOT NULL,
  pack_type    ENUM('standard','enhanced'),
  installed_at DATETIME,
  deleted_at     DATETIME,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  FOREIGN KEY (hub_id)    REFERENCES hubs(hub_id)
) ENGINE=InnoDB;

-- Sensors: inventory with deployment details
CREATE TABLE sensors (
  sensor_id    INT AUTO_INCREMENT PRIMARY KEY,
  facility_id  INT NOT NULL,
  location_id  INT,
  patient_id   INT,
  room_pack_id INT,
  sensor_type  ENUM('motion','door','smoke','env','voice','vital'),
  device_id    VARCHAR(100),
  status       ENUM('active','inactive') DEFAULT 'active',
  is_active    BOOLEAN DEFAULT TRUE,
  archived_at  DATETIME,
  FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
  FOREIGN KEY (location_id) REFERENCES locations(location_id),
  FOREIGN KEY (patient_id)  REFERENCES patients(patient_id),
  FOREIGN KEY (room_pack_id) REFERENCES room_packs(room_pack_id)
) ENGINE=InnoDB;

-- Device health status
CREATE TABLE device_status (
  status_id      INT AUTO_INCREMENT PRIMARY KEY,
  sensor_id      INT NOT NULL,
  event_time     DATETIME NOT NULL,
  recorded_time  DATETIME NOT NULL,
  battery_level  DECIMAL(5,2),
  connection_status VARCHAR(20),
  signal_strength INT,
  last_sync      DATETIME,
  FOREIGN KEY (sensor_id) REFERENCES sensors(sensor_id)
) ENGINE=InnoDB;

-- Raw sensor readings with event/recorded times
CREATE TABLE sensor_readings (
  reading_id     INT AUTO_INCREMENT PRIMARY KEY,
  sensor_id      INT NOT NULL,
  patient_id     INT NOT NULL,
  event_time     DATETIME NOT NULL,
  recorded_time  DATETIME NOT NULL,
  reading_type   VARCHAR(50) NOT NULL,
  value_numeric  DECIMAL(10,3),
  value_text     TEXT,
  confidence     DECIMAL(5,2),
  FOREIGN KEY (sensor_id)  REFERENCES sensors(sensor_id),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  INDEX idx_sensor_event (sensor_id, event_time),
  INDEX idx_patient_event (patient_id, event_time)
) ENGINE=InnoDB;

-- Aggregated vital metrics
CREATE TABLE vital_metrics (
  metric_id        INT AUTO_INCREMENT PRIMARY KEY,
  patient_id       INT NOT NULL,
  event_time       DATETIME NOT NULL,
  recorded_time    DATETIME NOT NULL,
  heart_rate       INT,
  blood_pressure_systolic  INT,
  blood_pressure_diastolic INT,
  skin_temp        DECIMAL(5,2),
  hydration_level  DECIMAL(5,2),
  sleep_hours      DECIMAL(5,2),
  steps_count      INT,
  ai_confidence    DECIMAL(5,2),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Daily adherence summary
CREATE TABLE daily_adherence (
  patient_id        INT NOT NULL,
  date              DATE NOT NULL,
  medications_taken INT DEFAULT 0,
  medications_missed INT DEFAULT 0,
  hydration_glasses INT DEFAULT 0,
  hydration_goal    INT DEFAULT 0,
  meals_completed   INT DEFAULT 0,
  meals_goal        INT DEFAULT 0,
  steps_walked      INT DEFAULT 0,
  steps_goal        INT DEFAULT 0,
  restroom_visits   INT DEFAULT 0,
  sleep_hours       DECIMAL(5,2) DEFAULT 0,
  PRIMARY KEY (patient_id, date),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Mental health logs
CREATE TABLE mental_health_logs (
  log_id         INT AUTO_INCREMENT PRIMARY KEY,
  patient_id     INT NOT NULL,
  event_time     DATETIME NOT NULL,
  recorded_time  DATETIME NOT NULL,
  mood           VARCHAR(50),
  temperament    VARCHAR(50),
  stress_level   DECIMAL(5,2),
  notes          TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Medication schedules and logs
CREATE TABLE medication_schedule (
  med_id        INT AUTO_INCREMENT PRIMARY KEY,
  patient_id    INT NOT NULL,
  med_name      VARCHAR(100) NOT NULL,
  dosage        DECIMAL(10,2),
  unit          VARCHAR(20),
  schedule_time TIME NOT NULL,
  frequency     VARCHAR(50),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

CREATE TABLE medication_logs (
  log_id         INT AUTO_INCREMENT PRIMARY KEY,
  med_id         INT NOT NULL,
  patient_id     INT NOT NULL,
  event_time     DATETIME NOT NULL,
  recorded_time  DATETIME NOT NULL,
  status         VARCHAR(20) DEFAULT 'pending',
  recorded_by    INT,
  FOREIGN KEY (med_id)     REFERENCES medication_schedule(med_id),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  FOREIGN KEY (recorded_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Hydration reminders and logs
CREATE TABLE hydration_reminders (
  hydration_id   INT AUTO_INCREMENT PRIMARY KEY,
  patient_id     INT NOT NULL,
  scheduled_time TIME NOT NULL,
  frequency      VARCHAR(50),
  volume_goal_ml INT,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

CREATE TABLE hydration_logs (
  log_id        INT AUTO_INCREMENT PRIMARY KEY,
  hydration_id  INT NOT NULL,
  patient_id    INT NOT NULL,
  event_time    DATETIME NOT NULL,
  recorded_time DATETIME NOT NULL,
  volume_ml     INT,
  status        VARCHAR(20),
  FOREIGN KEY (hydration_id) REFERENCES hydration_reminders(hydration_id),
  FOREIGN KEY (patient_id)    REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Meal schedules and logs
CREATE TABLE meal_schedule (
  meal_id        INT AUTO_INCREMENT PRIMARY KEY,
  patient_id     INT NOT NULL,
  meal_type      ENUM('breakfast','lunch','dinner','snack'),
  scheduled_time TIME NOT NULL,
  meal_taken   BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

CREATE TABLE meal_logs (
  log_id        INT AUTO_INCREMENT PRIMARY KEY,
  meal_id       INT NOT NULL,
  patient_id    INT NOT NULL,
  event_time    DATETIME NOT NULL,
  recorded_time DATETIME NOT NULL,
  status        VARCHAR(20) DEFAULT 'pending',
  meal_taken_at DATETIME,
  end_time     DATETIME,
  FOREIGN KEY (meal_id)    REFERENCES meal_schedule(meal_id),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Sleep logs
CREATE TABLE sleep_logs (
  sleep_id          INT AUTO_INCREMENT PRIMARY KEY,
  patient_id        INT NOT NULL,
  date              DATE NOT NULL,
  sleep_start       DATETIME,
  sleep_end         DATETIME,
  total_sleep_hours DECIMAL(5,2),
  deep_sleep_hours  DECIMAL(5,2),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Movement history (location trail)
CREATE TABLE location_history (
  history_id    INT AUTO_INCREMENT PRIMARY KEY,
  patient_id    INT NOT NULL,
  location_id   INT,
  event_time    DATETIME NOT NULL,
  recorded_time DATETIME NOT NULL,
  confidence    DECIMAL(5,2),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
) ENGINE=InnoDB;

-- Inactivity-specific alerts
CREATE TABLE inactivity_alerts (
  alert_id       INT AUTO_INCREMENT PRIMARY KEY,
  patient_id     INT NOT NULL,
  start_time     DATETIME NOT NULL,
  duration_minutes INT,
  acknowledged_by INT,
  end_time        DATETIME,
  status         VARCHAR(20),
  FOREIGN KEY (patient_id)      REFERENCES patients(patient_id),
  FOREIGN KEY (acknowledged_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Environmental metrics (temperature, AQI, smoke density, humidity)
CREATE TABLE environmental_metrics (
  env_id         INT AUTO_INCREMENT PRIMARY KEY,
  patient_id     INT NOT NULL,
  location_id    INT,
  event_time     DATETIME NOT NULL,
  recorded_time  DATETIME NOT NULL,
  temperature_c  DECIMAL(5,2),
  air_quality_index INT,
  smoke_density  DECIMAL(5,2),
  humidity       DECIMAL(5,2),
  FOREIGN KEY (patient_id)  REFERENCES patients(patient_id),
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
) ENGINE=InnoDB;

-- Severity levels and escalation policies
CREATE TABLE escalation_policies (
  policy_id      INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  description    TEXT,
  escalation_steps TEXT
) ENGINE=InnoDB;

CREATE TABLE severity_levels (
  level_id      INT AUTO_INCREMENT PRIMARY KEY,
  level_name    VARCHAR(20) NOT NULL UNIQUE,
  priority      INT NOT NULL,
  color_code    VARCHAR(10),
  description   TEXT,
  policy_id     INT,
  FOREIGN KEY (policy_id) REFERENCES escalation_policies(policy_id)
) ENGINE=InnoDB;

-- Alert types
CREATE TABLE alert_types (
  alert_type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_name     VARCHAR(50) NOT NULL UNIQUE,
  description   TEXT
) ENGINE=InnoDB;

-- Unified alerts table
CREATE TABLE alerts (
  alert_id        INT AUTO_INCREMENT PRIMARY KEY,
  patient_id      INT NOT NULL,
  facility_id     INT,
  alert_type_id   INT NOT NULL,
  severity_level_id INT NOT NULL,
  location_id     INT,
  source_sensor_id INT,
  description     TEXT,
  event_time      DATETIME NOT NULL,
  recorded_time   DATETIME NOT NULL,
  status          ENUM('active','resolved','acknowledged') DEFAULT 'active',
  acknowledged_by INT,
  feedback_status ENUM('true_positive','false_positive','false_alarm','unreviewed') DEFAULT 'unreviewed',
  FOREIGN KEY (patient_id)        REFERENCES patients(patient_id),
  FOREIGN KEY (facility_id)       REFERENCES facilities(facility_id),
  FOREIGN KEY (alert_type_id)     REFERENCES alert_types(alert_type_id),
  FOREIGN KEY (severity_level_id) REFERENCES severity_levels(level_id),
  FOREIGN KEY (location_id)       REFERENCES locations(location_id),
  FOREIGN KEY (source_sensor_id)  REFERENCES sensors(sensor_id),
  FOREIGN KEY (acknowledged_by)   REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Alert metadata (key/value)
CREATE TABLE alert_details (
  detail_id    INT AUTO_INCREMENT PRIMARY KEY,
  alert_id     INT NOT NULL,
  detail_key   VARCHAR(100),
  detail_value TEXT,
  confidence   DECIMAL(5,2),
  FOREIGN KEY (alert_id) REFERENCES alerts(alert_id)
) ENGINE=InnoDB;

-- Per-role alert visibility (full vs summary)
CREATE TABLE alert_role_visibility (
  alert_id   INT NOT NULL,
  role_id    INT NOT NULL,
  visibility ENUM('full','summary') NOT NULL,
  PRIMARY KEY (alert_id, role_id),
  FOREIGN KEY (alert_id) REFERENCES alerts(alert_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB;

-- Specialized alert data (optional)
CREATE TABLE smoke_alerts (
  alert_id  INT PRIMARY KEY,
  env_id    INT NOT NULL,
  sensor_id INT,
  severity  VARCHAR(20),
  message   VARCHAR(255),
  FOREIGN KEY (alert_id) REFERENCES alerts(alert_id),
  FOREIGN KEY (env_id)   REFERENCES environmental_metrics(env_id),
  FOREIGN KEY (sensor_id) REFERENCES sensors(sensor_id)
) ENGINE=InnoDB;

CREATE TABLE device_health_alerts (
  alert_id  INT PRIMARY KEY,
  sensor_id INT NOT NULL,
  issue_type VARCHAR(20),
  severity   VARCHAR(20),
  FOREIGN KEY (alert_id) REFERENCES alerts(alert_id),
  FOREIGN KEY (sensor_id) REFERENCES sensors(sensor_id)
) ENGINE=InnoDB;

CREATE TABLE voice_alerts (
  alert_id           INT PRIMARY KEY,
  detected_phrase    VARCHAR(255),
  keywords           VARCHAR(255),
  confidence_level   DECIMAL(5,2),
  vocal_stress_level DECIMAL(5,2),
  speech_clarity     DECIMAL(5,2),
  baseline_deviation DECIMAL(5,2),
  FOREIGN KEY (alert_id) REFERENCES alerts(alert_id)
) ENGINE=InnoDB;

-- Emergency responders and their facility assignments
CREATE TABLE emergency_responders (
  responder_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  facility_id    INT NOT NULL,
  responder_type ENUM('security','fire','ems') NOT NULL,
  active         BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id)    REFERENCES users(user_id),
  FOREIGN KEY (facility_id) REFERENCES facilities(facility_id)
) ENGINE=InnoDB;

-- Log time-limited emergency access to patient data
CREATE TABLE emergency_access_logs (
  access_id        INT AUTO_INCREMENT PRIMARY KEY,
  responder_id     INT NOT NULL,
  alert_id         INT NOT NULL,
  access_granted_at DATETIME NOT NULL,
  access_revoked_at DATETIME,
  FOREIGN KEY (responder_id) REFERENCES emergency_responders(responder_id),
  FOREIGN KEY (alert_id)     REFERENCES alerts(alert_id)
) ENGINE=InnoDB;

-- Routes and steps for emergency wayfinding
CREATE TABLE routes (
  route_id    INT AUTO_INCREMENT PRIMARY KEY,
  alert_id    INT NOT NULL,
  patient_id  INT NOT NULL,
  route_name  VARCHAR(100),
  created_at  DATETIME NOT NULL,
  notes       TEXT,
  FOREIGN KEY (alert_id)   REFERENCES alerts(alert_id),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

CREATE TABLE route_steps (
  route_id   INT NOT NULL,
  step_order INT NOT NULL,
  location_id INT NOT NULL,
  instruction TEXT,
  hazard_note TEXT,
  PRIMARY KEY (route_id, step_order),
  FOREIGN KEY (route_id)    REFERENCES routes(route_id),
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
) ENGINE=InnoDB;

-- Event feed for chronological logs
CREATE TABLE event_feed (
  event_id      INT AUTO_INCREMENT PRIMARY KEY,
  patient_id    INT NOT NULL,
  event_time    DATETIME NOT NULL,
  recorded_time DATETIME NOT NULL,
  event_type    VARCHAR(50) NOT NULL,
  description   TEXT,
  severity      VARCHAR(20),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Appointments for clinical visits and therapy sessions
CREATE TABLE appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id     INT NOT NULL,
  provider_name  VARCHAR(100),
  appointment_type VARCHAR(50),
  start_time     DATETIME,
  end_time       DATETIME,
  status         VARCHAR(20),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Reminders and logs for medication/hydration/exercise/check-in
CREATE TABLE reminder_schedule (
  reminder_id   INT AUTO_INCREMENT PRIMARY KEY,
  patient_id    INT NOT NULL,
  reminder_type VARCHAR(50),
  scheduled_time TIME,
  frequency     VARCHAR(50),
  description   TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

CREATE TABLE reminder_logs (
  log_id         INT AUTO_INCREMENT PRIMARY KEY,
  reminder_id    INT NOT NULL,
  patient_id     INT NOT NULL,
  event_time     DATETIME NOT NULL,
  recorded_time  DATETIME NOT NULL,
  acknowledged   ENUM('yes','no') DEFAULT 'no',
  acknowledged_by INT,
  FOREIGN KEY (reminder_id)    REFERENCES reminder_schedule(reminder_id),
  FOREIGN KEY (patient_id)     REFERENCES patients(patient_id),
  FOREIGN KEY (acknowledged_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Messaging between users
CREATE TABLE messages (
  message_id     INT AUTO_INCREMENT PRIMARY KEY,
  sender_id      INT NOT NULL,
  receiver_id    INT NOT NULL,
  event_time     DATETIME NOT NULL,
  recorded_time  DATETIME NOT NULL,
  content        TEXT,
  channel        ENUM('text','voice_note','video_call') NOT NULL,
  thread_id      INT,
  FOREIGN KEY (sender_id)  REFERENCES users(user_id),
  FOREIGN KEY (receiver_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Voice/video call logs
CREATE TABLE calls (
  call_id     INT AUTO_INCREMENT PRIMARY KEY,
  caller_id   INT NOT NULL,
  callee_id   INT NOT NULL,
  start_time  DATETIME NOT NULL,
  end_time    DATETIME,
  call_type   ENUM('voice','video') NOT NULL,
  status      VARCHAR(20),
    -- Optional URL or path to the stored call recording
  call_recordings VARCHAR(255),
  FOREIGN KEY (caller_id) REFERENCES users(user_id),
  FOREIGN KEY (callee_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Risk scores per patient for ML-driven triage
CREATE TABLE patient_risk_scores (
  risk_id       INT AUTO_INCREMENT PRIMARY KEY,
  patient_id    INT NOT NULL,
  event_time    DATETIME NOT NULL,
  recorded_time DATETIME NOT NULL,
  risk_score    DECIMAL(5,2),
  risk_factors  JSON,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

-- Generic AI inferences and metadata
CREATE TABLE ai_inferences (
  inference_id   INT AUTO_INCREMENT PRIMARY KEY,
  patient_id     INT NOT NULL,
  alert_id       INT,
  model_version  VARCHAR(50),
  input_sources  TEXT,
  output         TEXT,
  confidence     DECIMAL(5,2),
  metadata       JSON,
  event_time     DATETIME NOT NULL,
  recorded_time  DATETIME NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  FOREIGN KEY (alert_id)   REFERENCES alerts(alert_id)
) ENGINE=InnoDB;

-- Audit logs for compliance and security
CREATE TABLE audit_logs (
  audit_id     INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  action       VARCHAR(100) NOT NULL,
  target_type  VARCHAR(50) NOT NULL,    -- e.g., patient, alert, sensor, user
  target_id    INT,
  timestamp    DATETIME NOT NULL,
  ip_address   VARCHAR(45),
  device_info  VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Rules engine core tables
CREATE TABLE rule_definitions (
  rule_id       INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  description   TEXT,
  event_type    VARCHAR(50) NOT NULL,
  scope_tier    ENUM('care_t1','care_t2','care_t3','home','all') DEFAULT 'all',
  facility_id   INT NULL,
  patient_id    INT NULL,
  priority      INT DEFAULT 0,
  is_enabled    BOOLEAN DEFAULT TRUE,
  created_at    DATETIME NOT NULL,
  modified_at   DATETIME,
  FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
  FOREIGN KEY (patient_id)  REFERENCES patients(patient_id)
) ENGINE=InnoDB;

CREATE TABLE rule_conditions (
  condition_id  INT AUTO_INCREMENT PRIMARY KEY,
  rule_id       INT NOT NULL,
  field_name    VARCHAR(50) NOT NULL,
  operator      ENUM('eq','neq','gt','gte','lt','lte','between','contains','in') NOT NULL,
  value_text    VARCHAR(255) NOT NULL,
  sequence      INT NOT NULL DEFAULT 1,
  FOREIGN KEY (rule_id) REFERENCES rule_definitions(rule_id)
) ENGINE=InnoDB;

CREATE TABLE rule_actions (
  action_id     INT AUTO_INCREMENT PRIMARY KEY,
  rule_id       INT NOT NULL,
  action_type   VARCHAR(50) NOT NULL,
  param_key     VARCHAR(50) NOT NULL,
  param_value   VARCHAR(255),
  sequence      INT NOT NULL DEFAULT 1,
  FOREIGN KEY (rule_id) REFERENCES rule_definitions(rule_id)
) ENGINE=InnoDB;
