import "@testing-library/jest-dom/vitest";
import { server } from "./mocks/server";

vi.stubEnv("VITE_API_URL", "");

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
