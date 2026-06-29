/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormProvider as Form } from "react-hook-form";
import type { ReactNode } from "react";
interface FormProviderProps {
  children?: ReactNode;
  methods: any;
  onSubmit?: () => object;
}

export default function FormProvider({
  children,
  onSubmit,
  methods,
}: FormProviderProps) {
  return (
    <Form {...methods} resolver>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
