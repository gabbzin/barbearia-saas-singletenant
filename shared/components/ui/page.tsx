export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="">{children}</div>;
};

export const PageSectionTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={`font-semibold text-foreground text-sm uppercase ${className || ""}`}
    >
      {children}
    </h2>
  );
};

export const PageSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-2 w-full space-y-3 px-5 py-1 lg:mx-auto lg:max-w-[75%]">
      {children}
    </div>
  );
};

export const PageSectionScroller = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full gap-4 overflow-x-auto lg:mx-auto lg:max-w-[75%] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
};
