// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PageHeading = ({ title, actionButtons }: any) => {
  return (
    <div className="mb-2 d-flex justify-content-between align-items-center">
      <div>
        <h1 className="display-6">{title}</h1>
      </div>
      <div>{actionButtons}</div>
    </div>
  );
};
