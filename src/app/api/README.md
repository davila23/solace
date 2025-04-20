# API Routes Structure

This API follows Next.js App Router conventions with the following organization:

## Route Organization

- `advocates/`: Advocate management endpoints
- `auth/`: Authentication and authorization endpoints
  - `login/`: User login and token generation
  - `logout/`: User session termination
  - `check/`: Token validation
- `database/`: Database management
  - `status/`: Database connection status
- `seed/`: Seeding the database with initial data
- `users/`: User management endpoints

## Best Practices

1. **Route Handlers**: Each route uses the Next.js App Router handler pattern
2. **HTTP Methods**: Each endpoint exports functions named after HTTP methods (GET, POST, etc.)
3. **Input Validation**: Request data is validated at the API boundary
4. **Error Handling**: Consistent error response format
5. **Status Codes**: Appropriate HTTP status codes for different scenarios

## Example Structure

```
/api
  /advocates
    route.ts       # GET, POST handlers for collection
    /[id]
      route.ts     # GET, PUT, DELETE handlers for individual items
  /auth
    /login
      route.ts     # POST handler for login
```

This structure aligns with Next.js App Router conventions for scalable API development.
