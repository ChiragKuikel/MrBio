/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormLabel, SxProps } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RHFDatePickerProps {
  name: string;
  required?: boolean;
  customLabel?: string;
  disableFuture?: boolean;
  disablePast?: boolean;  // New prop
  size?: "small" | "medium";
  minDate?: any;
  disabled?: boolean;
  sx?: SxProps;
   maxDate?: any;
}

export const RHFDatePicker: FC<RHFDatePickerProps> = ({
  name,
  customLabel,
  required = false,
  size = "small",
  maxDate,
  disablePast = false,  // New prop
  ...rest
}) => {
  const { control } = useFormContext();
  dayjs.extend(utcPlugin);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <FormLabel sx={{ fontWeight: "bold", display: "block", mb: "6px" }}>
            {customLabel}{" "}
            {required ? <span style={{ color: "#FF1943" }}>*</span> : ""}
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              {...rest}
              maxDate={maxDate} 
              disablePast={disablePast}  // Add this line
              format="YYYY-MM-DD"
              value={value ? dayjs(value) : null}
              onChange={(selectedDate: any) => {
                if (selectedDate) {
                  // const utcDate = dayjs(selectedDate).utc();
                  // const localDate = utcDate.local().format();
                  onChange(dayjs(selectedDate).format("YYYY-MM-DD"));
                } else {
                  onChange(null);
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  autoComplete: "off",
                  size,
                  error: !!error,
                  helperText: error?.message,
                  ...(rest.sx && { sx: rest.sx }),
                },
              }}
            />
          </LocalizationProvider>
        </>
      )}
    />
  );
};

export default RHFDatePicker;