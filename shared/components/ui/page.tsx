export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-6 p-5">{children}</div>;
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
  return <div className="space-y-3 px-5 py-1 my-2">{children}</div>;
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
