"use client";
import { Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import EditIcon from "@mui/icons-material/Edit";
import MyModalForm from "../form/modal/MyModalForm";

type Props = { construction: Structure };
let showForm: FormStatus;

const ConstructionItem: React.FC<Props> = ({ construction }) => {
  const [isHovered, setHovered] = useState(false);
  const [modalProps, setModalProps] = useState<ModalFormProps>();
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal((showModal) => !showModal);
    setHovered(false);
  };

  const handleShowButton = <T extends Construction, U extends FormStatus>(
    construction: T,
    showForm: U
  ) => {
    construction;
    setModalProps({ construction, showForm });
    setShowModal(true);
  };

  return (
    <ul
      role="list"
      className={`ulTree ${
        construction.buildings.length > 0 &&
        "dark:hover:text-neutral-300 hover:text-gray-700 normal-case "
      } inline-flex items-center `}
      onClick={() => setHovered(true)}
      onMouseLeave={(e) => {
        setHovered(false);
      }}
    >
      <span>
        <i className="text-neutral-400 mr-2 text-sm">
          {construction.code_structure}
        </i>
        {construction.name}
      </span>

      <Transition show={isHovered}>
        {/* Background overlay */}
        <Transition.Child
          as={"span"}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <button
            onClick={() => {
              showForm = "newBuilding";
              handleShowButton(construction, showForm);
            }}
            className={`duration-300 opacity-0  ${
              isHovered && "opacity-100"
            }   ml-4 inline-flex `}
          >
            <AddHomeWorkIcon
              className="hover:text-zinc-300"
              style={{ fontSize: "1rem" }}
            />
          </button>
        </Transition.Child>
        <Transition.Child
          as={"span"}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <button
            onClick={() => {
              showForm = "editConstruction";
              handleShowButton(construction, showForm);
            }}
            className={`duration-300 opacity-0  ${
              isHovered && "opacity-100"
            }   ml-2 inline-flex `}
          >
            <EditIcon
              className="hover:text-zinc-300"
              style={{ fontSize: "1rem" }}
            />
          </button>
        </Transition.Child>
      </Transition>
      {showModal && (
        <MyModalForm
          showModal={showModal}
          handleShowModal={handleShowModal}
          modalProps={modalProps!}
        />
      )}
    </ul>
  );
};

export default ConstructionItem;
