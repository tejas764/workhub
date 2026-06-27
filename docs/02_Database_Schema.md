# WorkHub AI
# Database Schema Documentation
**Version:** 1.0  
**Module:** Database Design  
**Database:** PostgreSQL (Supabase)  
**Last Updated:** June 2026

---

# 1. Overview

This document describes the complete database schema for the **WorkHub AI** platform.

The database is designed to support a department-level faculty management system with an integrated AI knowledge layer. It stores operational data such as faculty, announcements, meetings, documents, and tasks, while also maintaining AI-ready knowledge and vector embeddings for semantic search.

---

# Database Architecture

```
Departments
      │
      ├──────── Faculty
      │             │
      │             ├──────── Announcements
      │             ├──────── Tasks
      │
      ├──────── Meetings
      │
      ├──────── Documents
      │
      └──────── Knowledge Items
                      │
                      │
                 Embeddings
```

---

# Database Statistics

| Item | Count |
|------|------:|
| Operational Tables | 6 |
| AI Tables | 2 |
| Total Tables | 8 |
| Primary Keys | 8 |
| Foreign Key Relationships | 8 |
| Vector Tables | 1 |

---

# Naming Convention

| Object | Convention | Example |
|----------|------------|----------|
| Tables | snake_case | faculty |
| Columns | snake_case | department_id |
| Primary Key | id | id |
| Foreign Key | referenced_table_id | department_id |
| Timestamp | created_at | created_at |
| Update Timestamp | updated_at | updated_at |

---

# UUID Strategy

Every table uses UUIDs as the primary key.

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

Reasons:

- Globally unique identifiers
- Better distributed systems support
- Prevents sequential ID enumeration
- Suitable for future scaling

---

# Timestamp Strategy

Every table contains:

```text
created_at
```

Tables that allow updates additionally contain:

```text
updated_at
```

These timestamps are used for:

- Audit history
- Sorting
- Synchronization
- AI summarization
- Future analytics

---

# 2. Table Documentation

---

# Table: departments

## Purpose

Stores all academic departments within the institution.

Every operational record belongs to one department.

---

## Columns

| Column | Data Type | Constraint | Description |
|---------|-----------|------------|-------------|
| id | UUID | Primary Key | Unique department identifier |
| name | TEXT | NOT NULL | Department name |
| code | TEXT | UNIQUE, NOT NULL | Department code (e.g. CSE) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |

---

## Primary Key

```
id
```

---

## Foreign Keys

None

---

## Constraints

- Primary Key
- Unique department code
- Department name cannot be null

---

## Relationships

```
One Department

↓

Many Faculty

Many Announcements

Many Meetings

Many Documents

Many Tasks

Many Knowledge Items
```

---

# Table: faculty

## Purpose

Stores all faculty members including HODs, coordinators, and teaching staff.

This table represents application users.

---

## Columns

| Column | Data Type | Constraint | Description |
|---------|-----------|------------|-------------|
| id | UUID | Primary Key | Faculty ID |
| user_id | UUID | UNIQUE | References authenticated user |
| name | TEXT | NOT NULL | Faculty name |
| email | TEXT | UNIQUE, NOT NULL | Faculty email |
| designation | TEXT | NOT NULL | Faculty designation |
| department_id | UUID | Foreign Key | Department reference |
| role | TEXT | CHECK | User role |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

---

## Primary Key

```
id
```

---

## Foreign Key

```
department_id

↓

departments.id
```

---

## Constraints

- Email must be unique
- User ID must be unique
- Role must be one of:

```
hod
faculty
coordinator
```

---

## Relationships

```
One Faculty

↓

Many Announcements

Many Tasks
```

---

# Table: announcements

## Purpose

Stores official announcements made within a department.

These announcements are visible only to users belonging to the same department.

---

## Columns

| Column | Data Type | Constraint | Description |
|---------|-----------|------------|-------------|
| id | UUID | Primary Key | Announcement ID |
| title | TEXT | NOT NULL | Announcement title |
| content | TEXT | NOT NULL | Announcement body |
| category | TEXT | Optional | Announcement category |
| department_id | UUID | Foreign Key | Department reference |
| uploaded_by | UUID | Foreign Key | Faculty who created the announcement |
| ai_summary | TEXT | Optional | AI-generated summary |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last modification timestamp |

---

## Primary Key

```
id
```

---

## Foreign Keys

```
department_id

↓

departments.id
```

```
uploaded_by

↓

faculty.id
```

---

## Relationships

```
Many Announcements

↓

One Department

↓

One Faculty
```

---

# Table: meetings

## Purpose

Stores department meeting information including minutes, decisions, and action items.

---

## Columns

