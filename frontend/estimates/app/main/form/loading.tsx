import "@/styles/loaderStyle.css";

export interface IAppProps {}

export default function Loading(props: IAppProps) {
  return (
    <div className="flex flex-row h-full place-content-center ">
      <div className="loader place-self-center">111</div>
    </div>
  );
}
