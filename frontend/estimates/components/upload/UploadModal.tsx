import { isErrorImportResponse } from "@/const/typegurads";
import {
  ErrorImportResponse,
  ImportVisrResponse,
  acceptImport,
} from "@/lib/api/postAcceptImport";
import { ImportData } from "@/lib/api/postImport";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { ActiveBuilding } from "@/redux/slice/buildingSlice";
import {
  setImportDataResponse,
  setImportError,
} from "@/redux/slice/uploadSlice";
import { Dialog, Transition } from "@headlessui/react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
const UploadModal: React.FC<ImportData & { onClose: () => void }> = ({
  filesInfo,
  detail,
  tempFileId,
  confirmation,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useAppSelector(ActiveBuilding);

  const handleConfirmImport = async (confirmation: boolean) => {
    try {
      const result = await acceptImport(tempFileId, confirmation, id!);
      if (Array.isArray(result.detail)) {
        const data = result.detail as unknown as ImportVisrResponse[];
        dispatch(setImportDataResponse(data));
        router.prefetch(`/main/srv/${id}`);
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
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-sm  font-medium leading-6 text-gray-900"
                  >
                    Статистика импорта:{" "}
                    <span className="text-sm font-light">{detail}</span>
                  </Dialog.Title>
                  <div className="my-2 h-32 w-full rounded-md border-[0.5px] border-solid  border-sky-600 dark:border-red-900">
                    {filesInfo.flatMap(([file, count]) => (
                      <Fragment key={file}>
                        <p className="inline-flex items-center  pl-2 text-lg text-gray-900 ">
                          {file}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;({count}
                          )&nbsp;ЕВР
                          <CheckCircleOutlineIcon
                            fontSize="small"
                            className="mb-1 ml-2 text-green-700"
                          />
                        </p>
                      </Fragment>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between justify-self-end sm:space-x-4">
                    <button
                      className="inline-flex min-w-[100px] justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => handleConfirmImport(false)}
                    >
                      close
                    </button>
                    <button
                      className="inline-flex min-w-[100px] justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => handleConfirmImport(true)}
                    >
                      загрузить в бд
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UploadModal;
