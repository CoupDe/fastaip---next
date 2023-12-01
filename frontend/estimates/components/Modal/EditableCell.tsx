import { EstimatedPrice } from "@/const/interfaces";
import { checkNumberofPercent } from "@/lib/util/service";
import React, { useDeferredValue, useRef, useState } from "react";
type EditableCellProps = { estimated_price: EstimatedPrice; isLast: boolean };

export const EditableCell = ({
  estimated_price,
  isLast,
}: EditableCellProps) => {
  const [percentValue, setPercentValue] = useState<number | string>("");
  const [resultSum, setResultSum] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const deferredQuery = useDeferredValue(percentValue);

  const calculateResult = (percent: number): string => {
    const calulateValue = Number(percent);
    let calculatedResult: string = "";
    if (calulateValue <= 100) {
      const calulateValue = percent > 0 ? percent / 100 : 0;

      calculatedResult = (estimated_price.total_cost * calulateValue).toFixed(
        2
      );
    }
    return calculatedResult !== "0.00" ? calculatedResult : "";
  };
  ////////////////////
  function handleTotalCostChange(
    e: React.ChangeEvent<HTMLInputElement>
    // id: number | undefined
  ) {
    let value = e.target.value;
    value = value.replace(/[^0-9,.]/g, ""); // разрешаем только цифры и запятую
    setPercentValue(value); // устанавливаем значение
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      let cellValue = checkNumberofPercent(String(percentValue));
      //   if (percentValue === 0) setPercentValue("");
      setPercentValue(cellValue || "");
      setIsEditing(false);
      inputRef.current!.blur();
    }
  }
  function handleBlur() {
    let cellValue = checkNumberofPercent(String(percentValue));
    setPercentValue(cellValue || "");
    setIsEditing(false);
  }
  return (
    <>
      <td
        className={`text-center border-r-2 ${
          isLast ? "" : "border-b-2"
        } border-red-400 border-red-400"`}
      >
        <input
          type="text"
          name="percentVal"
          autoComplete="off"
          className={`h-full  w-[40px] bg-transparent text-center text-black border-none 
           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
           [&::-webkit-inner-spin-button]:appearance-none `}
          placeholder="%"
          ref={inputRef}
          value={percentValue}
          onBlur={handleBlur}
          onKeyDown={(e) => handleKeyPress(e)}
          onChange={(e) => handleTotalCostChange(e)}
        />
      </td>
      <td
        className={`w-[70px] text-center ${
          isLast ? "" : "border-b-2"
        }  border-red-400 w-10`}
      >
        {percentValue !== "" && calculateResult(Number(percentValue))}
      </td>
    </>
  );
};
//   index === lastEstimatesPrice ? "" : "border-b-2"
