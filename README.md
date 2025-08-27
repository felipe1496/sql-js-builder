<h1 align="center">SQL JS Builder</h1>

<p align="center">A SQL WHERE builder on JavaScript data structures</p>

## Motivation

Throughout my career as a developer, I’ve often found myself writing projects with minimal external dependencies. Over time, I’ve reduced even further the number of third-party libraries I rely on.

SQL JS Builder is fully driver-agnostic. Its output is just a plain SQL fragment, so you can plug it directly into any query by appending it to your WHERE clause — regardless of the database or ORM you're using.

With that in mind, SQL JS Builder was created as a lightweight utility package to simplify the creation of SQL `WHERE` clauses in `SELECT` statements. Instead of dealing with error-prone string concatenation, the library provides a clean, JavaScript-based data structure combined with the builder pattern. This makes it easier to express complex filters in a structured way, while keeping your codebase maintainable and less dependent on external SQL manipulation libraries.

# Caveats

## Placeholders

Currently, **SQL JS Builder** uses `?` as the placeholder for values in your SQL statements. This design choice keeps the library simple, since it avoids dealing with indexed placeholders like `$1, $2, $3`.

In the future, I plan to add optional parsers for popular Node.js database drivers. For now, if your driver requires indexed placeholders (e.g. PostgreSQL with `$1, $2, $3`), you will need to implement your own parser.

Below is a simple example parser you can copy and adapt for your project if needed:

```typescript
/**
 * Replaces all `?` placeholders with `$1, $2, $3...`
 * Skips any `?` that appears inside single or double quotes.
 */
export function replacePlaceholders(sql: string): string {
  let result = "";
  let placeholderIndex = 1;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];

    if (char === "'" && !inDoubleQuote) {
      // toggle single quote mode
      inSingleQuote = !inSingleQuote;
      result += char;
      continue;
    }

    if (char === `"` && !inSingleQuote) {
      // toggle double quote mode
      inDoubleQuote = !inDoubleQuote;
      result += char;
      continue;
    }

    if (char === "?" && !inSingleQuote && !inDoubleQuote) {
      result += `$${placeholderIndex++}`;
    } else {
      result += char;
    }
  }

  return result;
}

// Usage

replacePlaceholders("SELECT * FROM users WHERE id = ? AND name = ?");
// SELECT * FROM users WHERE id = $1 AND name = $2

replacePlaceholders("SELECT * FROM logs WHERE message = '?' AND level = ?");
// SELECT * FROM logs WHERE message = '?' AND level = $1

replacePlaceholders('SELECT * FROM books WHERE title = "?" AND author_id = ?');
// SELECT * FROM books WHERE title = "?" AND author_id = $1
```

# Documentation

## Instalation

```shell
npm i sql-js-builder
```

## Getting Started

## where function

The where function lets you build WHERE filters using a JavaScript-friendly syntax instead of manual string concatenation.

```typescript
import { where } from "sql-js-builder";

const { sql, values } = where().and("name", "eq", "John Snow").build();

// sql: 1 = 1 AND "name" = ?
// values: ["John Snow"]
```

This returns a SQL string along with an array of the values you provided. You can then pass both directly to your database driver to run the query, like so:

```typescript
const { sql, values } = where()
  .and("age", "gte", 18)
  .and("country", "eq", "Brazil")
  .build();

const query = `SELECT * FROM users WHERE ${sql}`;
const [rows] = await db.execute(query, values);
```
