import type { Express } from "express";
import { createServer, type Server } from "node:http";
import path from "node:path";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Privacy Policy page
  app.get("/privacy-policy", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "server/templates/privacy-policy.html"));
  });

  // Terms of Service page
  app.get("/terms-of-service", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "server/templates/terms-of-service.html"));
  });

  const httpServer = createServer(app);

  return httpServer;
}