| Column | Data Type | Constraint | Description |
|---------|-----------|------------|-------------|
| id | UUID | Primary Key | Meeting ID |
| title | TEXT | NOT NULL | Meeting title |
| meeting_date | TIMESTAMPTZ | NOT NULL | Meeting date and time |
| minutes | TEXT | Optional | Meeting minutes |
| decisions | TEXT | Optional | Meeting decisions |
| action_items | TEXT | Optional | Assigned actions |
| ai_summary | TEXT | Optional | AI-generated summary |
| department_id | UUID | Foreign Key | Department reference |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last modification timestamp |

---

## Primary Key

```
id
```

---

## Foreign Key

```
department_id

↓

departments.id
```

---

## Relationships

```
Many Meetings

↓

One Department
```

---

# Table: documents

## Purpose

Stores metadata about uploaded departmental documents.

Actual files are stored in Supabase Storage.

---

## Columns

| Column | Data Type | Constraint | Description |
|---------|-----------|------------|-------------|
| id | UUID | Primary Key | Document ID |
| title | TEXT | NOT NULL | Document title |
| document_type | TEXT | Optional | Document category |
| storage_path | TEXT | NOT NULL | Storage bucket path |
| extracted_text | TEXT | Optional | Extracted document content |
| ai_summary | TEXT | Optional | AI-generated summary |
| department_id | UUID | Foreign Key | Department reference |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last modification timestamp |

---

## Primary Key

```
id
```

---

## Foreign Key

```
department_id

↓

departments.id
```

---

## Relationships

```
Many Documents

↓

One Department
```

---

# Table: tasks

## Purpose

Stores faculty assignments and departmental tasks.

---

## Columns

| Column | Data Type | Constraint | Description |
|---------|-----------|------------|-------------|
| id | UUID | Primary Key | Task ID |
| title | TEXT | NOT NULL | Task title |
| assigned_to | UUID | Foreign Key | Assigned faculty |
| due_date | TIMESTAMPTZ | Optional | Due date |
| status | TEXT | CHECK | Task status |
| department_id | UUID | Foreign Key | Department reference |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last modification timestamp |

---

## Primary Key

```
id
```

---

## Foreign Keys

```
assigned_to

↓

faculty.id
```

```
department_id

↓

departments.id
```

---

## Constraints

Status must be one of:

```
Pending
In Progress
Completed
```

---

## Relationships

```
Many Tasks

↓

One Faculty

↓

One Department
```

---

# Table: knowledge_items

## Purpose

Acts as the centralized AI knowledge repository.

Operational data from announcements, meetings, documents, and other sources is transformed into searchable knowledge entries for semantic search.

---

## Columns

| Column | Data Type | Constraint | Description |
|---------|-----------|------------|-------------|
| id | UUID | Primary Key | Knowledge item ID |
| source | TEXT | NOT NULL | Source table name |
| source_id | UUID | NOT NULL | Original record ID |
| title | TEXT | NOT NULL | Knowledge title |
| content | TEXT | NOT NULL | Searchable content |
| ai_summary | TEXT | Optional | AI summary |
| department_id | UUID | Foreign Key | Department reference |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last modification timestamp |

---

## Primary Key

```
id
```

---

## Foreign Key

```
department_id

↓

departments.id
```

---

## Relationships

```
One Department

↓

Many Knowledge Items

↓

One Embedding
```

---

# Table: embeddings

## Purpose

Stores vector embeddings generated from knowledge items.

These vectors enable semantic search using pgvector.

---

## Columns

| Column | Data Type | Constraint | Description |
|---------|-----------|------------|-------------|
| id | UUID | Primary Key | Embedding ID |
| knowledge_id | UUID | Foreign Key | Knowledge item reference |
| vector | VECTOR(768) | NOT NULL | Embedding vector |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

---

## Primary Key

```
id
```

---

## Foreign Key

```
knowledge_id

↓

knowledge_items.id
```

---

## Relationships

```
One Knowledge Item

↓

One Embedding
```

---

# Complete Relationship Summary

| Parent Table | Child Table | Relationship |
|--------------|-------------|--------------|
| departments | faculty | One-to-Many |
| departments | announcements | One-to-Many |
| departments | meetings | One-to-Many |
| departments | documents | One-to-Many |
| departments | tasks | One-to-Many |
| departments | knowledge_items | One-to-Many |
| faculty | announcements | One-to-Many |
| faculty | tasks | One-to-Many |
| knowledge_items | embeddings | One-to-One |

---

# AI Layer Overview

The AI layer consists of two dedicated tables:

- **knowledge_items** – Stores normalized, searchable text from operational data.
- **embeddings** – Stores 768-dimensional vector embeddings generated from `knowledge_items`.

This separation allows operational tables to remain normalized while enabling efficient semantic search without modifying the original business data.

---

# Schema Summary

| Table | Purpose |
|--------|---------|
| departments | Department master data |
| faculty | Faculty and user information |
| announcements | Department announcements |
| meetings | Meeting records |
| documents | Uploaded document metadata |
| tasks | Faculty task management |
| knowledge_items | AI knowledge repository |
| embeddings | Vector embeddings for semantic search |

---

# End of Document
