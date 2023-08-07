import React from "react";

type Props = {};

const TheadTable = (props: Props) => {
  return (
    <thead className="bg-gray-800 text-gray-500">
      <tr>
        <th colSpan={4} className="p-3">
          Наименование
        </th>

        <th colSpan={4} className="p-3 ">
          Стоимостные показатели
        </th>
      </tr>
      <tr className="[&_th]:p-1">
        <th className="">Код</th>
        <th className="">Номер</th>
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
