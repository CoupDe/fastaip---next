import Link from "next/link";
import * as React from "react";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

export interface IPaginationFormProps {
  building_id: number;
  length: number;
  paginationParam: { page?: string; limit?: string };
}

export default function PaginationForm({
  building_id,
  length,
  paginationParam,
}: IPaginationFormProps) {
  return (
    <div className="p-1 flex justify-center ">
      <Link
        href={{
          pathname: `/main/form/${building_id}`,
          query: {
            page: Number(paginationParam.page) - 1,
          },
        }}
        className={`${paginationParam.page === "1" && "pointer-events-none"}`}
      >
        <SkipPreviousIcon
          className={`${
            paginationParam.page === "1"
              ? "text-gray-400 "
              : "text-slate-500 hover:cursor-pointer dark:text-white"
          }`}
        ></SkipPreviousIcon>
      </Link>

      <Link
        href={{
          pathname: `/main/form/${building_id}`,
          query: {
            page:
              length === 1000
                ? Number(paginationParam.page) + 1
                : Number(paginationParam.page),
          },
        }}
        className={`${length < 1000 && "pointer-events-none"}`}
      >
        <SkipNextIcon
          className={`${
            length < Number(paginationParam.limit)
              ? "text-gray-400"
              : "text-slate-500 dark:text-white hover:cursor-pointer"
          }`}
        ></SkipNextIcon>
      </Link>
    </div>
  );
}
