import { Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";
import ConstructionFormCreate from "../FormCreateConstruction";

type FormProps = {
  handleShowModal: () => void;
  showModal: boolean;
  modalProps: ModalFormProps;
};
const MyTitle = ({
  construction,
  showForm,
}: ModalFormProps): React.ReactElement => {
  //  edit ? "Редактировать объект" : "Добавить объект в"
  console.log("showForm", showForm);
  let variantTitle: string;
  if (construction !== undefined && showForm === "editConstruction") {
    variantTitle = `Редактировать объект проектирования ${construction.name}`;
  } else if (construction != undefined && showForm === "newBuilding") {
    variantTitle = `Добавить объект в ${construction.name}`;
  } else {
    variantTitle = `Создать объект проектирования`;
  }

  return (
    <>
      {variantTitle} {` `}
    </>
  );
};

export default function MyModalForm(props: FormProps) {
  let [isOpen, setIsOpen] = useState(props.showModal);

  function closeModal() {
    props.handleShowModal();
    setIsOpen(false);
  }

  return (
    <>
      {isOpen && (
        <Dialog as="div" open={isOpen} className="relative z-10" onClose={() => { }}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-sm font-medium leading-6 text-gray-900"
                >
                  <MyTitle {...props.modalProps} />
                </Dialog.Title>
                <div className="mt-2">
                  <ConstructionFormCreate
                    closeModal={closeModal}
                    modalProps={props.modalProps}
                  />
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
