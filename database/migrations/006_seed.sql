-- ============================================================
-- WORKHUB AI
-- DEVELOPMENT SEED DATA
-- Migration: 006_seed.sql
-- ============================================================

------------------------------------------------------------
-- DEPARTMENTS
------------------------------------------------------------

INSERT INTO departments (id, name, code)
VALUES
(gen_random_uuid(), 'Computer Science & Engineering', 'CSE'),
(gen_random_uuid(), 'Electronics & Communication', 'ECE');

------------------------------------------------------------
-- FACULTY
------------------------------------------------------------

INSERT INTO faculty
(
    id,
    user_id,
    name,
    email,
    designation,
    department_id,
    role
)
SELECT
    gen_random_uuid(),
    gen_random_uuid(),
    'Dr. Rajesh Kumar',
    'rajesh@college.edu',
    'Professor',
    id,
    'hod'
FROM departments
WHERE code='CSE';

INSERT INTO faculty
(
    id,
    user_id,
    name,
    email,
    designation,
    department_id,
    role
)
SELECT
    gen_random_uuid(),
    gen_random_uuid(),
    'Prof. Anita Sharma',
    'anita@college.edu',
    'Assistant Professor',
    id,
    'faculty'
FROM departments
WHERE code='CSE';

INSERT INTO faculty
(
    id,
    user_id,
    name,
    email,
    designation,
    department_id,
    role
)
SELECT
    gen_random_uuid(),
    gen_random_uuid(),
    'Prof. Rahul Mehta',
    'rahul@college.edu',
    'Associate Professor',
    id,
    'coordinator'
FROM departments
WHERE code='CSE';

------------------------------------------------------------
-- ANNOUNCEMENTS
------------------------------------------------------------

INSERT INTO announcements
(
title,
content,
category,
department_id,
uploaded_by
)

SELECT

'Faculty Meeting',

'Faculty meeting scheduled on Monday at 10 AM.',

'Meeting',

d.id,

f.id

FROM departments d

JOIN faculty f

ON d.id=f.department_id

WHERE d.code='CSE'

LIMIT 1;

------------------------------------------------------------
-- MEETINGS
------------------------------------------------------------

INSERT INTO meetings
(
title,
meeting_date,
minutes,
decisions,
action_items,
department_id
)

SELECT

'Semester Planning',

NOW()+INTERVAL '3 days',

'Agenda discussed',

'Approved timetable',

'Prepare timetable',

id

FROM departments

WHERE code='CSE';

------------------------------------------------------------
-- DOCUMENTS
------------------------------------------------------------

INSERT INTO documents
(
title,
document_type,
storage_path,
extracted_text,
department_id
)

SELECT

'Faculty Handbook',

'PDF',

'documents/cse/faculty/faculty-handbook.pdf',

'Faculty handbook extracted text.',

id

FROM departments

WHERE code='CSE';

------------------------------------------------------------
-- TASKS
------------------------------------------------------------

INSERT INTO tasks
(
title,
assigned_to,
due_date,
status,
department_id
)

SELECT

'Prepare Lab Timetable',

f.id,

NOW()+INTERVAL '7 days',

'Pending',

d.id

FROM faculty f

JOIN departments d

ON f.department_id=d.id

WHERE f.role='faculty'

LIMIT 1;

------------------------------------------------------------
-- KNOWLEDGE ITEMS
------------------------------------------------------------

INSERT INTO knowledge_items
(
source,
source_id,
title,
content,
ai_summary,
department_id
)

SELECT

'announcements',

a.id,

a.title,

a.content,

'Faculty meeting announcement.',

a.department_id

FROM announcements a;

------------------------------------------------------------
-- EMBEDDINGS
------------------------------------------------------------

INSERT INTO embeddings
(
knowledge_id,
vector
)

SELECT

id,

ARRAY_FILL(0.0::float4, ARRAY[768])::vector

FROM knowledge_items;
