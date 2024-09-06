// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PageHeading = ({ title, actionButtons }: any) => {
  return (
    <div className="py-4">
      <div className="w-full sm:px-6 lg:px-8">
        <div className="flex justify-between items-center bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-4 text-lg bg-white">{title}</div>

          <div className="p-4 space-x-2">{actionButtons}</div>
        </div>
      </div>
    </div>
  );
};
