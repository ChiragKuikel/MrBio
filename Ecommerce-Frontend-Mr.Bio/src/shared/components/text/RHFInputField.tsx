/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  Box,
  FormLabel,
  Typography,
  styled,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const ImagePreview = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  objectFit: "contain", // Changed from "cover" to "contain"
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

interface RHFFileInputProps {
  name: string;
  customLabel?: string;
  required?: boolean;
  isImage?: boolean;
  placeholder?: string;
  maxWidth?: string;
  maxHeight?: string;
  aspectRatio?: number;
  existingImage?: string;
}

const RHFFileInput = ({
  name,
  customLabel,
  required = false,
  // isImage = false,
  placeholder,
  maxWidth = "50%",
  maxHeight = "200px",
  aspectRatio,
}: RHFFileInputProps) => {
  const { control } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === "string") {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  return (
    <Box>
      {customLabel && (
        <FormLabel required={required} sx={{ fontWeight: 600 }}>
          {customLabel}
        </FormLabel>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          mt: 1,
        }}
      >
        <label htmlFor={name}>
          <input
            accept="image/*"
            id={name}
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange(file);
              }
            }}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            sx={{
              border: "1px dashed #aaa",
              p: 2,
              width: maxWidth,
              height: maxHeight,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <PhotoCamera fontSize="large" />
            <Typography variant="body2" color="text.secondary">
              {placeholder || "Click to upload"}
            </Typography>
          </IconButton>
        </label>
        {preview && (
          <Box
            sx={{
              width: maxWidth,
              height: maxHeight,
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <ImagePreview
              src={preview}
              alt="preview"
              style={{
                aspectRatio: aspectRatio ? `${aspectRatio}` : "auto",
              }}
            />
          </Box>
        )}
        {error?.message && (
          <Typography variant="caption" color="error">
            {error.message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RHFFileInput;