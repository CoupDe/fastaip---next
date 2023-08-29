import TheadTable from "@/components/visrTable/TheadTable";
import * as React from "react";

export interface IAppProps {}

export default function Loading(props: IAppProps) {
  return (
    <tr className="bg-gray-500 ">
      <td className="w-full " height="75%" colSpan={8} align="center">
        .........Loading
      </td>
    </tr>
  );
}
