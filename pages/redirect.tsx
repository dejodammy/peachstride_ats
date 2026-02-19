import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Redirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || !session.user) return;
    if (session.user.role === "admin") router.push("/adminDashboard");
    else router.push("/candidateDashboard");
  }, [session, router]);

  return <p>Redirecting...</p>;
}
