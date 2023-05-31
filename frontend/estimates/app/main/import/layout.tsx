import UploadForm from "@/components/upload/UploadForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Programm",
};
export default function ImportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UploadForm />
      <section className={`cantainer`}>{children}</section>
    </>
  );
}
