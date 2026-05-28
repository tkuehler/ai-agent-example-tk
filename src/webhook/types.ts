// Sendblue Webhook Types
// Docs: https://docs.sendblue.com/#tag/Webhooks

export interface SendblueWebhookBody {
  accountEmail?:    string;
  content?:         string;
  is_outbound:      boolean;
  status?:          string;
  error_code?:      string | null;
  error_message?:   string | null;
  message_handle?:  string;
  date_sent?:       string;
  date_updated?:    string;
  from_number:      string;
  number?:          string;
  to_number?:       string;
  sendblue_number?: string;
  media_url?:       string;
  message_type?:    string;
  group_id?:        string;
  participants?:    string[];
  send_style?:      string;
  opted_out?:       boolean;
}

export interface ParsedInbound {
  from:      string;
  to:        string;
  text:      string;
  mediaUrl:  string | null;
}

export function parseSendblueWebhook(body: SendblueWebhookBody): ParsedInbound & { isOutbound: boolean } {
  return {
    from:       (body.from_number   || '').trim(),
    to:         (body.to_number     || body.sendblue_number || '').trim(),
    text:       (body.content       || '').trim(),
    mediaUrl:   body.media_url && body.media_url !== '' ? body.media_url : null,
    isOutbound: body.is_outbound === true,
  };
}
