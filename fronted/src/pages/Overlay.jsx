import { Fragment } from "react";

export function Overlay({ isOpen, onClose, children }) {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div
            className="w-full h-full z-10 cursor-pointer top-0 left-0 fixed bg-black bg-opacity-50"
            onClick={onClose}
          />
          <div className="overlay__container bg-white fixed inset-0 m-auto z-10 p-10 w-fit h-fit">
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Overlay;
