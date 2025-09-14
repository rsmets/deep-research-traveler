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

// const test = await arcade.tools.list();

// Get flights tools
const flightsToolkit = await arcade.tools.list({ toolkit: "GoogleHotels" });

if (
  !flightsToolkit ||
  !flightsToolkit.items ||
  flightsToolkit.items.length === 0
) {
  throw new Error("No luck getting tools from Arcade GoogleFlights toolkit");
}

// /**
//  * Asynchronously retrieves tools from the Arcade platform, optionally filtered by a toolkit,
//  * and transforms them into the format required by the Mastra Agent's `tools` property.
//  */
// async function getArcadeMastraTools({
//   toolkit,
//   user_id,
// }: {
//   toolkit?: string;
//   user_id: string;
// }) {
//   // Fetch the list of available tools from Arcade, requesting the OpenAI format
//   // which includes the necessary function name, description, and parameters schema.
//   const tools = await arcade.tools.formatted.list({
//     ...(toolkit && { toolkit }), // Conditionally include the toolkit filter if provided.
//     format: "openai", // Specify the desired format for tool definitions.
//   });

//   // Process the fetched tools, converting each valid one into a Mastra tool.
//   return tools.items.reduce(
//     (acc: Record<string, ReturnType<typeof createTool>>, item) => {
//       // Validate the structure of the fetched tool definition against our minimum schema.
//       const parsedItem = arcadeToolMinimumSchema.safeParse(item);

//       // If the tool definition is valid, proceed to create a Mastra tool.
//       if (parsedItem.success) {
//         const { name, description, parameters } = parsedItem.data.function;

//         // Add the tool to the accumulator object, keyed by its name.
//         acc[name] = createTool({
//           id: name, // Use the Arcade tool name as the Mastra tool ID.
//           description, // Use the Arcade tool description.
//           // Convert the JSON Schema parameters definition from Arcade to a Zod schema for Mastra.
//           inputSchema: JSONSchemaToZod.convert(parameters),
//           // Define the execution logic for this tool when called by the Mastra agent.
//           execute: async ({ context }) => {
//             try {
//               // Attempt to execute the tool via the Arcade API, passing the input context
//               // and the user ID for authorization.
//               const result = await arcade.tools.execute({
//                 tool_name: name,
//                 input: context, // `context` contains the validated input arguments provided by the agent.
//                 user_id,
//               });
//               // Return the successful result from the Arcade tool execution.
//               return result;
//             } catch (error) {
//               // Handle potential errors during tool execution.
//               // Specifically check if the error indicates a need for user authorization.
//               if (
//                 error instanceof Error &&
//                 isAuthorizationRequiredError(error)
//               ) {
//                 // If authorization is required, request an authorization URL from Arcade.
//                 const response = await getAuthorizationResponse(name, user_id);
//                 // Return a specific structure indicating authorization is needed,
//                 // including the URL the user must visit. The agent's instructions
//                 // should guide it on how to present this URL to the user.
//                 return {
//                   authorization_required: true,
//                   url: response.url,
//                   message: "Forward this url to the user for authorization",
//                 };
//               }
//               // If it's a different type of error, re-throw it to be handled elsewhere.
//               throw error;
//             }
//           },
//         });
//       } else {
//         // Log a warning if a fetched tool definition doesn't match the expected schema.
//         console.warn(
//           `Skipping tool due to invalid schema: ${JSON.stringify(item)}`,
//           parsedItem.error
//         );
//       }

//       // Return the accumulator for the next iteration.
//       return acc;
//     },
//     {} as Record<string, ReturnType<typeof createTool>>
//   ); // Initialize with an empty object typed correctly.
// }

// const mtools = await getArcadeMastraTools({
//   toolkit: "GoogleFlights",
//   user_id: "rayjsmets@gmail.com", // do not change this!
// });

export const googleFlightsTools = toZodToolSet({
  tools: flightsToolkit.items,
  client: arcade,
  // This should be a unique ID for your user.
  // It's used internally by Arcade to identify the user.
  userId: "rayjsmets@gmail.com", // do not change this!
  executeFactory: executeOrAuthorizeZodTool, // Checks if tool is authorized and executes it, or returns authorization URL if needed
});
