export interface Env {
  STORAGE: KVNamespace;
}

const MAX_BYTES = 10 * 1024; // 10 KB limit

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 1. Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Extract and sanitize key
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/+|\/+$/g, '').trim();

    if (!key || key.length > 256 || !/^[a-zA-Z0-9_\-\/]+$/.test(key)) {
      return jsonResponse(
        { error: 'Invalid key. Must be alphanumeric with dashes, underscores, or slashes, max 256 characters.' },
        400
      );
    }

    // 3. GET
    if (request.method === 'GET') {
      const data = await env.STORAGE.get(key);
      if (data === null) {
        return jsonResponse({ error: 'Not found' }, 404);
      }
      return new Response(data, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // 4. PUT / POST
    if (request.method === 'PUT' || request.method === 'POST') {
      const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
      if (contentLength > MAX_BYTES) {
        return jsonResponse({ error: 'Payload too large. Maximum allowed size is 10 KB.' }, 413);
      }

      const text = await request.text();
      const byteLength = new TextEncoder().encode(text).length;
      if (byteLength > MAX_BYTES) {
        return jsonResponse({ error: `Payload too large (${byteLength} bytes). Maximum allowed size is 10 KB.` }, 413);
      }

      try {
        JSON.parse(text);
      } catch {
        return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
      }

      await env.STORAGE.put(key, text);
      return jsonResponse({ success: true, key, bytes: byteLength }, 200);
    }

    // 5. DELETE
    if (request.method === 'DELETE') {
      await env.STORAGE.delete(key);
      return jsonResponse({ success: true, deleted: key }, 200);
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  },
};
