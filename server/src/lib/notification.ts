import { PrismaClient } from '@prisma/client';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const prisma = new PrismaClient();

// Initialize WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './whatsapp-session' }),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // <--- CRITICAL for Render/Docker
            '--disable-gpu'            // <--- Recommended for headless environments
        ],
        headless: true 
    }
});

let isClientReady = false;

client.on('qr', (qr) => {
    // 1. Log the raw string as a fallback (Copy this if the image fails)
    console.log('QR RAW DATA:', qr); 
    
    // 2. Generate the terminal image
    console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Client is ready!');
    isClientReady = true;
});

client.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp Authentication failure:', msg);
});

client.initialize();

// Helper to send WhatsApp
export const sendWhatsappMessage = async (to: string, body: string, mediaUrl?: string) => {
    if (!isClientReady) {
        console.log('⚠️ WhatsApp client not ready yet. Skipping message.');
        return;
    }

    try {
        // WhatsApp Web expects numbers in format '1234567890@c.us'
        // Remove '+' and any non-numeric chars
        const sanitizedNumber = to.replace(/[^0-9]/g, '');
        const chatId = `${sanitizedNumber}@c.us`;
        console.log(`Sending WhatsApp to ${to} (chatId: ${chatId})`);

        // Check if number is registered on WhatsApp
        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
            console.log(`⚠️ User ${to} is not registered on WhatsApp.`);
            return;
        }
        console.log(`User ${to} is registered on WhatsApp.`);

        await client.sendMessage(chatId, body);
        
        // Note: sending media via URL requires extra steps (fetching buffer), 
        // for simplicity we are sending just text + link for now.
        // If you need images, you'd use MessageMedia.fromUrl(mediaUrl)
        
        console.log(`WhatsApp sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send WhatsApp to ${to}:`, error);
    }
};

export const sendNotification = async (
  userId: number, 
  message: string, 
  link?: string, 
  imageUrl?: string
) => {
  try {
    // Save to DB
    await prisma.notification.create({
      data: { userId, message, link, imageUrl, type: "INFO" },
    });

    // Send WhatsApp if user has phone number
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.phoneNumber) {
      const whatsappBody = `${message}\n${link ? `Link: ${link}` : ''}`;
      await sendWhatsappMessage(user.phoneNumber, whatsappBody, imageUrl);
    }

  } catch (error) {
    console.error("Failed to send notification:", error);
  }
};

export const broadcastNotification = async (
  message: string, 
  link: string, 
  imageUrl?: string
) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, phoneNumber: true }
    });

    if (users.length === 0) return;

    // 1. Create DB Notifications
    const notifications = users.map(user => ({
      userId: user.id,
      message,
      link,
      imageUrl,
      type: "ALERT",
      isRead: false
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    // 2. Send WhatsApp Broadcast
    const whatsappBody = `📢 New Update: ${message}\nWatch here: ${link}`;
    
    // Process strictly sequentially to avoid ban/rate limits
    for (const user of users) {
      if (user.phoneNumber) {
        await sendWhatsappMessage(user.phoneNumber, whatsappBody, imageUrl);
        // Wait 2-5 seconds between messages to be safe
        await new Promise(r => setTimeout(r, 2000)); 
      }
    }

    console.log(`Broadcast sent to ${users.length} users.`);
  } catch (error) {
    console.error("Failed to broadcast notification:", error);
  }
};