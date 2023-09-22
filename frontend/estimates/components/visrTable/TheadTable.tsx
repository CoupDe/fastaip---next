import React from "react";

type Props = { isForm?: boolean };

const TheadTable = (props: Props) => {
  return (
    <thead className="w-full   bg-gray-800 text-gray-500">
      <tr className="">
        <th colSpan={4} className="p-3 ">
          Наименование
        </th>

        <th colSpan={4} className="p-3 ">
          Стоимостные показатели
        </th>
      </tr>
      <tr className="[&_th]:p-1 bg-gray-800 sticky z-10 top-0">
        <th className="">Код</th>
        <th className="">Номер</th>
        {/* <th className="">Обоснование</th> */}
        <th className="">Наименование работ</th>
        <th className="">Ед. измерения</th>
        <th className="">Количество</th>
        <th className="">Ст. единицы</th>
        <th className="">Стоимость всего</th>
      </tr>
    </thead>
  );
};

export default TheadTable;
