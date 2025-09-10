// Vercel serverless function entry point for Mastra
import { mastra } from '../src/mastra/index.js';

// Export the default handler for Vercel
export default async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Get the Mastra server instance
    const server = await mastra.getServer();
    
    // Handle the request using Mastra's server
    return server.fetch(req);
  } catch (error) {
    console.error('Error in Mastra serverless function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}