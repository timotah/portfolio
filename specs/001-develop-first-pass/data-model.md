# Phase 1: Data Model

## Entities

### Portfolio Owner
- name: string
- professionalLinks: array (GitHub, LinkedIn, etc.)
- credentials: string (from resume.pdf)
- contactMethods: array (email, social, etc.)
  - About Me section must begin with a short blurb introducing Tim and listing main contact methods.
  - There must be a separate Resume subsection within About Me that displays the resume content in HTML and offers a downloadable PDF link.

### Project
- title: string
- description: string
- link: string (optional)
  - Maximum: 10 projects displayed
  - If no projects exist, show a call-to-action to add projects.

### Learning Item
- topic: string
- progress: string
  - Maximum: 20 learning items displayed

### Navigation Section
- id: string (home, aboutme, projects, learning, contact)
- label: string
- route: string

### Contact Method
- type: string (email, social, etc.)
- value: string
  - Maximum: 5 contact methods displayed

## Relationships
- Portfolio Owner has many Projects
- Portfolio Owner has many Learning Items
- Portfolio Owner has many Contact Methods
- Navigation Section links to each main page/section
