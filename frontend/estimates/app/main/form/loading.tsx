import "@/styles/loaderStyle.css";

export interface IAppProps {}

export default function Loading(props: IAppProps) {
  return (
    <tr className="bg-gray-500 h-[70vh] ">
      <td className="w-full " colSpan={9} align="center">
        <div className="loader "></div>
      </td>
    </tr>
  );
}
