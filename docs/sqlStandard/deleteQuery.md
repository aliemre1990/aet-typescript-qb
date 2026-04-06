Yes—here are common **DELETE query patterns** (SQL), with dialect notes:

### 1) Delete specific rows (`WHERE`)
````sql
DELETE FROM rentals
WHERE status = 'cancelled';
````

### 2) Delete all rows in a table
````sql
DELETE FROM rentals;
````
> Removes all rows (slower than `TRUNCATE` for very large tables).

### 3) Delete with `JOIN` (dialect-specific)

**PostgreSQL (`USING`)**
````sql
DELETE FROM rentals r
USING customers c
WHERE r.customer_id = c.id
  AND c.is_blacklisted = true;
````

**MySQL (`DELETE ... JOIN`)**
````sql
DELETE r
FROM rentals r
JOIN customers c ON c.id = r.customer_id
WHERE c.is_blacklisted = 1;
````

### 4) Delete with subquery
````sql
DELETE FROM rentals
WHERE car_id IN (
  SELECT id FROM cars WHERE retired = true
);
````

### 5) Delete with CTE
````sql
WITH old_rentals AS (
  SELECT id
  FROM rentals
  WHERE end_date < CURRENT_DATE - INTERVAL '2 years'
)
DELETE FROM rentals
WHERE id IN (SELECT id FROM old_rentals);
````

### 6) Delete and return removed rows (PostgreSQL)
````sql
DELETE FROM rentals
WHERE status = 'draft'
RETURNING id, customer_id, created_at;
````

### 7) Limited delete (dialect-specific)

**MySQL**
````sql
DELETE FROM rentals
WHERE status = 'draft'
ORDER BY created_at
LIMIT 100;
````

**SQL Server**
````sql
DELETE TOP (100) FROM rentals
WHERE status = 'draft';
````

### 8) Soft delete (common app pattern)
````sql
UPDATE rentals
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = 123;
````

If you want, I can also show these in your project’s query-builder style.