type LoadingProps = {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
};

export const Loading = ({ size = "xl" }: LoadingProps) => {
    return (
        <span className={`loading loading-bars loading-${size}`}></span>
    );
};