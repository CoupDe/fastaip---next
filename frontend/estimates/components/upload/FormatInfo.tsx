import React, { useEffect, useState } from "react";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import { useAppSelector } from "@/redux/hook";
import { ActiveBuilding } from "@/redux/slice/buildingSlice";
import postFiles from "@/lib/api/postImport";

type PropsFormat = {
  format: SearchFormats;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};
const FormatInfo: React.FC<PropsFormat> = ({
  format,
  setShow,
}: PropsFormat) => {
  const { id } = useAppSelector(ActiveBuilding);
  const [noFiles, setNoFiles] = useState(false);
  if (!id) return <h1>Выберите объект</h1>;
  const handleShowBadFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setShow((prev) => !prev);
  };

  const sendFiles = async (
    okFormat: File[],
    id: string,
    event: React.FormEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (okFormat.length !== 0) {
      const result = await postFiles(okFormat, id);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={(event) => sendFiles(format.okFormat, id, event)}
        className="relative inline-block"
      >
        <svg
          className="h-6 w-6 fill-current text-gray-700 dark:text-slate-200"
          viewBox="0 0 20 20"
        >
          <FileDownloadDoneIcon />
        </svg>
        <span className="absolute left-1 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-green-700 px-2 py-1 text-xs font-bold leading-none text-red-100">
          {format.okFormat.length > 0 ? format.okFormat.length : "-"}
        </span>
      </button>
      <button
        className="relative ml-8 inline-block"
        onClick={(event) => handleShowBadFile(event)}
      >
        <svg
          className="h-6 w-6 fill-current text-gray-700 dark:text-slate-200"
          viewBox="0 0 20 20"
        >
          <FileDownloadOffIcon />
        </svg>
        <span className="absolute left-1 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-red-100">
          {format.badFormat.length > 0 ? format.badFormat.length : "-"}
        </span>
      </button>
      {noFiles && <p>Нет доступных файлов для загрузки</p>}
    </div>
  );
};

export default FormatInfo;
