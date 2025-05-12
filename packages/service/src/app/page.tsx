import Link from "next/link";
import { getSplitKey, splitClients } from "src/utils/split";

async function getFlags(isStaff = false) {
  await splitClients.templates.ready();

  return {
    sayHello:
      splitClients.templates.getTreatment(getSplitKey(), "SayHello", {
        isStaff,
      }) === "on",
  };
}

export default async function RootPage() {
  const { sayHello } = await getFlags();

  return (
    <div>
      <p>Hello, world!</p>
      <p>
        Sample service-side feature toggle: {sayHello ? "Active" : "Inactive"}
      </p>
      <Link href="/app/nextjs-template">I was here onboarding demo!</Link>
    </div>
  );
}
