import Link from "next/link";

export default async function RootPage() {
  return (
    <div>
      <p>Hello, world!</p>
      <Link href="/app/nextjs-template">I was here onboarding demo!</Link>
    </div>
  );
}
