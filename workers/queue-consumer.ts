/**
 * Cloudflare Queue Consumer Worker
 *
 * 独立 Worker，消费 contact-notifications 队列。
 * 部署命令：npx wrangler deploy --config wrangler.consumer.toml
 */

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default {
  async queue(batch: MessageBatch<ContactMessage>): Promise<void> {
    for (const msg of batch.messages) {
      const { id, name, email, createdAt } = msg.body;
      console.log(`[Queue] New contact from ${name} <${email}> at ${createdAt} (id=${id})`);
      // 可扩展：发送邮件通知、Webhook 等
      msg.ack();
    }
  },
};
