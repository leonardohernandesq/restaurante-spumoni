import { IContainer } from "@/interfaces/IContainer";

export const Container = ({
  styleRow,
  styleContainer,
  children,
}: IContainer) => {
  return (
    <div className={`${styleRow} w-full flex justify-center `}>
      <div className={`${styleContainer} max-w-7xl w-full px-3`}>
        {children}
      </div>
    </div>
  );
};
