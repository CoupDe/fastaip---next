import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { importData } from "@/lib/api/postImport";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
const UploadModal: React.FC<importData> = ({
  filesInfo,
  detail,
  tempFilePath,
}) => {
  let [isOpen, setIsOpen] = useState(true);
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
                        <p className="inline-flex pl-2 align-middle text-gray-900 ">
                          {file}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;({count})ЕВР
                        </p>
                        <CheckCircleOutlineIcon
                          fontSize="small"
                          className="text-green-700"
                        />
                      </Fragment>
                    ))}
                  </div>
                  <button
                    className="  text-gray-900 "
                    onClick={() => setIsOpen(false)}
                  >
                    close
                  </button>
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
