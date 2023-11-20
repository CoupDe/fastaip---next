import React, { useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import { synchVisrWIthForm } from "@/lib/api/synchDataForm/syncData";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
type Props = { building_id: string | undefined };

const SynchBtn = ({ building_id }: Props) => {
  const [visr, setVisr] = useState<number | undefined>(undefined);

  const searchParams = useSearchParams();
  const rout = useRouter();
  console.log(searchParams?.get("page"));
  if (building_id !== undefined) {
    async function handleSynchData(building_id: string) {
      const result = await synchVisrWIthForm(building_id);
      if (result) {
        setVisr(result);
      }

      return result;
    }

    return (
      <>
        <SyncIcon
          onClick={() => handleSynchData(building_id)}
          className="hover:text-slate-300 hover:cursor-pointer"
        />
        {visr !== undefined ? (
          visr > 0 ? (
            <div className="pt-1">
              Синхронизировано{" "}
              <Link
                href={{
                  pathname: `/main/form/${building_id}`,
                  query: { isFiltered: true },
                }}
                className=" text-sm  sm:text-lg"
              >
                <b
                  onClick={() => rout.refresh()}
                  className="animate-pulse text-black  font-overpass  dark:text-white opacity-100 "
                >
                  {visr}
                </b>
              </Link>{" "}
              ВИСР
            </div>
          ) : (
            <div className="pt-1">Совпадений не найдено</div>
          )
        ) : null}
      </>
    );
  } else
    return (
      <>
        <SyncDisabledIcon />
      </>
    );
};

export default SynchBtn;
