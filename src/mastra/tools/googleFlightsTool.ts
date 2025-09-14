import { Arcade } from "@arcadeai/arcadejs";
import {
  executeOrAuthorizeZodTool,
  toZodToolSet,
} from "@arcadeai/arcadejs/lib";

/**
 * Make sure to set the following environment variables:
 * - ARCADE_API_KEY: Your Arcade API key.
 * - SERP_API_KEY: Your SerpAPI API key for Google Flights.
 */

// Initialize Arcade
// const arcade = new Arcade({
//   apiKey: process.env.ARCADE_API_KEY,
// });
const arcade = new Arcade();

// console.log(`ARCADE_API_KEY: ${process.env.ARCADE_API_KEY}`);
// console.log(`SERP_API_KEY: ${process.env.SERP_API_KEY}`);

// Get flights tools
const flightsToolkit = await arcade.tools.list({ toolkit: "gmail" });

if (
  !flightsToolkit ||
  !flightsToolkit.items ||
  flightsToolkit.items.length === 0
) {
  throw new Error(
    "Could not find Google Flights toolkit. Please ensure your ARCADE_API_KEY and SERP_API_KEY are set correctly."
  );
}

export const googleFlightsTools = toZodToolSet({
  tools: flightsToolkit.items,
  client: arcade,
  // This should be a unique ID for your user.
  // It's used internally by Arcade to identify the user.
  userId: "deep-research-traveler-user",
  executeFactory: executeOrAuthorizeZodTool, // Checks if tool is authorized and executes it, or returns authorization URL if needed
});
