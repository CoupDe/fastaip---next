import Header from "@/components/header/Header";
import Breadcrumbs from "@/components/header/breadcrumbs/Breadcrumbs";
import TheadTable from "@/components/visrTable/TheadTable";
import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "./loading";

type FormLayoutProps = {
  children: React.ReactNode;
  params: { building_id: string; query?: { page?: string; limit: string } };
};

export const metadata: Metadata = {
  title: "Form",
  description: "Work with form",
};
export default function MainLayout({ children, params }: FormLayoutProps) {


  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="w-full ">
          {children}
        </div>
      </Suspense>
    </>
  );
}
