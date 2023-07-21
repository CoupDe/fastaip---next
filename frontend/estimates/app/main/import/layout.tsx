import UploadForm from "@/components/upload/UploadForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "import",
  description: "import menu",
};
export default function ImportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      
      <section className={`cantainer`}>{children}</section>
    </>
  );
}
