// eslint-disable-next-line import/default
import React from "react";
import { render, waitFor } from "@testing-library/react";

import { HelloWorld } from "./HelloWorld";

// Mocking the fetch API

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,

    json: () =>
      Promise.resolve([
        { name: "Alex Hovancik", hobby: "playing pool 🎱" },

        { name: "Bryan Helmig", hobby: "playing pool 🎱" },
      ]),
  }),
) as vi.Mock;

describe("HelloWorld", () => {
  afterEach(() => {
    (global.fetch as vi.Mock).mockClear();
  });

  it("renders a greeting", async () => {
    const result = render(<HelloWorld />);
    await waitFor(() => {
      expect(
        result.getByText("Hello from the nextjs-template!"),
      ).toBeInTheDocument();
    });
  });

  // Mocking the fetch API

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,

      json: () =>
        Promise.resolve([
          { name: "Alex Hovancik", hobby: "playing pool 🎱" },

          { name: "Bryan Helmig", hobby: "playing pool 🎱" },
        ]),
    }),
  ) as vi.Mock;
});
