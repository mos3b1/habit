import { getOrCreateUser } from "@/lib/user";
import React from "react";

async function Probadge() {
  const user = await getOrCreateUser();
  const isPro = user?.plan === "pro";
  function returnType() {
    if (isPro) {
      return "PRO";
    }

    return null;
  }
  return (
    <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
        {returnType()}
    </span>
  );
}

export default Probadge;
