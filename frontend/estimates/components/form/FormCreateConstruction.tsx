import { createConstruction } from "@/lib/api/createConstruction";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
type Props = { closeModal: () => void };

const ConstructionFormCreate = ({ closeModal }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Construction>();
  const router = useRouter();
  const handleCreateConstruction = async (data: Construction) => {
    const res = await createConstruction(data);
    res.id && router.refresh();
    closeModal();
    return res;
  };
  const onSubmit: SubmitHandler<Construction> = (data) =>
    handleCreateConstruction(data);
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
        defaultValue=""
        {...register("name")}
        id="name"
        className="shadow appearance-none border rounded border-sky-600 dark:border-red-900 w-full py-2 px-3 bg-inherit text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {errors.name && <span>This field is required</span>}
      {/* include validation with required or other standard HTML validation rules */}
      <label className=" text-gray-700 text-sm mt-4" htmlFor="code_structure">
        Код стройки
        {errors.code_structure && (
          <span className="text-xs text-orange-700 leading-[2px] mt-3 float-right">
            Обязательное поле<sup>*</sup>
          </span>
        )}
      </label>

      <input
        {...register("code_structure", { required: true })}
        className="shadow appearance-none border rounded border-sky-600 dark:border-red-900 w-full py-2 px-3 text-gray-700 bg-inherit leading-tight focus:outline-none focus:shadow-outline"
        placeholder="125.5.887"
        id="code_structure"
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
          onClick={() => handleCreateConstruction}
        >
          Создать
        </button>
      </div>
    </form>
  );
};

export default ConstructionFormCreate;
