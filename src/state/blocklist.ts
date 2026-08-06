import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'linq-blue-agent-example';

const OFF_TOPIC_LIMIT = 3;

export interface BlockRecord {
  phone: string;
  status: 'warned' | 'blocked';
  offTopicCount: number;
  blockedAt?: number;
  lastWarningAt?: number;
}

async function getBlockRecord(phone: string): Promise<BlockRecord | null> {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk: `BLOCK#${phone}` },
    }));
    if (!result.Item) return null;
    return result.Item as BlockRecord;
  } catch (err) {
    console.error('[blocklist] getBlockRecord error:', err);
    return null;
  }
}

/** Returns true if this number has been permanently blocked. */
export async function isBlocked(phone: string): Promise<boolean> {
  const record = await getBlockRecord(phone);
  return record?.status === 'blocked';
}

/**
 * Record one off-topic message for this number.
 * Returns { count, blocked } so the caller knows what warning to send.
 * Once count reaches OFF_TOPIC_LIMIT the number is marked blocked permanently.
 */
export async function recordOffTopic(phone: string): Promise<{ count: number; blocked: boolean }> {
  try {
    const existing = await getBlockRecord(phone);
    const count = (existing?.offTopicCount ?? 0) + 1;
    const blocked = count >= OFF_TOPIC_LIMIT;
    const now = Math.floor(Date.now() / 1000);

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `BLOCK#${phone}`,
        phone,
        status: blocked ? 'blocked' : 'warned',
        offTopicCount: count,
        ...(blocked ? { blockedAt: now } : { lastWarningAt: now }),
        // No TTL — block records persist forever
      },
    }));

    console.log(`[blocklist] ${phone} off-topic count=${count} blocked=${blocked}`);
    return { count, blocked };
  } catch (err) {
    console.error('[blocklist] recordOffTopic error:', err);
    return { count: 1, blocked: false };
  }
}
