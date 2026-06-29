/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import Loader from "./Loader";

const Loadable = (Component: any) => (props: any) => {
  return (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
};

export default Loadable;
