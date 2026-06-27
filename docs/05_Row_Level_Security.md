# WorkHub AI

# Row Level Security (RLS)

**Version:** 1.0

---

# Overview

Row Level Security (RLS) ensures that every authenticated user can only access data they are authorized to see. Authorization is enforced directly by PostgreSQL rather than application code.

---

# Helper Functions

## my_department_id()

Returns the department ID of the currently authenticated user.

Used by nearly every policy to isolate department data.

---

## my_role()

Returns the role of the authenticated user.

Possible values:

- hod
- faculty
- coordinator

---

## is_hod()

Returns `true` when the authenticated user is the Head of Department.

---

## is_coordinator()

Returns `true` when the authenticated user is a coordinator.

---

# Table Policies

| Table | Read | Insert | Update |
|--------|------|--------|--------|
| departments | Own department | No | No |
| faculty | Own department | No | Own profile |
| announcements | Own department | HOD / Coordinator | HOD / Author |
| meetings | Own department | HOD / Coordinator | HOD |
| documents | Own department | Own department | Own department |
| tasks | Own department | HOD / Coordinator | Own department |
| knowledge_items | Own department | Backend only | Backend only |
| embeddings | Own department | Backend only | Backend only |

---

# Security Model

```
Authenticated User
        │
        ▼
auth.uid()
        │
        ▼
faculty table
        │
        ├── department_id
        └── role
        │
        ▼
Helper Functions
        │
        ▼
RLS Policies
        │
        ▼
Filtered Database Results
```

---

# Permission Matrix

| Role | Read | Create | Update |
|------|------|--------|--------|
| Faculty | Department data | Documents | Own profile |
| Coordinator | Department data | Announcements, Meetings, Tasks | Department records (where permitted) |
| HOD | Department data | All department records | All department records |

---

# AI Layer

The `knowledge_items` and `embeddings` tables are readable by authenticated users within their department but are intended to be written only by trusted backend processes using the service role.

---

# End of Document