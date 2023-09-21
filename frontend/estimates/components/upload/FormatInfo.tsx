import postImportFormFile from "@/lib/api/postImportForm";
import postVisrFiles, {
  UploadFileResponse,
} from "@/lib/api/uploadVisrFiles/postVisrFiles";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { ActiveBuilding } from "@/redux/slice/buildingSlice";
import {
  SelectImportError,
  SelectedImportType,
  setImportError,
} from "@/redux/slice/uploadSlice";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import React, { useState } from "react";
import { PopupImport } from "./PopupImport";
import UploadModal from "./UploadModal";

type PropsFormat = {
  format: SearchFormats;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};
const FormatInfo: React.FC<PropsFormat> = ({
  format,
  setShow,
}: PropsFormat) => {
  const [importData, setimportData] = useState<UploadFileResponse>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [noFiles, setNoFiles] = useState(false);
  const importError = useAppSelector(SelectImportError);
  const importType = useAppSelector(SelectedImportType);
  const dispatch = useAppDispatch();
  const { id } = useAppSelector(ActiveBuilding);

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
      if (!!!importData) {
        console.log("importType", importType);
        switch (importType) {
          case "ВИСР":
            try {
              const resultVisr = await postVisrFiles(okFormat, id);
              console.log("in ВИСР", resultVisr);
              setimportData(resultVisr);

              setShowModal(true);
            } catch (error) {
              console.log(error);
            }
            break;
          case "Формы":
            try {
              const resultForm = await postImportFormFile(okFormat, id);

              setimportData(resultForm);

              setShowModal(true);
            } catch (error) {
              console.log(error);
            }
            break;
        }
      }
    }
  };

  return (
    <div className="flex items-center">
      <button
        // disabled={!!importInfo}
        onClick={(event) => sendFiles(format.okFormat, id, event)}
        className="relative inline-block"
      >
        <svg
          className={` h-6 w-6 fill-current text-gray-700 dark:text-slate-200  `}
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
      {importData && showModal && (
        <UploadModal
          importData={importData}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
      {importError && (
        <PopupImport
          importError={importError}
          onClose={() => dispatch(setImportError(null))}
        />
      )}
    </div>
  );
};

export default FormatInfo;
