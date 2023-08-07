"use client";

import path from "path";
import React from "react";
import FormatInfo from "./FormatInfo";

const searchFormats = function (files: FileList): SearchFormats {
  const badFormat = [...files].filter(
    (file) => !formats.includes(path.extname(file.name))
  );
  const okFormat = [...files].filter((file) =>
    formats.includes(path.extname(file.name))
  );
  return { badFormat, okFormat };
};


const formats = [".xls", ".xlsx", ".xlsm"];
const UploadForm = () => {
  const [dragActive, setDragActive] = React.useState(false);
  const [showFiles, setShowFiles] = React.useState(false);
  const [fileFormats, setFileFormats] = React.useState<SearchFormats>();
  const dragHandler = (event: React.DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { files } = event.dataTransfer;
    setFileFormats(searchFormats(files));
    setDragActive(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLFormElement>): void => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    event.preventDefault();
    event.stopPropagation();
    if (event.target.files) {
      const files = event.target.files;
      setFileFormats(searchFormats(files));
      setDragActive(true);
    }
  };

  return (
    <>
      <form
        id="dragfileForm"
        className={`flex w-full items-center justify-center `}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => dragHandler(e)}
      >
        <label
          className={`dark:hover:bg-bray-800 flex h-28 w-full   flex-col items-center justify-center
           rounded-lg border-2 border-dashed border-gray-400 bg-[#ded0c1]  ${
             !dragActive &&
             " cursor-pointer hover:bg-[#e9dacb] dark:hover:border-gray-500 dark:hover:bg-gray-600"
           }      dark:border-gray-600 dark:bg-gray-700 `}
        >
          <div className="flex flex-col items-center justify-center py-2">
            {fileFormats ? (
              <FormatInfo format={fileFormats} setShow={setShowFiles} />
            ) : (
              <>
                <svg
                  aria-hidden="true"
                  className="mb-3 h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Нажмите для загрузки</span>
                  или перетащите файл
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  *.XLS, *.XLSX, *.XLSM
                </p>
              </>
            )}
            {!fileFormats?.okFormat.length && fileFormats && (
              <p className="mt-2 rounded border border-red-400 px-1.5 pt-0.5 text-center text-xs  text-red-800 dark:bg-gray-700 dark:text-red-400">
                Нет доступных форматов для загрузки
              </p>
            )}
          </div>
          {!dragActive && (
            <input
              id="dragfile"
              type="file"
              className="hidden"
              accept={formats.join()}
              multiple
              onChange={(e) => handleFileChange(e)}
            />
          )}
        </label>
      </form>

      {showFiles && (
        <div>
          {fileFormats?.badFormat.map((file) => (
            <span
              key={file.name}
              className="mr-1 mt-1 inline-block h-5  rounded border border-red-400 bg-red-100 px-1.5 text-xs font-medium text-red-800 dark:bg-gray-700 dark:text-red-400"
            >
              {file.name}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default UploadForm;
