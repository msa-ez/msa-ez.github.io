---
description: ''
sidebar: 'started'
---

# Aggregate Design

The **Aggregate Design** feature automatically analyzes existing system database schemas to design aggregates and helps developers efficiently implement Domain-Driven Design (DDD) principles.

This feature is particularly useful for system architects, backend developers, and domain designers:
- System Architects: Supports designing scalable and maintainable system architectures following domain-driven design principles.
- Backend Developers: Enables efficient definition of entities, value objects, and aggregate boundaries from database schemas.
- Domain Designers: Creates systematic and logical models by aligning technical models with business domains.

**Aggregate Design** is essential for maintaining business rules and data consistency. However, manually designing aggregates from legacy system DDL (Data Definition Language) schemas is labor-intensive and prone to errors. Analyzing table structures, mapping relationships, and repeating the same tasks whenever changes occur consumes significant time and effort.

## How It Works

<img src="https://github.com/user-attachments/assets/cb633bc6-af94-497e-864b-341e72605ef2">

- DDL Schema Input: Users provide database schemas describing tables and relationships.
<br><br>

<img src="https://github.com/user-attachments/assets/74f2e52d-dd5a-4f94-9344-da7983727810">

- Automatic Analysis: The tool analyzes schemas to identify potential entities, value objects, and their relationships.
- Aggregate Candidate Suggestions: Generates aggregate candidates by grouping entities and value objects based on domain-driven design principles.
- Customization Options: Users can fine-tune suggested aggregates to match domain requirements.
<br><br>

<img src="https://github.com/user-attachments/assets/c7e967ed-128b-47b3-8683-6f438ca760a4">

- Simplified Testing and Validation: Easily validate design scalability and consistency through the tool.

This feature evaluates multiple approaches to recommend options better suited for given business situations. It generates reports including pros and cons of each option by analyzing system requirements and constraints, helping users make decisions based on performance or consistency requirements.