import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { Grid as Grid } from '@mui/material';

import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RHFCheckboxProps {
  checkboxlabel: string;
  name: string;
}

interface RHFMultiCheckboxProps {
  customlabel: string;
  name: string;
  required?: boolean;
  options: string[];
}

export const RHFCheckbox: FC<RHFCheckboxProps> = ({ name, ...other }) => {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      label={other?.checkboxlabel}
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
};

export const RHFMultiCheckbox: FC<RHFMultiCheckboxProps> = ({
  name,
  options,
  required = false,
  customlabel,
}) => {
  const { control } = useFormContext();
  const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCheckboxChange = (option: string, field: any) => {
    const updatedCheckedOptions = checkedOptions.includes(option)
      ? checkedOptions.filter((value) => value !== option)
      : [...checkedOptions, option];

    setCheckedOptions(updatedCheckedOptions);

    field.onChange(updatedCheckedOptions);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <>
            <FormLabel sx={{ fontWeight: "bold", display: "block", mb: "6px" }}>
              {customlabel}{" "}
              {required ? <span style={{ color: "#FF1943" }}>*</span> : ""}
            </FormLabel>
            <FormGroup>
              <Grid container>
                {options?.map((option) => {
                  return (
                     <Grid key={option}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkedOptions.includes(option) || field.value?.includes(option)}
                            onChange={() => {
                              handleCheckboxChange(option, field);
                            }}
                          />
                        }
                        label={option}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </FormGroup>
          </>
        );
      }}
    />
  );
};
