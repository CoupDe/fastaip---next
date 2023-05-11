import Image from "next/image";
import React from "react";
import doc from "@/public/doc_download.svg";
import { dmMono } from "@/app/layout";
type Props = {};

const HomeInfo = (props: Props) => {
  return (
    <div className="container mx-auto h-full flex flex-col px-3 justify-center items-center font-sspro sm:flex-row">
      <div className="flex-1  flex flex-col  justify-center items-center ">
        <button>
          <Image
            src={doc}
            alt="download_doc"
            width={150}
            priority
            className="ml-5"
          />
        </button>
        <h3 className={`text-sm tracking-wider font-bold `}>
          Техническая документация
        </h3>
        <p className={`text-sm tracking-wider font-bold `}>Content goes here</p>
      </div>

      {/* <span className="h-[400px] w-1 bg-red-600 shadow-xl  shadow-sky-600 "></span> */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <h3 className={`text-lg font-bold `}>
          Добро пожаловать в{" "}
          <a className="decoration-sky-600 underline underline-offset-4 dark:decoration-red-900">
            ПК ...
          </a>
        </h3>
        <p className="italic line-clamp-5 leading-relaxed mt-3 normal-case indent-4">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum quam
          quae omnis, consequatur soluta veniam amet maxime provident pariatur
          totam sint esse quaerat dolorem ad illum atque? Natus, hic soluta!
        </p>
      </div>
    </div>
  );
};

export default HomeInfo;
