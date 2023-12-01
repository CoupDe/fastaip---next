import { isErrorImportResponse } from "@/const/typegurads";
import {
  ErrorImportResponse,
  FileRequestPath,
  ImportVisrResponse,
  acceptImport,
} from "@/lib/api/postConfirmImportVisr";

import { UploadFileResponse } from "@/lib/api/uploadVisrFiles/postVisrFiles";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { ActiveBuilding } from "@/redux/slice/buildingSlice";
import {
  setImportDataResponse,
  setImportError,
} from "@/redux/slice/uploadSlice";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import StatsInfo from "./StatsPopup";

interface UploadModalProps {
  importData: UploadFileResponse;
  onClose: () => void;
}
const UploadModal: React.FC<UploadModalProps> = ({ importData, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useAppSelector(ActiveBuilding);
  const totalVisr = importData.stats.visr_df_id + importData.stats.visr_non_id;
  const { redis_key_id, redis_key_non_id, tasks_key } = importData;
  const sendFiles: FileRequestPath = {
    redis_key_id,
    redis_key_non_id,
    tasks_key,
  };
  const handleConfirmImport = async (
    confirmation: boolean,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const result = await acceptImport(sendFiles, confirmation, id!);
      if (Array.isArray(result.detail)) {
        const data = result.detail as unknown as ImportVisrResponse[];

        dispatch(setImportDataResponse(data));
        router.refresh();
      }
    } catch (error: unknown) {
      if (isErrorImportResponse(error)) {
        const errorResponse = error as ErrorImportResponse;
        dispatch(setImportError(errorResponse.detail));
      } else {
        console.log(error);
        throw "Unknow Error in Import";
      }
    }
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="relative z-10">
          <>
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <>
                <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="text-sm  font-medium leading-6 text-gray-900">
                    Статистика импорта:
                    <span className="ml-2 text-sm text-red-500 font-light">
                      Указать количество файлов
                    </span>
                  </div>
                  <div>
                    <div className="my-2 h-32 w-full rounded-md border-[0.5px] border-solid  border-sky-600 dark:border-red-900">
                      <Fragment key={importData.file_name}>
                        <p className="inline-flex items-center pl-2 text-lg text-gray-900">
                          {importData.file_name}({totalVisr})&nbsp;ЕВР
                          <span className="group hover:bg-gray-100">
                            <CheckCircleOutlineIcon
                              className="h-5 w-5 mb-1 ml-2 text-green-700 cursor-pointer"
                              onMouseEnter={() => setShowDetails(true)}
                              onMouseLeave={() => setShowDetails(false)}
                            />
                          </span>
                        </p>
                      </Fragment>
                      {showDetails && <StatsInfo {...importData.stats} />}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between justify-self-end sm:space-x-4">
                    <button
                      className="inline-flex min-w-[100px] justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={(e) => handleConfirmImport(false, e)}
                    >
                      close
                    </button>
                    <button
                      className="inline-flex min-w-[100px] justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={(e) => handleConfirmImport(true, e)}
                    >
                      загрузить в бд
                    </button>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadModal;
