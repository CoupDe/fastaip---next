import React, { useEffect } from "react";

interface Props {
  importError: string;
  onClose: () => void;
}
// Исправить исчезновение компонента
export const PopupImport = (props: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onClose();
    }, 2900);

    return () => clearTimeout(timer);
  }, [props]);

  return (
    <div className="fixed bottom-4 right-4">
      <div
        className="mb-1 flex animate-slideErrorPopupLeft flex-col rounded-md border border-slate-300 bg-[#ded0c1] text-red-400 dark:bg-slate-300"
        role="alert"
      >
        <div className="border-b border-white px-4 py-1 text-sm font-medium">
          Ошибка импорта
        </div>
        <div className="px-4 py-1 text-sm">{props.importError}</div>
      </div>
    </div>
  );
};
