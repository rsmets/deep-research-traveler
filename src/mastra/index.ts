import { Mastra } from "@mastra/core";
import { PostgresStore } from "@mastra/pg";
import { researchWorkflow } from "./workflows/researchWorkflow";
import { learningExtractionAgent } from "./agents/learningExtractionAgent";
import { evaluationAgent } from "./agents/evaluationAgent";
import { reportAgent } from "./agents/reportAgent";
import { researchAgent } from "./agents/researchAgent";
import { webSummarizationAgent } from "./agents/webSummarizationAgent";
import { generateReportWorkflow } from "./workflows/generateReportWorkflow";
import { travelAgent } from "./agents/travel-agent";
import { PinoLogger } from "@mastra/loggers";

export const mastra = new Mastra({
  agents: {
    researchAgent,
    reportAgent,
    evaluationAgent,
    learningExtractionAgent,
    webSummarizationAgent,
    travelAgent,
  },
  workflows: { generateReportWorkflow, researchWorkflow },
  // Use in-memory storage or external database for production
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
