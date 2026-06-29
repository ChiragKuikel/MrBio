import { createContext, useContext, useState } from 'react';
import type { ReactNode } from "react";

interface ActionMenuContextProps {
  openPopover: (buttonId: string) => void;
  closePopover: (buttonId: string) => void;
  isOpen: (buttonId: string) => boolean;
}

const ActionMenuContext = createContext<ActionMenuContextProps | undefined>(undefined);

export const useActionMenuContext = () => {
  const context = useContext(ActionMenuContext);
  if (!context) {
    throw new Error('useActionMenuContext must be used within an ActionMenuProvider');
  }
  return context;
};

interface ActionMenuProviderProps {
  children: ReactNode;
}

export const ActionMenuProvider: React.FC<ActionMenuProviderProps> = ({ children }) => {
  const [openPopovers, setOpenPopovers] = useState<string[]>([]);

  const openPopover = (buttonId: string) => {
    setOpenPopovers((prev) => [...prev, buttonId]);
  };

  const closePopover = (buttonId: string) => {
    setOpenPopovers((prev) => prev.filter((id) => id !== buttonId));
  };

  const isOpen = (buttonId: string) => {
    return openPopovers.includes(buttonId);
  };

  const contextValue: ActionMenuContextProps = {
    openPopover,
    closePopover,
    isOpen,
  };

  return (
    <ActionMenuContext.Provider value={contextValue}>{children}</ActionMenuContext.Provider>
  );
};
