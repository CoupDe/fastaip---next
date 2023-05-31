import React from "react";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
type PropsFormat = {
  format: SearchFormats;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};
const FormatInfo: React.FC<PropsFormat> = ({
  format,
  setShow,
}: PropsFormat) => {
  const handleShowBadFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log("click");
    setShow(true);
  };
  return (
    <div className="flex items-center">
      <span className="relative inline-block">
        <svg
          className="h-6 w-6 fill-current text-gray-700 dark:text-slate-200"
          viewBox="0 0 20 20"
        >
          <FileDownloadDoneIcon />
        </svg>
        <span className="absolute left-1 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-green-700 px-2 py-1 text-xs font-bold leading-none text-red-100">
          {format.okFormat.length > 0 ? format.okFormat.length : "-"}
        </span>
      </span>
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
    </div>
  );
};

export default FormatInfo;
