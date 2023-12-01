import UploadForm from "@/components/upload/UploadForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "import",
  description: "import menu",
};
export default function ImportLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <section className={`cantainer`}>{children}</section>
      <section>{modal}</section>
    </>
  );
}
