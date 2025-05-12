// Configure Split to access feature toggles in server-side components.

import { SplitFactory } from "@splitsoftware/splitio";
import { cookies } from "next/headers";

if (
  process.env.NODE_ENV === "production" &&
  !process.env.SPLIT_SERVER_API_KEY
) {
  throw new Error("Missing SPLIT_SERVER_API_KEY");
}

const factories = {
  templates: SplitFactory({
    core: {
      authorizationKey: process.env.SPLIT_SERVER_API_KEY || "",
    },
  }),
};

export const splitClients = {
  templates: factories.templates.client(),
};

export const getSplitKey = () => {
  const currentAccountId = cookies().get("currentAccountId");

  return currentAccountId?.value ?? "loggedout";
};
