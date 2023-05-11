import Image from "next/image";
import Link from "next/link";
import gazprom_Logo from "../../public/gazprom_Logo.png";
import ThemeButton from "./themeButton/ThemeButton";
import NavPanel from "./nav/NavPanel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import LoginAvatar from "./avatar/LoginAvatar";

// Функция ограниченивает количество символов в имени User
const limitName = (name: string, limit: number): string => {
  if (name.length > limit) {
    return name.slice(0, limit) + "...";
  }

  return name;
};

interface IAvatarProps {
  name: string;
  departament?: string;
}
export default async function Header() {
  // Происходит ошибка из-зи header на гитхабе пишут что это программная ошибка связки next-auth/next13
  const session = await getServerSession(authOptions);

  return (
    <header>
      <div className="flex h-16 items-center justify-around py-2 shadow-md shadow-sky-600 dark:shadow-red-900">
        <div className="flex  h-8 w-8">
          <Link href={"/main"}>
            <Image src={gazprom_Logo} alt="gazp_Logo" />
          </Link>
        </div>
        <NavPanel />
        <div className="flex items-center ">
          <div>
            <LoginAvatar image={session?.user?.image} />
          </div>
          <div className="flex flex-col  pt-1 ml-1">
            <p className="text-xs sm:text-[0.7rem]  leading-tight">
              {session?.user ? limitName(session.user.name!, 10) : "not auth"}
            </p>
            <p className="text-neutral-500 text-xs  dark:text-neutral-400">
              dep
            </p>
          </div>
          <div className="h-8 w-6 ml-4  cursor-pointer">
            <ThemeButton />
          </div>
        </div>
      </div>
    </header>
  );
}
