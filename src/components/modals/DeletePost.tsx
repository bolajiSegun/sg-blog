import { Dispatch, Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextValue, ResponseBody } from "../../types/types";
import { SERVER_URL } from "../../constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DeletePost = ({
  open,
  setOpen,
  dataId,
}: {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  dataId: any;
}) => {
  const cancelButtonRef = useRef(null);

  const { token } = useContext(AuthContext) as AuthContextValue;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const deletePost = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/post/${dataId}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      const data: ResponseBody = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        setIsLoading(false);
        navigate("/?q=my-post");
      }
    } catch (error) {
      toast.error("An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={isLoading ? () => false : setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Delete Post
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this post? All of
                            your data will be permanently removed. This action
                            cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      disabled={isLoading}
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 active:bg-white border-0 ring-inset transition-all duration-300 ring-2 ring-transparent   focus:ring-pri active:text-red-600 active:ring-2 active:ring-red-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => deletePost()}
                    >
                      Delete
                      {isLoading && (
                        <svg
                          className="animate-spin relative left-5  h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-pri shadow-sm ring-1 ring-inset ring-pri hover:text-pri-hover hover:ring-pri-hover focus:ring-2 active:bg-pri active:text-white transition-all duration-300 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default DeletePost;
