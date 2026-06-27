# WorkHub AI

# Supabase Storage Configuration

**Version:** 1.0

---

# Storage Buckets

| Bucket | Purpose | Public |
|----------|---------|--------|
| documents | Department documents | No |
| meeting-files | Meeting attachments | No |
| avatars | Faculty profile images | No |

---

# Folder Structure

## documents

```text
documents/
    department_id/
        announcements/
        circulars/
        notices/
        reports/
        syllabus/
        assignments/
        faculty/
        miscellaneous/
```

---

## meeting-files

```text
meeting-files/
    department_id/
        meeting_id/
            agenda.pdf
            minutes.pdf
            attendance.xlsx
            attachments/
```

---

## avatars

```text
avatars/
    faculty_id/
        profile.jpg
```

---

# File Naming Convention

- lowercase only
- use hyphens
- no spaces
- descriptive names

Example

```
meeting-minutes-2026-06.pdf
```

---

# Storage Flow

```
Upload

↓

Supabase Storage

↓

storage_path

↓

documents table

↓

AI processing

↓

knowledge_items

↓

embeddings
```

---

# End of Document
