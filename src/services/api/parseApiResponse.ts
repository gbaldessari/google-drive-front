export type ParsedApiError = {
  ok: false;
  status: number;
  message: string;
  errorCode: string | null;
  errors: any | null;
  raw: any;
};

export type ParsedApiSuccess = {
  ok: true;
  status: number;
  body: any;
};

export type ParsedApiResponse = ParsedApiSuccess | ParsedApiError;

export async function parseApiResponse(
  response: Response
): Promise<ParsedApiResponse> {
  const contentType = response.headers.get("content-type") || "";
  let body: any = null;
  if (contentType.includes("application/json")) {
    try {
      body = await response.json();
    } catch (e) {
      body = null;
    }
  } else {
    try {
      const text = await response.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = { raw: text };
      }
    } catch (e) {
      body = null;
    }
  }

  if (response.ok) {
    return { ok: true, status: response.status, body };
  }

  const errorObj = (body && (body.error || body)) || {};
  return {
    ok: false,
    status: response.status,
    message: errorObj.message || (body && body.message) || response.statusText,
    errorCode: errorObj.errorCode || null,
    errors: errorObj.errors || null,
    raw: body,
  };
}

export default parseApiResponse;
