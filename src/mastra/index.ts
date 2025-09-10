import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { researchWorkflow } from "./workflows/researchWorkflow";
import { learningExtractionAgent } from "./agents/learningExtractionAgent";
import { evaluationAgent } from "./agents/evaluationAgent";
import { reportAgent } from "./agents/reportAgent";
import { researchAgent } from "./agents/researchAgent";
import { webSummarizationAgent } from "./agents/webSummarizationAgent";
import { generateReportWorkflow } from "./workflows/generateReportWorkflow";
import { travelAgent } from "./agents/travel-agent";

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: "file:../mastra.db",
  }),
  agents: {
    researchAgent,
    reportAgent,
    evaluationAgent,
    learningExtractionAgent,
    webSummarizationAgent,
    travelAgent,
  },
  workflows: { generateReportWorkflow, researchWorkflow },
});
