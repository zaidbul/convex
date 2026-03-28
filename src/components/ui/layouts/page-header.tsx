export const PageHeader = (props: { children?: React.ReactNode }) => {
  return (
    <div className="flex h-12 max-h-12 min-h-12 items-center bg-surface-low px-6">
      {props.children}
    </div>
  );
};
