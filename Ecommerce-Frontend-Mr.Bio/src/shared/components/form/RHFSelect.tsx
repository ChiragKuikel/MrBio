/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import type { FC } from "react";

import { Controller, useFormContext } from "react-hook-form";

interface RHFSelectProps {
  name: string;
  customLabel: string;
  options: any;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  isMultiple?: boolean;
  loading?: boolean;
  dropDownLabel?: string;
  width?: string;
  sx?: any;
}

export const RHFSelect: FC<RHFSelectProps> = ({
  name,
  options,
  customLabel,
  placeholder,
  defaultValue,
  isMultiple = false,
  required = false,
  dropDownLabel,
  width,
  loading = false,
  sx,
  ...rest
}) => {
  const { control } = useFormContext();

  // Calculate width based on dropDownLabel presence
  const calculateWidth = () => {
    if (width) return width;
    if (dropDownLabel) return "300px"; // Increased width when dropDownLabel is present
    return "100%";
  };

  const shouldUseFullWidth = () => {
    if (width) return false;
    if (dropDownLabel) return false; // Don't use fullWidth when dropDownLabel is present
    return true;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl
            error={!!error}
            fullWidth={shouldUseFullWidth()}
            sx={{ 
              width: calculateWidth(),
              minWidth: dropDownLabel ? "250px" : "auto", // Ensure minimum width with dropDownLabel
              ...sx 
            }}
            size="small"
          >
            <FormLabel
              sx={{
                fontWeight: "bold",
                display: "block",
                mb: "6px",
                color: "rgba(34, 51, 84, 0.7) !important",
              }}
              id={`rhfSelect-${name}-label`}
            >
              {customLabel}{" "}
              {required ? (
                <Box component={"span"} color="#FF1943">
                  *
                </Box>
              ) : (
                ""
              )}
            </FormLabel>
            {!isMultiple ? (
              <>
                {dropDownLabel && (
                  <InputLabel id="demo-simple-select-helper-label">
                    {dropDownLabel}
                  </InputLabel>
                )}
                <Select
                  {...field}
                  labelId={`rhfSelect-${name}-label`}
                  id={`rhfSelect-${name}`}
                  defaultValue={defaultValue}
                  onChange={(e) => {
                    field?.onChange(e?.target?.value);
                  }}
                  error={!!error}
                  value={field?.value || ""}
                  disabled={rest?.disabled || loading}
                  label={dropDownLabel} // Add label prop for proper spacing
                >
                  {loading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      p={2}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : options?.length > 0 ? (
                    options?.map((item: any, index: number) => (
                      <MenuItem
                        value={item?.id}
                        key={index}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {item?.name}
                      </MenuItem>
                    ))
                  ) : (
                    <Box textAlign={"center"}>No record available.</Box>
                  )}
                </Select>
              </>
            ) : (
              <Select
                {...field}
                labelId={`rhfSelect-${name}-label`}
                id={`rhfSelect-${name}`}
                multiple
                value={field?.value || []}
                onChange={(e) => {
                  const values = e.target.value;
                  field.onChange(
                    typeof values === "string" ? values.split(",") : values
                  );
                }}
                error={!!error}
                disabled={loading}
                label={dropDownLabel} // Add label prop for multiple select too
                renderValue={(selected) => {
                  if (!selected || selected.length === 0) {
                    return <em>{placeholder || "Select options"}</em>;
                  }
                  return selected
                    ?.map(
                      (value: any) =>
                        options?.find((item: any) => item?.id === value)?.name
                    )
                    ?.join(", ");
                }}
              >
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : options?.length > 0 ? (
                  options?.map((item: any, index: number) => (
                    <MenuItem key={index} value={item?.id}>
                      <Checkbox checked={field?.value?.includes(item?.id)} />
                      <ListItemText primary={item?.name} />
                    </MenuItem>
                  ))
                ) : (
                  <Box textAlign={"center"}>No record available.</Box>
                )}
              </Select>
            )}
            <FormHelperText>{error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default RHFSelect;