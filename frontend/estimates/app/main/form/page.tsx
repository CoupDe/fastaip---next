import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";

export default async function page() {
  return (
    <div className=" opacity-80 flex flex-col h-full place-content-center sm:text-6xl text-2xl">
      <div className=" place-self-center">
        <HomeWorkIcon
          className="  dark:text-white text-slate-800"
          fontSize="inherit"
        />
        <SearchIcon
          className="mt-6   dark:text-white text-slate-800"
          fontSize="inherit"
        />
      </div>
      <div className="place-self-center dark:text-white text-slate-800">
        <Link href={"projects"} className="hover:text-slate-400 opacity-75">
          Объект не выбран
        </Link>
      </div>
    </div>
  );
}
