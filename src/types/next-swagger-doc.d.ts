declare module 'next-swagger-doc' {
  export interface SwaggerOptions {
    apiFolder: string;
    definition: any;
  }

  export function createSwaggerSpec(options: SwaggerOptions): any;
}
