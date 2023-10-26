import React from "react";
import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";

type Props = { building_id: string | undefined };

const SynchBtn = ({ building_id }: Props) => {
  if (building_id !== undefined) {
    return (
      <>
        <SyncIcon
          onClick={() => console.log(building_id)}
          className="hover:text-slate-300"
        />
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
