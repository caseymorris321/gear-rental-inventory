import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  return stackServerApp.getUser();
}
