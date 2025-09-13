import { Mastra } from "@mastra/core";
import { postgresStore } from "./config/database";
import { researchWorkflow } from "./workflows/researchWorkflow";
import { learningExtractionAgent } from "./agents/learningExtractionAgent";
import { evaluationAgent } from "./agents/evaluationAgent";
import { reportAgent } from "./agents/reportAgent";
import { researchAgent } from "./agents/researchAgent";
import { webSummarizationAgent } from "./agents/webSummarizationAgent";
import { generateReportWorkflow } from "./workflows/generateReportWorkflow";
import { travelAgent } from "./agents/travel-agent";
import { PinoLogger } from "@mastra/loggers";
import { travelAgentV4 } from "./agents/travel-agent-v4";

export const mastra = new Mastra({
  agents: {
    researchAgent,
    reportAgent,
    evaluationAgent,
    learningExtractionAgent,
    webSummarizationAgent,
    travelAgent,
    travelAgentV4,
  },
  workflows: { generateReportWorkflow, researchWorkflow },
  // Use centralized database storage to avoid duplicate connections
  storage: postgresStore,
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
