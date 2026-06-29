import React, { createContext, useContext, useState, useMemo } from "react";

interface ModalContextType {
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

type ModalProviderProps = {
  children: React.ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const modalContextValue = useMemo(() => {
    return { openModal, closeModal };
  }, []);

  return (
    <ModalContext.Provider value={modalContextValue}>
      {children}
      {modalContent ? modalContent : ""}
    </ModalContext.Provider>
  );
};
