import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// This is a singleton or factory for the MCP client.
export class MCPClientManager {
  private client: Client | null = null;
  private transport: StdioClientTransport | SSEClientTransport | null = null;

  async connect() {
    if (this.client) return this.client;

    const isLocal = process.env.NODE_ENV === "development";

    if (isLocal) {
      // Local stdio connection to the binary
      this.transport = new StdioClientTransport({
        command: "bin/codebase-memory-mcp", // The user specified binary path
        args: [], // Add necessary args if any
      });
    } else {
      // Prod SSE connection
      const apiUrl = process.env.NEXT_PUBLIC_MCP_API_URL;
      if (!apiUrl) throw new Error("NEXT_PUBLIC_MCP_API_URL is missing in prod");
      this.transport = new SSEClientTransport(new URL(apiUrl));
    }

    this.client = new Client({
      name: "codegraph-enterprise-client",
      version: "1.0.0",
    }, {
      capabilities: {}
    });

    await this.client.connect(this.transport);
    return this.client;
  }

  async getClient() {
    if (!this.client) {
      await this.connect();
    }
    return this.client;
  }
}

export const mcpManager = new MCPClientManager();
