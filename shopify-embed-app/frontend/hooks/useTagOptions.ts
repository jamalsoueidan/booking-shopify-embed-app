import { useTranslation } from "@hooks";
import { useCallback, useMemo } from "react";

interface UseTagOptionsReturn {
  options: UseTagOptions[];
  select: (value: string) => string;
}

interface UseTagOptions {
  label: string;
  value: string;
}

export const useTagOptions = (): UseTagOptionsReturn => {
  const { t } = useTranslation("tags");

  const options: UseTagOptions[] = useMemo(
    () => [
      { label: t("everyday"), value: "#4b6043" },
      { label: t("weekend"), value: "#235284" },
      { label: t("all"), value: "#d24e01" },
      { label: t("end"), value: "#2980B9" },
      { label: t("start"), value: "#8E44AD" },
      { label: t("middle"), value: "#A93226" },
    ],
    [t],
  );

  const select = useCallback(
    (value: string) => options.find((o) => o.value === value)?.label,
    [options],
  );

  return {
    options,
    select,
  };
};
