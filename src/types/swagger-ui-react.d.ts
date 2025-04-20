declare module 'swagger-ui-react' {
  import React from 'react';

  interface SwaggerUIProps {
    spec?: any;
    url?: string;
    layout?: string;
    docExpansion?: 'list' | 'full' | 'none';
    [key: string]: any;
  }

  const SwaggerUI: React.FC<SwaggerUIProps>;
  
  export default SwaggerUI;
}
