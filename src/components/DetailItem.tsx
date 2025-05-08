interface DetailItemProps {
  children: React.ReactElement;
  icon?: React.ReactNode;
}

export default function DetailItem({ children, icon }: DetailItemProps) {
  return (
    <div className="mx-2 mt-2 bg-white p-4 flex flex-row items-center gap-5 shadow-md">
      {icon}
      {children}
    </div>
  );
}
