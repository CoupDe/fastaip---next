import { createConstruction } from "@/lib/api/createConstruction";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import patchConstruction from "@/lib/api/patchConstruction";
import createBuilding from "@/lib/api/createBuilding";
type FormProps = { closeModal: () => void; modalProps: ModalFormProps };
// type FormValues = {
//   name: string;
//   code_structure?: string;
//   code_building?: string;
// };
interface ISubmitConstruction {
  name: string;
  code_structure: string;
}
interface ISubmitBuilding {
  name: string;
  code_building: string;
}
type SubmitForm = ISubmitConstruction | ISubmitBuilding;
const ConstructionFormCreate: React.FC<FormProps> = ({
  closeModal,
  modalProps,
}: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitForm>();
  const router = useRouter();
  console.log("enter", modalProps.showForm);
  // Не уверен что хорошая идея обновлять посредством router.refresh, при добавлении через форму посредством
  // Подходит ли switch для универсальной формы
  // : SubmitHandler<Building | Construction>
  const onSubmit = async (data: SubmitForm) => {
    let sendData: Building | Construction;
    let res;
    if ("code_building" in data) {
      console.log("building HERE");

      sendData = {
        ...data,
        structure_id: modalProps.construction?.id!,
      };
    } else {
      sendData = { ...data, id: modalProps.construction?.id };
    }
    switch (modalProps.showForm) {
      case "newConstruction":
        console.log("newConstruction", sendData);
        res = await createConstruction(sendData as Construction);
        break;
      case "editConstruction":
        console.log("editConstruction", sendData);
        res = await patchConstruction(sendData as Construction);
        break;
      case "newBuilding":
        console.log("newBuilding", sendData);

        res = await createBuilding(sendData as Building);
        break;
    }
    // res.id && router.refresh();
    console.log(res);
    res.id && router.refresh();
    closeModal();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      id="constructionForm"
      className="bg-white shadow-md rounded pt-6  mb-4 flex flex-col"
    >
      {/* register your input into the hook by invoking the "register" function */}
      <label className="block text-gray-700 text-sm " htmlFor="name">
        Название стройки
      </label>
      <input
        defaultValue={
          modalProps.showForm === "editConstruction"
            ? modalProps.construction?.name
            : ""
        }
        {...register("name")}
        id="name"
        className="shadow appearance-none border rounded border-sky-600 dark:border-red-900 w-full py-2 px-3 bg-inherit text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {errors.name && <span>This field is required</span>}
      {/* include validation with required or other standard HTML validation rules */}
      <label
        className=" text-gray-700 text-sm mt-4"
        htmlFor={`${
          modalProps.showForm === "newBuilding"
            ? "code_building"
            : "code_structure"
        }`}
      >
        {`${
          modalProps.showForm === "newBuilding" ? "Код объекта" : "Код стройки"
        }`}
        {errors && (
          <span className="text-xs text-orange-700 leading-[2px] mt-3 float-right">
            Обязательное поле<sup>*</sup>
          </span>
        )}
      </label>

      <input
        {...register(
          `${
            modalProps.showForm === "newBuilding"
              ? "code_building"
              : "code_structure"
          }`,
          { required: true }
        )}
        className="shadow appearance-none border rounded border-sky-600 dark:border-red-900 w-full py-2 px-3 text-gray-700 bg-inherit leading-tight focus:outline-none focus:shadow-outline"
        placeholder={"192.168.55"}
        defaultValue={
          modalProps.showForm === "editConstruction"
            ? modalProps.construction?.code_structure
            : ""
        }
        id={`${
          modalProps.showForm === "newBuilding"
            ? "code_building"
            : "code_structure"
        }`}
      />
      {/* errors will return when field validation fails  */}
      <div className="mt-4 sm:space-x-4 flex justify-between justify-self-end">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border  min-w-[100px] border-transparent bg-blue-100  py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={closeModal}
        >
          Закрыть
        </button>
        <button
          form="constructionForm"
          type="submit"
          className="inline-flex justify-center rounded-md border min-w-[100px] border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={() => {}}
        >
          Создать
        </button>
      </div>
    </form>
  );
};

export default ConstructionFormCreate;
