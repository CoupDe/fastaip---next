import React, { useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import { synchVisrWIthForm } from "@/lib/api/synchDataForm/syncData";

import { useSearchParams } from "next/navigation";
type Props = { building_id: string | undefined };

const SynchBtn = ({ building_id }: Props) => {
  const [visr, setVisr] = useState<number | undefined>(undefined);

  const searchParams = useSearchParams();

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
            <div className="pt-1">Синхронизировано {visr} ВИСР</div>
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
