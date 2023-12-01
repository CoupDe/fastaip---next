import React from "react";

type Props = { isForm?: boolean };

const TheadTable = (props: Props) => {
  return (
    <thead className="w-full    bg-gray-800 text-gray-500">
      <tr className="">
        <th colSpan={props.isForm ? 5 : 3} className="p-3 ">
          Наименование
        </th>

        <th colSpan={4} className="p-3 ">
          Стоимостные показатели
        </th>
      </tr>
      <tr className="[&_th]:p-1 bg-gray-800 sticky  top-0">
        <th className="">Код</th>
        {props.isForm && <th className="">Статус ЕВР</th>}
        {props.isForm && <th className="w-[10px]">Проект</th>}
        <th className="">{props.isForm ? "Обоснование" : "Вид работ"}</th>
        <th className="">Наименование</th>
        <th className="">Ед. измерения</th>
        <th className="">Количество</th>
        <th className="">Ст. единицы</th>
        <th className="">Стоимость всего</th>
      </tr>
    </thead>
  );
};

export default TheadTable;
