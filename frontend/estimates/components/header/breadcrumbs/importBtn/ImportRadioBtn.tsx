import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  SelectedImportType,
  UploadType,
  setImportType,
} from "@/redux/slice/uploadSlice";
import { RadioGroup } from "@headlessui/react";
import React, { Fragment, useState } from "react";
const radioLabel = ["ВИСР", "ЕВР", "Формы"];
type Props = {};

const ImportRadioBtn = (props: Props) => {
  const selectedImportType = useAppSelector(SelectedImportType);
  const dispatch = useAppDispatch();
  console.log("from slice,selectedType", selectedImportType);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setImportType(e.currentTarget.value as UploadType));
  };
  return (
    <div className="flex items-center ">
      {radioLabel.map((label, _) => (
        <React.Fragment key={_}>
          <input
            checked={selectedImportType === label}
            id={`{bordered-radio-${label}}`}
            type="radio"
            value={`${label}`}
            onChange={(e) => handleChange(e)}
            name="bordered-radio"
            className="h-4 w-4  bg-gray-100 hover:cursor-pointer  dark:bg-gray-700 dark:ring-offset-gray-800 "
          />
          <label
            htmlFor={`{bordered-radio-${label}}`}
            className="mx-2 w-full pt-1 align-middle  text-xs font-medium  hover:cursor-pointer  "
          >
            {label}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ImportRadioBtn;
