import { NextResponse } from 'next/server';
import { getApiDocs } from '../../../lib/swagger';

/**
 * API endpoint to serve Swagger spec
 * Used by the API documentation UI
 */
export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
}
