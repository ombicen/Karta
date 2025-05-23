import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

// The AxelssonModal component accepts content for the header, body, and footer.
export default function AxelssonModal({
  isOpen,
  onOpenChange,
  children,
  className,
  contentClassName = "px-10",
  ...rest
}) {
  const closeButtonStyle =
    "text-white bg-[#2337EC] border-2 border-white w-[35px] h-[35px] flex justify-center items-center [&>svg]:w-5 [&>svg]:h-5  p-0 top-4 right-4 z-40 hover:text-[#2337EC]";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      scrollBehavior="inside"
      backdrop="transparent"
      className={`bg-[#2337EC] text-white m-0 rounded-b-none rounded-t-3xl ${className} sm:mb-0`}
      classNames={{
        closeButton: closeButtonStyle,
        body: "max-h-none",
        base: "max-w-full max-h-screen",
      }}
      {...rest}
    >
      <ModalContent className={contentClassName}>
        {(onClose) => <>{children}</>}
      </ModalContent>
    </Modal>
  );
}
export const AxelssonModalBody = ({ className, children, ...rest }) => {
  return (
    <ModalBody className={"px-0 mx-0 mb-10 mt-5 " + className} {...rest}>
      {children}
    </ModalBody>
  );
};
export const AxelssonModalHeader = ({ className, children, ...rest }) => {
  return (
    <ModalHeader
      className={"flex flex-col gap-1 mt-4 px-0 " + className}
      {...rest}
    >
      {children}
    </ModalHeader>
  );
};
export const AxelssonModalFooter = ({ className, children, ...rest }) => {
  return (
    <ModalFooter
      className={
        "flex flex-col justify-start gap-0 pt-5 px-0 border-t-1 border-[#4F5EEF] " +
        className
      }
      {...rest}
    >
      {children}
    </ModalFooter>
  );
};
