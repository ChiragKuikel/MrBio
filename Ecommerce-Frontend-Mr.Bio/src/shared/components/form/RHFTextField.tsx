import { FormLabel, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type { FC } from "react";
import type { TextFieldProps } from "@mui/material";

interface RHFTextFieldProps extends Omit<TextFieldProps, "variant"> {
  name: string;
  required?: boolean;
  customLabel?: string;
  size?: "small" | "medium";
  multiline?: boolean;
  rows?: number;
}

export const RHFTextField: FC<RHFTextFieldProps> = ({
  name,
  customLabel,
  required = false,
  size = "small",
  multiline = false,
  rows,
  type,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <FormLabel sx={{ fontWeight: "bold", display: "block", mb: "6px", fontSize:"0.9rem" }}>
            {customLabel}{" "}
            {required ? <span style={{ color: "#FF1943" }}>*</span> : ""}
          </FormLabel>
          <TextField
            {...field}
            size={size}
            title={field?.value}
            fullWidth
            multiline={multiline}
            error={!!error}
            type={type}
            rows={rows}
            helperText={error?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 5, // Apply border radius to the outlined input
              },
            }}
            {...rest}
          />
        </>
      )}
    />
  );
};

export default RHFTextField;