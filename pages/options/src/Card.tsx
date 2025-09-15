interface IProps {
  title: string;
  children: React.ReactNode;
}

export function Card(props: IProps) {
  const { title, children } = props;

  return (
    <div className="mb-[32px]">
      <h2 className="text-[20px] font-[500] text-[#1D2129] dark:text-gray-200 mb-[12px]">{title}</h2>
      <div className="bg-white dark:bg-black rounded-[16px] p-[24px]">{children}</div>
    </div>
  );
}
