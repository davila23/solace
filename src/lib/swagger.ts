import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Solace Advocates API Documentation',
        version: '1.0.0',
        description: 'Documentation for the Solace Advocates REST API endpoints',
        contact: {
          name: 'Daniel Avila',
          email: 'daniel.avila@rottay.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local development server',
        },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'auth-token',
          },
        },
        schemas: {
          Advocate: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                format: 'int32',
                description: 'Unique identifier for the advocate',
              },
              firstName: {
                type: 'string',
                description: 'First name of the advocate',
              },
              lastName: {
                type: 'string',
                description: 'Last name of the advocate',
              },
              city: {
                type: 'string',
                description: 'City where the advocate is located',
              },
              degree: {
                type: 'string',
                description: 'Educational degree of the advocate',
                enum: ['MD', 'PhD', 'MSW'],
              },
              specialties: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'List of healthcare specialties',
              },
              yearsOfExperience: {
                type: 'integer',
                format: 'int32',
                description: 'Number of years of professional experience',
              },
              phoneNumber: {
                type: 'integer',
                format: 'int64',
                description: 'Contact phone number',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Date and time when the advocate was created',
              },
            },
            required: [
              'firstName', 
              'lastName', 
              'city', 
              'degree', 
              'specialties', 
              'yearsOfExperience',
              'phoneNumber'
            ],
          },
          LoginRequest: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
                description: 'Username for authentication',
              },
              password: {
                type: 'string',
                description: 'Password for authentication',
              },
            },
            required: ['username', 'password'],
          },
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                format: 'int32',
                description: 'Unique identifier for the user',
              },
              username: {
                type: 'string',
                description: 'Username for login',
              },
              role: {
                type: 'string',
                description: 'Role of the user',
                enum: ['admin', 'user'],
              },
              name: {
                type: 'string',
                description: 'Display name of the user',
              },
            },
          },
          PaginationInfo: {
            type: 'object',
            properties: {
              total: {
                type: 'integer',
                description: 'Total number of records',
              },
              page: {
                type: 'integer',
                description: 'Current page number',
              },
              limit: {
                type: 'integer',
                description: 'Number of records per page',
              },
              totalPages: {
                type: 'integer',
                description: 'Total number of pages',
              },
            },
          },
          Error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Error message',
              },
            },
          },
        },
        responses: {
          UnauthorizedError: {
            description: 'Authentication information is missing or invalid',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          ForbiddenError: {
            description: 'The user does not have required permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      tags: [
        {
          name: 'Authentication',
          description: 'Endpoints for user authentication and session management',
        },
        {
          name: 'Advocates',
          description: 'Endpoints for healthcare advocate management',
        },
      ],
    },
  });
  return spec;
};
