-- Sample Courses Data
INSERT INTO courses (
    title, description, age_group, schedule, duration, price, 
    instructor_name, instructor_bio, prerequisites, is_active, display_order
) VALUES 
(
    'Advanced Calculus Preparation',
    'Comprehensive calculus course covering limits, derivatives, integrals, and applications. Perfect preparation for university-level mathematics and math competitions.',
    'Grade 11-12',
    'Mon/Wed/Fri 4:00-6:00 PM',
    '16 weeks',
    299.99,
    'Dr. Sarah Chen',
    'PhD in Mathematics from MIT with 15 years of teaching experience. Former International Mathematical Olympiad coach.',
    'Completion of Pre-Calculus or equivalent mathematical background',
    true,
    1
),
(
    'Geometry & Problem Solving',
    'Advanced geometry concepts with focus on competition-style problem solving. Covers Euclidean geometry, coordinate geometry, and transformations.',
    'Grade 9-11',
    'Tue/Thu 5:00-7:00 PM',
    '12 weeks',
    249.99,
    'Prof. Michael Rodriguez',
    'Former MATHCOUNTS coach and Geometry textbook author. 20+ years of teaching experience.',
    'Basic understanding of algebra and geometric concepts',
    true,
    2
),
(
    'Number Theory Fundamentals',
    'Introduction to number theory including divisibility, modular arithmetic, prime numbers, and Diophantine equations.',
    'Grade 10-12',
    'Sat 2:00-5:00 PM',
    '10 weeks',
    199.99,
    'Dr. James Liu',
    'Number theory specialist with extensive competition mathematics background.',
    'Strong foundation in algebra',
    true,
    3
),
(
    'Mathematical Competition Training',
    'Intensive training for mathematical olympiads and competitions. Covers various problem-solving strategies and techniques.',
    'Grade 8-12',
    'Sun 1:00-4:00 PM',
    '20 weeks',
    399.99,
    'Dr. Sarah Chen',
    'PhD in Mathematics from MIT with 15 years of teaching experience. Former International Mathematical Olympiad coach.',
    'Prior competition experience preferred but not required',
    true,
    4
);

-- Sample Competitions Data
INSERT INTO competitions (
    title, description, start_date, end_date, registration_deadline,
    age_groups, fee, max_participants, status, rules, created_by
) VALUES 
(
    'CIMOC 2024 - Cambodia International Math Olympiad Competition',
    'Annual international mathematics competition featuring challenging problems across various mathematical disciplines. Open to students from across Asia.',
    '2024-07-15 09:00:00',
    '2024-07-17 17:00:00',
    '2024-07-01 23:59:59',
    '["Grade 9-10", "Grade 11-12"]',
    25.00,
    500,
    'open',
    'Competition consists of 6 problems to be solved over 2 days. Each problem worth 7 points. Solutions must be written in English. Calculator use is prohibited.',
    'user_2xHNnls55WR3hIsP3isErnHbPO6'
),
(
    'PHIMO 2024 - Physics and Mathematics Olympiad',
    'Combined physics and mathematics competition testing problem-solving skills in both disciplines.',
    '2024-08-20 10:00:00',
    '2024-08-22 16:00:00',
    '2024-08-05 23:59:59',
    '["Grade 10-11", "Grade 12", "University Level"]',
    30.00,
    300,
    'open',
    'Day 1: Mathematics problems (4 hours). Day 2: Physics problems (4 hours). Day 3: Combined interdisciplinary problems (3 hours).',
    'user_2xHNnls55WR3hIsP3isErnHbPO6'
),
(
    'MOVE Internal Competition 2024',
    'Internal competition for MOVE students to practice competition-style problems in a friendly environment.',
    '2024-06-10 14:00:00',
    '2024-06-10 18:00:00',
    '2024-06-05 23:59:59',
    '["Grade 8-9", "Grade 10-11", "Grade 12"]',
    0.00,
    100,
    'completed',
    'Single day competition with 8 problems. 4 hours to complete. Open book allowed for this practice competition.',
    'user_2xHNnls55WR3hIsP3isErnHbPO6'
);

-- Sample Competition Registrations (for completed competition)
INSERT INTO competition_registrations (
    competition_id, user_id, payment_status, payment_amount, status
) 
SELECT 
    c.id,
    'user_sample_student_001',
    'paid',
    0.00,
    'confirmed'
FROM competitions c 
WHERE c.title = 'MOVE Internal Competition 2024'
LIMIT 1;

INSERT INTO competition_registrations (
    competition_id, user_id, payment_status, payment_amount, status
) 
SELECT 
    c.id,
    'user_sample_student_002',
    'paid',
    0.00,
    'confirmed'
FROM competitions c 
WHERE c.title = 'MOVE Internal Competition 2024'
LIMIT 1;

-- Sample Competition Results (for completed competition)
INSERT INTO competition_results (
    competition_id, registration_id, rank, total_score, 
    individual_scores, published_at
)
SELECT 
    cr.competition_id,
    cr.id,
    1,
    42.5,
    '{"problem_1": 7, "problem_2": 6, "problem_3": 7, "problem_4": 5, "problem_5": 7, "problem_6": 6, "problem_7": 4.5, "problem_8": 0}',
    NOW()
FROM competition_registrations cr
JOIN competitions c ON cr.competition_id = c.id
WHERE c.title = 'MOVE Internal Competition 2024'
AND cr.user_id = 'user_sample_student_001'
LIMIT 1;

INSERT INTO competition_results (
    competition_id, registration_id, rank, total_score, 
    individual_scores, published_at
)
SELECT 
    cr.competition_id,
    cr.id,
    2,
    38.0,
    '{"problem_1": 6, "problem_2": 7, "problem_3": 5, "problem_4": 6, "problem_5": 4, "problem_6": 7, "problem_7": 3, "problem_8": 0}',
    NOW()
FROM competition_registrations cr
JOIN competitions c ON cr.competition_id = c.id
WHERE c.title = 'MOVE Internal Competition 2024'
AND cr.user_id = 'user_sample_student_002'
LIMIT 1; 