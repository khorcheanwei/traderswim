import { Fragment } from "react";

export function Overlay({ isOpenAccountLogin, onClose, children }) {
  return (
    <Fragment>
      {isOpenAccountLogin && (
        <div className="overlay">
          <div className="w-full h-full z-10 cursor-pointer top-0 left-0 fixed bg-black bg-opacity-50" onClick={onClose} />
          <div className="overlay__container bg-white fixed inset-0 m-auto z-10 p-10 w-fit h-fit">
            <div className="overlay__controls flex justify-end">
              <button
                className="overlay__close text-4xl after:content-['\00d7']"
                type="button"
                onClick={onClose}
              />
            </div>
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Overlay;