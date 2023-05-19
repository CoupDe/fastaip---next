import React from "react";

type ModalProps = {
  handleShowModal: () => void;
  showModal?: boolean;
  //   handleShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const TestModal: React.FC<ModalProps> = ({ showModal, handleShowModal }) => {
  return (
    <div className="w-1/3 h-1/3 bg-gray-700 z-20 absolute top-1/2 left-1/2">
      <dialog id="favDialog">
        <form method="dialog">
          <section>
            <input type="text" placeholder="adsddddddddd"/>
            <p>
              <label>Favorite animal:</label>
              <select id="favAnimal">
                <option></option>
                <option>Brine shrimp</option>
                <option>Red panda</option>
                <option>Spider monkey</option>
              </select>
            </p>
          </section>
          <menu>
            <button id="cancel" type="reset">
              Cancel
            </button>
            <button type="submit">Confirm</button>
          </menu>
        </form>
      </dialog>
      <button onClick={() => handleShowModal()}>aaaaaaaaa</button>
    </div>
  );
};

export default TestModal;
