export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="">{children}</div>;
};

export const PageSectionTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <h2 className="font-semibold text-foreground text-sm uppercase">
      {children}
    </h2>
  );
};

export const PageSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-2 w-full space-y-3 px-5 py-1 lg:mx-auto lg:max-w-[70%]">
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
    <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
};
