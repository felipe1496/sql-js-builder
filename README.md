<h1 align="center">SQL JS Builder</h1>

<p align="center">A SQL WHERE builder on JavaScript data structures</p>

# Motivation

Throughout my career as a developer, I’ve often found myself writing projects with minimal external dependencies. Over time, I’ve reduced even further the number of third-party libraries I rely on.

With that in mind, SQL JS Builder was created as a lightweight utility package to simplify the creation of SQL `WHERE` clauses in `SELECT` statements. Instead of dealing with error-prone string concatenation, the library provides a clean, JavaScript-based data structure combined with the builder pattern. This makes it easier to express complex filters in a structured way, while keeping your codebase maintainable and less dependent on external SQL manipulation libraries.

SQL JS Builder is fully driver-agnostic. Its output is just a plain SQL fragment, so you can plug it directly into any query by appending it to your WHERE clause — regardless of the database or ORM you're using.

# Caveats

- Placeholder

# Documentation
