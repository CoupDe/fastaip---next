import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import ConstructionFormCreate from "../FormCreateConstruction";
import { capitalize, isNumber } from "@/lib/util/isNumber";
type ModalFormProps = {
  handleShowModal: () => void;
  showModal: boolean;
  modalProps?: { construction?: Construction; edit?: boolean };
};

const MyTitle: React.FC<{
  modalProps: { construction: Construction; edit?: boolean };
}> = ({ modalProps: { construction, edit } }): React.ReactElement => {
  const variantTitle = edit ? "Редактировать объект" : "Добавить объект в";
  return (
    <>
      {variantTitle} {` `}
      {isNumber(construction.name[0])
        ? capitalize(construction.name)
        : construction.name}
    </>
  );
};

export default function MyModal(props: ModalFormProps) {
  let [isOpen, setIsOpen] = useState(props.showModal);
  console.log(props.modalProps);
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
                    {!props.modalProps?.construction ? (
                      "Созание проекта строительства"
                    ) : (
                      <MyTitle modalProps={props.modalProps!} />
                    )}
                  </Dialog.Title>
                  <div className="mt-2">
                    <ConstructionFormCreate closeModal={closeModal} />
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
