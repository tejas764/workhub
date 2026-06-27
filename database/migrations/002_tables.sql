-- =====================================================
-- WORKHUB AI DATABASE SCHEMA
-- Migration: 002_tables.sql
-- =====================================================

-- =====================================================
-- DEPARTMENTS
-- =====================================================

CREATE TABLE departments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    code TEXT UNIQUE NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()

);

-- =====================================================
-- FACULTY
-- =====================================================

CREATE TABLE faculty (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID UNIQUE,

    name TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    designation TEXT NOT NULL,

    department_id UUID NOT NULL,

    role TEXT NOT NULL CHECK (
        role IN ('hod','faculty','coordinator')
    ),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_faculty_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE

);

-- =====================================================
-- ANNOUNCEMENTS
-- =====================================================

CREATE TABLE announcements (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    content TEXT NOT NULL,

    category TEXT,

    department_id UUID NOT NULL,

    uploaded_by UUID NOT NULL,

    ai_summary TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_announcement_department
    FOREIGN KEY(department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_uploaded_by
    FOREIGN KEY(uploaded_by)
    REFERENCES faculty(id)
    ON DELETE CASCADE

);

-- =====================================================
-- MEETINGS
-- =====================================================

CREATE TABLE meetings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    meeting_date TIMESTAMPTZ NOT NULL,

    minutes TEXT,

    decisions TEXT,

    action_items TEXT,

    ai_summary TEXT,

    department_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_meeting_department
    FOREIGN KEY(department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE

);

-- =====================================================
-- DOCUMENTS
-- =====================================================

CREATE TABLE documents (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    document_type TEXT,

    storage_path TEXT NOT NULL,

    extracted_text TEXT,

    ai_summary TEXT,

    department_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_document_department
    FOREIGN KEY(department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE

);

-- =====================================================
-- TASKS
-- =====================================================

CREATE TABLE tasks (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    assigned_to UUID NOT NULL,

    due_date TIMESTAMPTZ,

    status TEXT DEFAULT 'Pending'
    CHECK (
        status IN (
            'Pending',
            'In Progress',
            'Completed'
        )
    ),

    department_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_task_faculty
    FOREIGN KEY(assigned_to)
    REFERENCES faculty(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_task_department
    FOREIGN KEY(department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE

);

-- =====================================================
-- KNOWLEDGE ITEMS (AI)
-- =====================================================

CREATE TABLE knowledge_items (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    source TEXT NOT NULL,

    source_id UUID NOT NULL,

    title TEXT NOT NULL,

    content TEXT NOT NULL,

    ai_summary TEXT,

    department_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_knowledge_department
    FOREIGN KEY(department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE

);

-- =====================================================
-- EMBEDDINGS (AI)
-- =====================================================

CREATE TABLE embeddings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    knowledge_id UUID NOT NULL,

    vector VECTOR(768) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_embedding_knowledge
    FOREIGN KEY(knowledge_id)
    REFERENCES knowledge_items(id)
    ON DELETE CASCADE

);
