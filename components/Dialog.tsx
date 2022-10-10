import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { X } from 'react-feather';
import Centered from './Containers/Centered';

type CustomDialogProps = {
  title: string;
  isOpen: boolean;
  closeDialog: () => void;
  children: React.ReactNode;
};

const CustomDialog: React.FC<CustomDialogProps> = ({ title, isOpen, closeDialog, children }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[11]" onClose={closeDialog}>
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
          <Centered className="min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md overflow-hidden text-left align-middle transition-all transform shadow-xl border-normal bg-page rounded-2xl">
                <div className="absolute p-2 cursor-pointer top-2 right-2 btn-tertiary rounded-button" onClick={closeDialog}>
                  <X />
                </div>
                <Dialog.Title as="h3" className="p-4 text-lg font-medium leading-6 border border-b border-normal">
                  {title}
                </Dialog.Title>
                <div className="p-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </Centered>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CustomDialog;
