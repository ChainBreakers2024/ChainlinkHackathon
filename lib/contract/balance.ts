import type { User } from "@/app/api/app/user/route";

export async function getBalance(): Promise<{ object: "User"; users: User }> {
  try {
    const response = await fetch("/api/contract/balance");
    
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Something went wrong");
  }
}