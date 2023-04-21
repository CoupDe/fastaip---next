import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import VK_Logo from "../../public/VK_Logo.svg";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default function Social() {
  return (
    <section className="flex flex-col pb-4 mt-4 w-full ">
      <div className="flex flex-col w-full ">
        <div className="flex  w-full  justify-evenly group relative ">
          <p className="text-slate-400 ">or SignIn with social</p>

          <LinkIcon className="text-teal-600 cursor-pointer " />

          <div className="invisible w-full justify-center absolute flex items-end bottom-7 space-x-2  bg-transparent  transition-all duration-200  group-hover:visible">
            <button onClick={() => signIn("github", { callbackUrl: "/main" })}>
              <GitHubIcon
                fontSize="medium"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75"
              />{" "}
            </button>
            <button onClick={() => signIn("vk", { callbackUrl: "/main" })}>
              <Image
                height={22}
                src={VK_Logo}
                alt="vk_logo"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 "
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
