import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup
} from "@mui/material";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RHFSingleRadioProps {
  radiolabel: string;
  name: string;
}

interface RHFRadioGroupProps {
  customlabel: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  options: { value: string | boolean; label: string }[];
}

export const RHFSingleRadio: FC<RHFSingleRadioProps> = ({ name, ...other }) => {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      label={other?.radiolabel}
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Radio {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
};
export const RHFRadioGroup: FC<RHFRadioGroupProps> = ({
  name,
  options,
  required = false,
  disabled = false,
  customlabel,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <FormLabel sx={{ fontWeight: "bold", mb: "6px" }}>
            {customlabel}{" "}
            {required ? <span style={{ color: "#FF1943" }}>*</span> : ""}
          </FormLabel>
          <RadioGroup
            {...field} // Spread field props here
            row
            value={field.value} // Bind field value
            onChange={(event) => {
              field.onChange(event.target.value === "true" ? true : event.target.value === "false" ? false : event.target.value);
            }}
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap", // Prevents wrapping
              gap: 2,
            }}
          >
            {options.map((option) => (
              <FormControlLabel
                key={String(option?.value)} // Use `value` as the key
                value={option.value} // Use `value` for the form submission
                control={<Radio disabled={disabled} sx={{
                      background: disabled ? "transparent" : "initial",
                      opacity: disabled ? 0.5 : 1,
                      pointerEvents: disabled ? "none" : "initial",
                    }} />}
                label={option.label}
                sx={{ whiteSpace: "nowrap" }} // Ensures labels stay inline
              />
            ))}
          </RadioGroup>
          {error && (
            <FormHelperText sx={{ color: "#FF1943" }}>
              {error?.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
