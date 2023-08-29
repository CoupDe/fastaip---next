import Header from "@/components/header/Header";
import Breadcrumbs from "@/components/header/breadcrumbs/Breadcrumbs";
import TheadTable from "@/components/visrTable/TheadTable";
import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Programm",
};
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="">
        <div className="w-full overflow-x-clip overflow-y-auto h-[80vh]">
          <table className="table-auto w-full mx-2 border-separate space-y-6 text-sm text-gray-400">
            <TheadTable isForm={true} />
            <tbody>
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
