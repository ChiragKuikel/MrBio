/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext, Controller } from "react-hook-form";
import { Box, FormControl, FormLabel, styled } from "@mui/material";
import { FC } from "react";
import { MuiFileInput, MuiFileInputProps } from "mui-file-input";

const MuiFileInputStyled = styled(MuiFileInput)({
  ".MuiInputBase-formControl": {
    ".MuiOutlinedInput-input": {
      padding: "9px 0",
    },
  },
});

type RHFFileInputProps = MuiFileInputProps & {
  name: string;
  isImage?: boolean;
  imgSrc?: string | null;
  customLabel: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: any;
  disabled?: boolean;
};


export const RHFFileInput: FC<RHFFileInputProps> = ({
  name,
  customLabel,
  isImage,
  imgSrc,
  defaultValue,
  placeholder = "Browse File",
  required = false,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => {
        return (
          <>
            <FormControl fullWidth error={!!error}>
              <FormLabel
                sx={{ fontWeight: "bold", display: "block", mb: "6px" }}
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
              <MuiFileInputStyled
                {...field}
                disabled={rest?.disabled}
                onChange={rest?.onChange}
                value={field.value}
                aria-placeholder={`${placeholder}`}
                placeholder={`${placeholder}`}
                helperText={invalid ? `${error?.message}` : ""}
                error={!!error}
                title={(field.value as any)?.name}
              />
            </FormControl>
            {isImage && (
              <Box
                mt={"8px"}
                border={"1px dashed #a0a0a0"}
                borderRadius={"8px"}
                minHeight={"80px"}
                maxHeight={"120px"}
                overflow={"hidden"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{ backgroundColor: "#f8f8f8" }}
              >
                {imgSrc ? (
                  <img
                    src={`${imgSrc}`}
                    style={{ maxWidth: "100%", maxHeight: "120px" }}
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    No Preview Available
                  </div>
                )}
              </Box>
            )}
          </>
        );
      }}
    />
  );
};

export default RHFFileInput;
