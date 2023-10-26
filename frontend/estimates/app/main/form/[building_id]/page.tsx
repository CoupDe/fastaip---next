import FormTable from "@/components/formTable/FormTable";
import TheadTable from "@/components/visrTable/TheadTable";
import { getAllFormData } from "@/lib/api/getAllFormData";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Link from "next/link";
import PaginationForm from "./pagination";
type Props = {
  params: { building_id: string };
  searchParams: { page?: string; limit?: string };
};

export default async function page({ params, searchParams }: Props) {
  const paginationParams = {
    page: searchParams.page ?? "1",
    limit: searchParams.limit ?? "1000",
  };
  const result = await getAllFormData(params.building_id, paginationParams);

  return (
    <>
      <div className=" overflow-x-clip overflow-y-auto h-[80vh]">
        <table className="table-auto w-full   border-separate space-y-6 text-sm text-gray-400">
          <TheadTable isForm={true} />
          <tbody>
            <FormTable dataForm={result} />
          </tbody>
          {Number(paginationParams.limit) > result.length &&
            paginationParams.page === "1"}
          <tfoot>
            <tr>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <PaginationForm
        building_id={Number(params.building_id)}
        paginationParam={paginationParams}
        length={result.length}
      />
    </>
  );
}
