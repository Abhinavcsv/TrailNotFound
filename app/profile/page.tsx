
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function connectGoogleAccount() {
  "use server";

  await signIn("google", {
    redirectTo: "/profile",
  });
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const googleAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: "google",
    },
    select: {
      id: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your TrailNotFound account.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Connected Accounts
          </h2>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-slate-800">Google</p>
              <p className="text-sm text-slate-500">
                {googleAccount
                  ? "Your Google account is connected."
                  : "Connect Google to your account."}
              </p>
            </div>

            {googleAccount ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Connected
              </span>
            ) : (
              <form action={connectGoogleAccount}>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Connect Google
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
