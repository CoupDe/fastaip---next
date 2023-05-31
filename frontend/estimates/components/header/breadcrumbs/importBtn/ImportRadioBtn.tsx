import { RadioGroup } from "@headlessui/react";
import React, { Fragment, useState } from "react";

type Props = {};
const radioLabel = ["ВИСР", "ЕВР", "Формы"];
const ImportRadioBtn = (props: Props) => {
  const [activeRadioLabel, setActiveRadioLabel] = useState(radioLabel[0]);
  return (
    <div className="flex items-center ">
      {radioLabel.map((label, _) => (
        <React.Fragment key={_}>
          <input
            id={`{bordered-radio-${label}}`}
            type="radio"
            value={`${label}`}
            onClick={(e) => console.log(e.currentTarget.value)}
            name="bordered-radio"
            className="h-4 w-4  bg-gray-100 hover:cursor-pointer  dark:bg-gray-700 dark:ring-offset-gray-800 "
          ></input>
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
