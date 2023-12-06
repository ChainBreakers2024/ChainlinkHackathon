import type { User } from "@/app/api/app/user/route";

export async function getUser(): Promise<{ object: "User"; users: User }> {
  try {
    const response = await fetch("/api/app/user");
    
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Something went wrong");
  }
}