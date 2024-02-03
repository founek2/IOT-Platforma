import { Express } from "express";
import supertest from "supertest";

export const server = supertest((global as any).__app as Express)