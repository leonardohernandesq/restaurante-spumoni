import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const LoadingIcon = ({
  size = 25,
  color = "text-white",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <AiOutlineLoading3Quarters
      className={`animate-spin ${color}`}
      size={size}
    />
  );
};
