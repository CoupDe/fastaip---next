"use client";

import Social from "@/components/social/Social";
import { useSession } from "next-auth/react";

import Image from "next/image";
import { useForm } from "react-hook-form";
import logo from "../../public/estimate-icon.svg";
type FormValuesLogin = {
  userName: string;
  password: string;
};
// 1. Убрать статус 2. Если пользователь авторизирован, сделать redirect to home
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesLogin>();
  const { data: session, status } = useSession();

  const onFormSubmit = (data: FormValuesLogin) => console.log(data);
  const onErrors = (errors: any) => console.error(errors);
  console.log(session);
  return (
    <div className="w-full h-full md:mx-auto flex flex-col justify-center items-center">
      {/* 1 */}
      <h1>{status}</h1>
      <div className="flex flex-col items-center justify-center  w-1/3 max-w-[300px] shadow-xl  pt-2 rounded-sm  dark:bg-gray-700">
        <Image className="w-16 h-16 mb-4 " src={logo} alt="logo" />
        <h4 className="text-slate-400">СТНГ-ГСП</h4>
        <form
          className="w-full max-w-sm p-2"
          onSubmit={handleSubmit(onFormSubmit, onErrors)}
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-slate-400  text-sm font-bold mb-2"
            >
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Username"
              {...register("userName", {
                required: {
                  value: true,
                  message: "Поле является обяательным для заполнения",
                },
              })}
            />
            {errors?.userName && (
              <p className="animate-fade font-light text-[0.5rem] mt-2 text-red-300">
                {errors.userName.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-slate-400 text-sm font-bold mb-2"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Поле является обяательным для заполнения",
                },
                maxLength: {
                  value: 30,
                  message: "Максимальное число символов - 30",
                },
              })}
            />
            {errors.password?.message ? (
              <p className="animate-fade font-light text-[0.5rem] mt-2 text-red-300">
                {errors.password?.message}
              </p>
            ) : (
              <p className="animate-fade font-light text-[0.5rem] mt-2 text-red-300"></p>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign In
            </button>
          </div>
        </form>

        <Social />
      </div>
    </div>
  );
}
