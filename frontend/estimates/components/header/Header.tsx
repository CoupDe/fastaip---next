import Image from "next/image";
import Link from "next/link";
import avatar from "../../public/avatar.svg";
import gazprom_Logo from "../../public/gazprom_Logo.svg";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const navigation = [
  { name: "Объекты", link: "/objects" },
  { name: "Импорт", link: "/import" },
  { name: "Отчеты", link: "/reports" },
];
// Функция ограничение символов в имени User
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
  const session = await getServerSession(authOptions);

  return (
    <header>
      <div className="flex h-16 justify-around py-2 shadow-md shadow-sky-600">
        <div className="flex align-middle">
          <Link href={"/home"}>
            <Image src={gazprom_Logo} width={40} alt="gazp_Logo" />
          </Link>
        </div>
        <nav className="flex items-center">
          <ul className="flex gap-2 place-content-center uppercase text-slate-500 ">
            {navigation.map((link, i) => (
              <li key={i}>
                <Link
                  className="text-[0.5rem] sm:text-[0.7rem]"
                  href={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center">
          <div>
            <Image
              className="rounded-xl"
              src={session ? session.user?.image : avatar}
              alt="avatar"
              width={30}
              height={30}
            />
          </div>
          <div className="flex flex-col pt-1 ml-1">
            <p className=" text-[0.5rem] sm:text-[0.7rem]  leading-tight">
              {session?.user ? limitName(session.user.name!, 10) : "not auth"}
            </p>
            <p className="text-neutral-500 text-xs  dark:text-neutral-400">
              dep
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
