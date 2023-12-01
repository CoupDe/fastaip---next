import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "./loading";

type FormLayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Form",
  description: "Work with form",
};
export default function MainLayout({ children, modal }: FormLayoutProps) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="w-full h-1/2">{children}</div>
      </Suspense>
      {modal}
    </>
  );
}
