/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon,
  Error as ErrorIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import {
  Box,
  FormHelperText,
  FormLabel,
  IconButton,
  Typography,
  styled,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RHFImageUploadProps {
  name: string;
  customLabel?: string;
  required?: boolean;
  maxWidth?: number | string;
  maxHeight?: number | string;
  aspectRatio?: number;
  placeholder?: string;
  onFileSelect?: (file: string) => void;
  allowPdf?: boolean;
  acceptAll?: boolean;
  pdfPlaceholder?: string;
  allFileTypesPlaceholder?: string;
  existingImage?: string;
  helperText?: string;
  fileTypeError?: string;
}

const FileContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const FileOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  opacity: 0,
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 1,
  },
});

const ErrorContainer = styled(FileContainer)(({ theme }) => ({
  borderColor: theme.palette.error.main,
  backgroundColor: theme.palette.error.light + "20",
  "&:hover": {
    backgroundColor: theme.palette.error.light + "30",
  },
}));

export const RHFImageUpload: React.FC<RHFImageUploadProps> = ({
  name,
  customLabel,
  required = false,
  maxWidth = "100%",
  maxHeight = "300px",
  aspectRatio,
  placeholder = "Click to select an image",
  pdfPlaceholder = "Click to select a PDF",
  allFileTypesPlaceholder = "Click to select any file",
  allowPdf = false,
  acceptAll = false,
  onFileSelect,
  existingImage,
  helperText,
  fileTypeError = "Invalid file type selected",
}) => {
  const { control, setValue, setError, clearErrors } = useFormContext();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf" | "other" | null>(
    null
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const detectFileType = (file: File | string): "image" | "pdf" | "other" => {
    let fileName: string;

    if (typeof file === "string") {
      // For existing images (URLs)
      fileName = file.split("/").pop() || "";
    } else {
      // For File objects
      fileName = file.name;
    }

    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

    if (imageExtensions.includes(fileExtension)) {
      return "image";
    } else if (fileExtension === "pdf") {
      return "pdf";
    } else {
      return "other";
    }
  };

  const validateFile = (
    file: File | string
  ): { isValid: boolean; error?: string } => {
    let fileName: string;
    let fileExtension: string;

    if (typeof file === "string") {
      // For existing images (URLs)
      fileName = file.split("/").pop() || "";
      fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
    } else {
      // For File objects
      fileName = file.name;
      fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
    }

    if (acceptAll) {
      return { isValid: true };
    }

    if (allowPdf) {
      const isPdf =
        fileExtension === "pdf" ||
        (typeof file === "string" && file.toLowerCase().includes(".pdf"));
      if (!isPdf) {
        return {
          isValid: false,
          error: "Only PDF files are allowed. Please select a PDF file.",
        };
      }
    } else {
      const imageExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "svg",
      ];
      const isImage = imageExtensions.includes(fileExtension);
      if (!isImage) {
        return {
          isValid: false,
          error: "Only image files are allowed. Please select an image file.",
        };
      }
    }

    return { isValid: true };
  };

  useEffect(() => {
    if (existingImage) {
      const validation = validateFile(existingImage);

      if (validation.isValid) {
        const detectedType = detectFileType(existingImage);
        setSelectedFile(existingImage);
        // Store the existing image URL in the form
        setValue(name, existingImage, { shouldValidate: true });
        setFileType(detectedType);
        setValidationError(null);
        clearErrors(name);
      } else {
        setValidationError(validation.error || "Invalid file type");
        setError(name, {
          type: "manual",
          message: validation.error || "Invalid file type",
        });
      }
    }
  }, [
    existingImage,
    allowPdf,
    acceptAll,
    name,
    setValue,
    setError,
    clearErrors,
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      // Validate using the actual File object instead of the blob URL
      const validation = validateFile(file);

      if (validation.isValid) {
        const fileUrl = URL.createObjectURL(file);
        const detectedType = detectFileType(file);

        setSelectedFile(fileUrl);
        // Store the actual File object in the form, not the blob URL
        setValue(name, file, { shouldValidate: true });
        setFileType(detectedType);
        setValidationError(null);
        clearErrors(name);

        onFileSelect?.(fileUrl);
      } else {
        setValidationError(validation.error || fileTypeError);
        setError(name, {
          type: "manual",
          message: validation.error || fileTypeError,
        });
      }
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setFileType(null);
    setValidationError(null);
    setValue(name, null, { shouldValidate: true });
    clearErrors(name);
  };

  const getFileDisplayName = (fileUrl: string): string => {
    const fileName = fileUrl.split("/").pop() || "Unknown file";
    if (fileName.length > 30) {
      const extension = fileName.split(".").pop();
      const nameWithoutExtension = fileName.substring(
        0,
        fileName.lastIndexOf(".")
      );
      return `${nameWithoutExtension.substring(0, 20)}...${extension ? `.${extension}` : ""}`;
    }
    return fileName;
  };

  const renderFileContent = () => {
    if (validationError) {
      return (
        <>
          <ErrorIcon sx={{ fontSize: 60, color: "error.main" }} />
          <Typography variant="body2" color="error.main" textAlign="center">
            {validationError}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            Click to select a{" "}
            {acceptAll ? "file" : allowPdf ? "PDF" : "valid image"} file
          </Typography>
        </>
      );
    }

    if (!selectedFile) {
      let icon = (
        <AddPhotoIcon sx={{ fontSize: 60, color: "text.secondary" }} />
      );
      let placeholderText = placeholder;

      if (acceptAll) {
        icon = <FileIcon sx={{ fontSize: 60, color: "text.secondary" }} />;
        placeholderText = allFileTypesPlaceholder;
      } else if (allowPdf) {
        icon = <DocumentIcon sx={{ fontSize: 60, color: "text.secondary" }} />;
        placeholderText = pdfPlaceholder;
      }

      return (
        <>
          {icon}
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {placeholderText}
          </Typography>
        </>
      );
    }

    if (fileType === "image") {
      return (
        <>
          <img
            src={selectedFile}
            alt="Selected"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "inherit",
            }}
          />
          <FileOverlay>
            <IconButton color="error" onClick={handleDeleteFile}>
              <DeleteIcon />
            </IconButton>
          </FileOverlay>
        </>
      );
    }

    if (fileType === "pdf") {
      return (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DocumentIcon sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="body2" textAlign="center">
              {getFileDisplayName(selectedFile)}
            </Typography>
            <Typography variant="caption" color="success.main">
              ✓ PDF file selected
            </Typography>
          </Box>
          <FileOverlay>
            <IconButton color="error" onClick={handleDeleteFile}>
              <DeleteIcon />
            </IconButton>
          </FileOverlay>
        </>
      );
    }

    return null;
  };

  const ContainerComponent = validationError ? ErrorContainer : FileContainer;

  return (
    <Controller
      name={name}
      control={control}
      // render={({ field: { value }, fieldState: { error } }) => (
      render={({ fieldState: { error } }) => (
        <>
          <FormLabel sx={{ fontWeight: "bold", display: "block", mb: "6px" }}>
            {customLabel}{" "}
            {required && <span style={{ color: "#FF1943" }}>*</span>}
          </FormLabel>

          <ContainerComponent
            onClick={() => document.getElementById(name)?.click()}
            sx={{
              maxWidth,
              maxHeight,
              aspectRatio: aspectRatio ? `${aspectRatio}` : "auto",
            }}
          >
            {renderFileContent()}
          </ContainerComponent>

          {/* Hidden file input */}
          <input
            type="file"
            id={name}
            accept={acceptAll ? "*" : allowPdf ? "application/pdf" : "image/*"}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          {/* Helper text */}
          {helperText && !error && !validationError && (
            <FormHelperText>{helperText}</FormHelperText>
          )}

          {/* Validation error */}
          {(error || validationError) && (
            <FormHelperText error>
              {error?.message || validationError}
            </FormHelperText>
          )}

          {/* File type restriction alert */}
          {acceptAll && (
            <Alert severity="success">
              <Typography variant="caption">
                📁 All file types are accepted for this field
              </Typography>
            </Alert>
          )}

          {allowPdf && !acceptAll && (
            <Alert severity="info">
              <Typography variant="caption">
                📋 Only PDF files are accepted for this field
              </Typography>
            </Alert>
          )}
        </>
      )}
    />
  );
};

export default RHFImageUpload;
