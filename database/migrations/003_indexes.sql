-- =====================================================
-- WORKHUB AI
-- DATABASE INDEXES
-- Migration: 003_indexes.sql
-- =====================================================

---------------------------------------------------------
-- FACULTY
---------------------------------------------------------

CREATE INDEX idx_faculty_department
ON faculty(department_id);

CREATE INDEX idx_faculty_role
ON faculty(role);

CREATE INDEX idx_faculty_email
ON faculty(email);

---------------------------------------------------------
-- ANNOUNCEMENTS
---------------------------------------------------------

CREATE INDEX idx_announcements_department
ON announcements(department_id);

CREATE INDEX idx_announcements_uploaded_by
ON announcements(uploaded_by);

CREATE INDEX idx_announcements_category
ON announcements(category);

CREATE INDEX idx_announcements_created_at
ON announcements(created_at DESC);

---------------------------------------------------------
-- MEETINGS
---------------------------------------------------------

CREATE INDEX idx_meetings_department
ON meetings(department_id);

CREATE INDEX idx_meetings_date
ON meetings(meeting_date);

CREATE INDEX idx_meetings_created_at
ON meetings(created_at DESC);

---------------------------------------------------------
-- DOCUMENTS
---------------------------------------------------------

CREATE INDEX idx_documents_department
ON documents(department_id);

CREATE INDEX idx_documents_document_type
ON documents(document_type);

CREATE INDEX idx_documents_created_at
ON documents(created_at DESC);

---------------------------------------------------------
-- TASKS
---------------------------------------------------------

CREATE INDEX idx_tasks_department
ON tasks(department_id);

CREATE INDEX idx_tasks_assigned_to
ON tasks(assigned_to);

CREATE INDEX idx_tasks_due_date
ON tasks(due_date);

CREATE INDEX idx_tasks_status
ON tasks(status);

---------------------------------------------------------
-- KNOWLEDGE ITEMS
---------------------------------------------------------

CREATE INDEX idx_knowledge_department
ON knowledge_items(department_id);

CREATE INDEX idx_knowledge_source
ON knowledge_items(source);

CREATE INDEX idx_knowledge_source_id
ON knowledge_items(source_id);

---------------------------------------------------------
-- EMBEDDINGS
---------------------------------------------------------

CREATE INDEX idx_embeddings_knowledge
ON embeddings(knowledge_id);

CREATE INDEX idx_embeddings_vector
ON embeddings
USING ivfflat (vector vector_cosine_ops)
WITH (lists = 100);
