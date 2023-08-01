"use client";
import { createConstruction } from "@/lib/api/createConstruction";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import patchConstruction from "@/lib/api/patchConstruction";
import createBuilding from "@/lib/api/createBuilding";
import { isError } from "@/const/typegurads";
import { error } from "console";
import SnackBar from "./SnackBar";
type FormProps = { closeModal: () => void; modalProps: ModalFormProps };
// ------------!!!!!!!!Реализовать портал для SnackBar!!!!!!!!!!!..
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
  const [myError, setMyError] = useState<FetchError>();
  // Не уверен что хорошая идея обновлять посредством router.refresh, при добавлении через форму посредством
  // Подходит ли switch для универсальной формы
  // : SubmitHandler<Building | Construction>
  console.log("myError", myError);
  const onSubmit = async (data: SubmitForm) => {
    let sendData: Building | Construction;
    let res: Building | Construction | FetchError;
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

    if (isError(res)) {
      setMyError(res);
      console.log("in errrrr res", res);
    } else if (res.id) {
      res.id && router.refresh();
      closeModal();
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      id="constructionForm"
      className="mb-4 flex flex-col rounded  bg-white pt-6 shadow-md"
    >
      {/* register your input into the hook by invoking the "register" function */}
      <label className="block text-sm text-gray-700 " htmlFor="name">
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
        className="focus:shadow-outline w-full appearance-none rounded border border-sky-600 bg-inherit px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:border-red-900"
      />
      {errors.name && <span>This field is required</span>}
      {/* include validation with required or other standard HTML validation rules */}
      <label
        className=" mt-4 text-sm text-gray-700"
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
          <span className="float-right mt-3 text-xs leading-[2px] text-orange-700">
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
        className="focus:shadow-outline w-full appearance-none rounded border border-sky-600 bg-inherit px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:border-red-900"
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
      <div className="mt-4 flex justify-between justify-self-end sm:space-x-4">
        <button
          type="button"
          className="inline-flex min-w-[100px] justify-center rounded-md  border border-transparent bg-blue-100  py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={closeModal}
        >
          Закрыть
        </button>
        <button
          form="constructionForm"
          type="submit"
          className="inline-flex min-w-[100px] justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={() => {}}
        >
          Создать
        </button>
      </div>
      {myError && <SnackBar />}
    </form>
  );
};

export default ConstructionFormCreate;
