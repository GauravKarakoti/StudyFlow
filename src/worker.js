const BUCKET_NAME = 'StudyFlowBeryl';
const B2_ENDPOINT = 's3.us-east-005.backblazeb2.com';
const ALLOWED_ORIGIN = '*'; // Security: Change to specific URL in production if needed

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight (OPTIONS request)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const key = url.pathname.slice(1);
    const cache = caches.default;
    let response = await cache.match(request);

    if (!response) {
      // 2. Fetch from Backblaze
      const awsPath = `/${BUCKET_NAME}/${key}`;
      const signedRequest = await signAwsV4(
        `https://${B2_ENDPOINT}${awsPath}`,
        {
          method: 'GET',
          accessKeyId: env.B2_APPLICATION_KEY_ID,
          secretAccessKey: env.B2_APPLICATION_KEY,
          region: env.B2_REGION, 
        }
      );

      const b2Response = await fetch(signedRequest);

      // 3. Create a new response to modify headers (Response objects are immutable)
      response = new Response(b2Response.body, b2Response);

      // Add CORS headers to ALL responses (Success or Error)
      response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
      
      // Only cache if successful
      if (b2Response.status === 200) {
        response.headers.set('Cache-Control', 'public, max-age=604800');
        await cache.put(request, response.clone());
      }
    } else {
        // Ensure cached responses also get fresh CORS headers
        response = new Response(response.body, response);
        response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    }

    return response;
  },
};

async function signAwsV4(urlStr, { method, accessKeyId, secretAccessKey, region }) {
  const url = new URL(urlStr);
  const service = 's3';
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  // Canonical Request
  const canonicalUri = url.pathname;
  const canonicalQuerystring = '';
  const payloadHash = 'UNSIGNED-PAYLOAD'; 
  const canonicalHeaders = `host:${url.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  // String to Sign
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${await sha256(canonicalRequest)}`;

  // Signing Key
  const kDate = await hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, 'aws4_request');

  // Signature
  const signature = await hex(await hmacSha256(kSigning, stringToSign));

  // Final Headers
  const headers = new Headers();
  headers.set('x-amz-date', amzDate);
  headers.set('x-amz-content-sha256', payloadHash);
  headers.set('Authorization', `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`);

  return new Request(url, { method, headers });
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return hex(buf);
}
async function hmacSha256(key, data) {
  const cryptoKey = await crypto.subtle.importKey('raw', typeof key === 'string' ? new TextEncoder().encode(key) : key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
}
function hex(buffer) {
  return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
}