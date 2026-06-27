-- ============================================================
-- WORKHUB AI
-- ROW LEVEL SECURITY
-- Migration: 005_rls.sql
-- ============================================================

------------------------------------------------------------
-- ENABLE RLS
------------------------------------------------------------

ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

------------------------------------------------------------
-- HELPER FUNCTION
-- CURRENT USER DEPARTMENT
------------------------------------------------------------

CREATE OR REPLACE FUNCTION my_department_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
SELECT department_id
FROM faculty
WHERE user_id = auth.uid()
LIMIT 1;
$$;

------------------------------------------------------------
-- HELPER FUNCTION
-- CURRENT USER ROLE
------------------------------------------------------------

CREATE OR REPLACE FUNCTION my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
SELECT role
FROM faculty
WHERE user_id = auth.uid()
LIMIT 1;
$$;

------------------------------------------------------------
-- HELPER FUNCTION
-- HOD CHECK
------------------------------------------------------------

CREATE OR REPLACE FUNCTION is_hod()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
SELECT EXISTS (
    SELECT 1
    FROM faculty
    WHERE user_id = auth.uid()
      AND role = 'hod'
);
$$;

------------------------------------------------------------
-- HELPER FUNCTION
-- COORDINATOR CHECK
------------------------------------------------------------

CREATE OR REPLACE FUNCTION is_coordinator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
SELECT EXISTS (
    SELECT 1
    FROM faculty
    WHERE user_id = auth.uid()
      AND role = 'coordinator'
);
$$;

------------------------------------------------------------
-- DEPARTMENTS
------------------------------------------------------------

CREATE POLICY departments_select
ON departments
FOR SELECT
TO authenticated
USING (
    id = my_department_id()
);

------------------------------------------------------------
-- FACULTY
------------------------------------------------------------

CREATE POLICY faculty_select
ON faculty
FOR SELECT
TO authenticated
USING (
    department_id = my_department_id()
);

CREATE POLICY faculty_update_self
ON faculty
FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid()
);

------------------------------------------------------------
-- ANNOUNCEMENTS
------------------------------------------------------------

CREATE POLICY announcements_select
ON announcements
FOR SELECT
TO authenticated
USING (
    department_id = my_department_id()
);

CREATE POLICY announcements_insert
ON announcements
FOR INSERT
TO authenticated
WITH CHECK (
    is_hod() OR is_coordinator()
);

CREATE POLICY announcements_update
ON announcements
FOR UPDATE
TO authenticated
USING (
    is_hod() OR uploaded_by = auth.uid()
);

------------------------------------------------------------
-- MEETINGS
------------------------------------------------------------

CREATE POLICY meetings_select
ON meetings
FOR SELECT
TO authenticated
USING (
    department_id = my_department_id()
);

CREATE POLICY meetings_insert
ON meetings
FOR INSERT
TO authenticated
WITH CHECK (
    is_hod() OR is_coordinator()
);

CREATE POLICY meetings_update
ON meetings
FOR UPDATE
TO authenticated
USING (
    is_hod()
);

------------------------------------------------------------
-- DOCUMENTS
------------------------------------------------------------

CREATE POLICY documents_select
ON documents
FOR SELECT
TO authenticated
USING (
    department_id = my_department_id()
);

CREATE POLICY documents_insert
ON documents
FOR INSERT
TO authenticated
WITH CHECK (
    department_id = my_department_id()
);

CREATE POLICY documents_update
ON documents
FOR UPDATE
TO authenticated
USING (
    department_id = my_department_id()
);

------------------------------------------------------------
-- TASKS
------------------------------------------------------------

CREATE POLICY tasks_select
ON tasks
FOR SELECT
TO authenticated
USING (
    department_id = my_department_id()
);

CREATE POLICY tasks_insert
ON tasks
FOR INSERT
TO authenticated
WITH CHECK (
    is_hod() OR is_coordinator()
);

CREATE POLICY tasks_update
ON tasks
FOR UPDATE
TO authenticated
USING (
    department_id = my_department_id()
);

------------------------------------------------------------
-- KNOWLEDGE ITEMS
------------------------------------------------------------

CREATE POLICY knowledge_select
ON knowledge_items
FOR SELECT
TO authenticated
USING (
    department_id = my_department_id()
);

------------------------------------------------------------
-- EMBEDDINGS
------------------------------------------------------------

CREATE POLICY embeddings_select
ON embeddings
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM knowledge_items
        WHERE knowledge_items.id = embeddings.knowledge_id
          AND knowledge_items.department_id = my_department_id()
    )
);
