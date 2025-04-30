import { useStatusColor } from "@/hooks/useStatusColor";

export const StatusColor = ({ status }: { status: number }) => {
    const { getColor, getLabel } = useStatusColor();
    const label = getLabel(status);
    const color = getColor(status);

    return (
        <div className={`${color} text-white py-1 px-2 rounded-md text-sm text-center`}>
            {label}
        </div>
    );
};
