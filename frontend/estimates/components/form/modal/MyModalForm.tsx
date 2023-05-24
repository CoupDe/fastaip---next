import { Dialog, Transition } from "@headlessui/react";
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
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
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
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
