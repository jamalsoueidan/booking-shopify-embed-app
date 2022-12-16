import { useEffect, useState } from "react";
import { useStaff } from "./hooks/useStaff";

interface BootupProps extends FieldProps {
  children: any;
}

export const Bootup = ({ fields, children }: BootupProps) => {
  const [submit, setSubmit] = useState<HTMLButtonElement>();
  const { data } = useStaff();

  // on first render, assign submit
  useEffect(() => {
    const submit = document.querySelector<HTMLButtonElement>(
      "button[type=submit]"
    );
    if (submit && data && data.length > 0) {
      setSubmit(submit);
      submit.disabled = true;
    }
  }, [data]);

  useEffect(() => {
    if (!submit) return;

    if (fields.staff.value && fields.hour.value && fields.schedule.value) {
      submit.disabled = false;
    } else {
      submit.disabled = true;
    }
  }, [submit, fields]);

  if (data && data.length > 0) {
    return children;
  }

  return <></>;
};
