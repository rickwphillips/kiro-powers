#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCcStatusTool } from "./tools/cc-status.js";
import { registerProjectContextResource } from "./resources/project-context.js";

const server = new McpServer({
  name: "kiro-power-commander",
  version: "0.1.0",
});

registerCcStatusTool(server);
registerProjectContextResource(server);

const transport = new StdioServerTransport();
await server.connect(transport);
