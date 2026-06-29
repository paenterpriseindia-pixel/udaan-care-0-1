const rateLimitCache = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  const record = rateLimitCache.get(ip);

  if (record) {
    if (now - record.timestamp < windowMs) {
      if (record.count >= limit) {
        return false; // Rate limit exceeded
      }
      record.count += 1;
      return true;
    } else {
      // Reset window
      rateLimitCache.set(ip, { count: 1, timestamp: now });
      return true;
    }
  } else {
    rateLimitCache.set(ip, { count: 1, timestamp: now });
    return true;
  }
}
