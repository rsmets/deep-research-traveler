// Vercel serverless function for Mastra
import { mastra } from '../src/mastra/index.js';
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
    
    // Create a proper Request object for the Mastra server
    const url = new URL(req.url, `https://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Handle the request using Mastra's server
    const response = await server.fetch(request);
    
    // Convert the response back to Vercel format
    const responseBody = await response.text();
    const responseHeaders = Object.fromEntries(response.headers.entries());
    
    // Set response headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Send the response
    res.status(response.status).send(responseBody);
    
  } catch (error) {
    console.error('Error in Mastra serverless function:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}