async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'method_not_allowed' });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return res.status(200).json({
      success: false,
      configurationRequired: true,
      error: 'missing_turnstile_secret'
    });
  }

  try {
    const { token } = await readBody(req);
    if (!token) {
      return res.status(400).json({ success: false, error: 'missing_token' });
    }

    const form = new URLSearchParams();
    form.append('secret', secret);
    form.append('response', token);

    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      form.append('remoteip', String(forwardedFor).split(',')[0].trim());
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form
    });
    const result = await response.json();

    return res.status(200).json({
      success: Boolean(result.success),
      challengeTs: result.challenge_ts,
      hostname: result.hostname,
      action: result.action,
      errors: result['error-codes'] || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'verification_failed'
    });
  }
}
