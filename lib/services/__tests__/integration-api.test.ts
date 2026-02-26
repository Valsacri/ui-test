/**
 * Integration tests: hit the real backend when INTEGRATION_API_URL is set.
 * Run with: INTEGRATION_API_URL=http://localhost:8080/api npm run test -- --run lib/services/__tests__/integration-api.test.ts
 * If INTEGRATION_API_URL is not set, all tests are skipped.
 */

import axios from "axios"
import { describe, it, expect } from "vitest"

const BASE_URL = process.env.INTEGRATION_API_URL || "http://localhost:8080/api"
/** Only run when INTEGRATION_API_URL is set so normal test runs don't require the backend. */
const SKIP = !process.env.INTEGRATION_API_URL

describe.skipIf(SKIP)("Integration: FE paths vs running BE", () => {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    validateStatus: () => true,
  })

  it("GET /v1/activities returns 200 or 401", async () => {
    const res = await client.get("/v1/activities", { params: { page: 0, size: 1 } })
    expect([200, 401]).toContain(res.status)
  })

  it("GET /v1/facilities returns 200 or 401", async () => {
    const res = await client.get("/v1/facilities", { params: { page: 0, size: 1 } })
    expect([200, 401]).toContain(res.status)
  })

  it("GET /v1/businesses returns 200 or 401", async () => {
    const res = await client.get("/v1/businesses", { params: { page: 0, size: 1 } })
    expect([200, 401]).toContain(res.status)
  })

  it("GET /v1/services returns 200 or 401", async () => {
    const res = await client.get("/v1/services", { params: { page: 0, size: 1 } })
    expect([200, 401]).toContain(res.status)
  })

  it("GET /v1/jobs returns 200 or 401", async () => {
    const res = await client.get("/v1/jobs", { params: { page: 0, size: 1 } })
    expect([200, 401]).toContain(res.status)
  })

  it("GET /v1/posts returns 200 or 401", async () => {
    const res = await client.get("/v1/posts", { params: { page: 0, size: 1 } })
    expect([200, 401]).toContain(res.status)
  })

  it("GET /v1/products returns 200 or 401", async () => {
    const res = await client.get("/v1/products", { params: { page: 0, size: 1 } })
    expect([200, 401]).toContain(res.status)
  })

  it("GET /v1/users returns 200 or 401", async () => {
    const res = await client.get("/v1/users", { params: { page: 0, size: 1 } })
    expect([200, 401]).toContain(res.status)
  })

  it("GET /v1/search/suggest returns 200 or 401", async () => {
    const res = await client.get("/v1/search/suggest", { params: { query: "test", limit: 5 } })
    expect([200, 401]).toContain(res.status)
  })
})
