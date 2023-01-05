import { useEffect, useState } from "react";
import { useSettings } from "./hooks/useSetting";
import { useStaff } from "./hooks/useStaff";

interface BootupProps extends FieldProps {
  children: any;
}

export const Bootup = ({ fields, children }: BootupProps) => {
  const [submit, setSubmit] = useState<HTMLButtonElement>();
  const { data: staff } = useStaff();
  const { data: settings } = useSettings();

  // on first render, assign submit
  useEffect(() => {
    const submit = document.querySelector<HTMLButtonElement>(
      "button[type=submit]"
    );
    if (submit && staff && staff.length > 0) {
      setSubmit(submit);
      submit.disabled = true;
    }
  }, [staff]);

  useEffect(() => {
    if (!submit) return;

    if (fields.staff.value && fields.hour.value && fields.schedule.value) {
      submit.disabled = false;
    } else {
      submit.disabled = true;
    }
  }, [submit, fields]);

  if (staff && staff.length > 0 && settings?.status) {
    return children;
  }

  return <></>;
};
