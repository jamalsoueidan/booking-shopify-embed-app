import { Avatar } from "@shopify/polaris";

export default ({
  fullname,
  children,
}: {
  fullname: string;
  children?: any;
}) => {
  return (
    <>
      <Avatar customer size="large" name={fullname} />
      <p
        style={{
          whiteSpace: "nowrap",
          width: "60px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        {fullname}
      </p>
      {children}
    </>
  );
};
