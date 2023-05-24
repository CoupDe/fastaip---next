import React, { Fragment, useEffect, useState } from "react";
import AddHomeIcon from "@mui/icons-material/AddHome";
import { Transition } from "@headlessui/react";
import ModalFormConstr from "../../../form/modal/MyModalForm";
import TestModal from "../dialogAddConstruction/TestModal";
import MyModal from "../../../form/modal/MyModalForm";
type Props = {};
// Отображение модального окна и popover

const AddConstructionBtn = (props: Props) => {
  const [isShow, setIsShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalProps: ModalFormProps = { showForm: "newConstruction" };
  const handleShowModal = () => {
    setShowModal((showModal) => !showModal);
    !showModal && setIsShow((isShow) => !isShow);
  };

  return (
    <>
      <div
        className="group cursor-pointer relative  text-center"
        onMouseEnter={() => setIsShow(true)}
        onMouseLeave={() => setIsShow(false)}
      >
        <button
          type="button"
          onClick={() => handleShowModal()}
          className="text-white bg-neutral-400 
       hover:bg-slate-400 hover:dark:bg-neutral-500 focus:outline-none focus:shadow-sm  mt-2 rounded-full text-sm p-1 text-center inline-flex items-center "
        >
          <Transition
            as={Fragment}
            show={isShow}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div className="opacity-0 w-32  text-black dark:text-white bg-neutral-400 text-center text-xs rounded-lg py-1 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 ml-7 px-1 pointer-events-none">
              Добавить стройку
            </div>
          </Transition>
          <AddHomeIcon
            fontSize="small"
            className="dark:text-white text-slate-800"
          />
        </button>
      </div>
      {/* {showModal && <TestModal handleShowModal={handleShowModal} />} */}
      {showModal && (
        <MyModal
          showModal={showModal}
          handleShowModal={handleShowModal}
          modalProps={modalProps}
        />
      )}
    </>
  );
};

export default AddConstructionBtn;
