/**
 * Off-topic detection for inbound SMS messages.
 * Flags messages about money, payments, spam, or topics clearly unrelated
 * to equipment service, troubleshooting, parts, or warranty.
 */

const OFF_TOPIC_PATTERNS: RegExp[] = [
  // Money / financial transactions
  /\b(pay(ment|ing|pal)?|invoice|bill(ing)?|refund|money|cash|dollar|fee|charge|surcharge)\b/i,
  /\bcredit\s*card\b/i,
  /\bbank\s*(account|transfer|wire)?\b/i,
  /\b(wire|ach|zelle|venmo|cashapp)\s*transfer\b/i,
  /\bdeposit\b/i,
  /\b(loan|financing|finance)\b/i,
  /\b(discount|coupon|promo\s*code)\b/i,
  // Crypto / investment spam
  /\b(crypto|bitcoin|btc|ethereum|eth|nft|token|invest(ment)?|trading|forex|stocks?)\b/i,
  // Prize / lottery spam
  /\b(prize|winner|you\s*won|lottery|jackpot|claim\s*your|selected\s*you)\b/i,
  // Generic spam CTA patterns
  /\b(click\s*here|limited\s*time|act\s*now|buy\s*now|order\s*now|sign\s*up\s*now|free\s*(trial|offer|gift))\b/i,
  /\bvisit\s+(our|this|the)\s+(website|site|link|url)\b/i,
  // Explicit money symbol with an amount (e.g. "$500", "$1,000")
  /\$\s*[\d,]+/,
];

/**
 * Returns true if the message appears to be about money, payments,
 * spam, or topics unrelated to equipment service.
 */
export function isOffTopic(text: string): boolean {
  if (!text) return false;
  return OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(text));
}
