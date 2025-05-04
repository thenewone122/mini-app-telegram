import { UserProvider } from "@/context/context";
import { cookies } from "next/headers";

export default async function Layout({ children }) {
  const cookieStore =await cookies();
  const userId = cookieStore.get('userId')?.value;
  const username = cookieStore.get('username')?.value;

  const initUser = {
    userId,
    username,
  };

  return (
    <>
      <UserProvider initUser={initUser}>{children}</UserProvider>
    </>
  );
}
