/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  DialogActions,
  DialogContent,
  FormLabel,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomSwitch from "../../../shared/components/customSwitch";
import { toastMessage } from "../../../shared/components/toast/ToastMessage";
import FormProvider from "../../../shared/components/form/FormProvider";
import RHFSelect from "../../../shared/components/form/RHFSelect";
import RHFTextField from "../../../shared/components/form/RHFTextField";
import RHFFileInput from "../../../shared/components/text/RHFInputField";
import { useModal } from "../../../shared/context/ModalContext";
import useGetCategoryLists from "../../../shared/hooks/category/get/useGetCategoryList";
import usePatchProductById from "../../../shared/hooks/products/patch/usePatchProductById";
import usePostProducts from "../../../shared/hooks/products/post/usePostProducts";
import { PRODUCT_VALIDATION_SCHEMA_ALT } from "../../../shared/utils/validations/ValidationSchema";

export enum ProductTag {
  NEW_ARRIVAL = "new_arrival",
  BEST_SELLER = "best_seller",
  FEATURED = "New Feature",
  SALE = "sale",
  DISCOUNT = "discount",
}

const AddEditProducts = ({ rowData }: any) => {
  const { closeModal } = useModal();
  const [isActive, setIsActive] = useState(
    rowData?.status === "active" ? true : false
  );
  const { data: categoryList } = useGetCategoryLists();
  const { mutate: postProducts } = usePostProducts(closeModal);
  const { mutate: putProducts } = usePatchProductById(closeModal);
  const [imageFields, setImageFields] = useState<number[]>([0]);
  const [savedImagePaths, setSavedImagePaths] = useState<string[]>([]);
  const categoryDropdownData =
    categoryList?.data?.rows?.map((items: any) => ({
      name: items?.name,
      id: items?.id,
      value: items?.id,
    })) || [];
  const tagDropdownData = Object.entries(ProductTag).map(([key, value]) => ({
    name: key
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    id: value,
    value: value,
  }));

  const methods = useForm<any>({
    values: rowData || {},
    resolver: yupResolver(PRODUCT_VALIDATION_SCHEMA_ALT) as any,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  console.log(savedImagePaths)
  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;
  const watchedPrice = watch("price");
  const watchedDiscount = watch("discount");
  useEffect(() => {
    const price = parseFloat(watchedPrice) || 0;
    const discount = parseFloat(watchedDiscount) || 0;
    const calculatedFinalPrice = price - discount;
    if (calculatedFinalPrice >= 0 && (price > 0 || discount > 0)) {
      setValue("finalPrice", calculatedFinalPrice.toString());
    }
  }, [watchedPrice, watchedDiscount, setValue]);

  const addMoreImages = () => {
    const newFieldId =
      imageFields.length > 0 ? Math.max(...imageFields) + 1 : 0;
    setImageFields((prev) => [...prev, newFieldId]);
  };


  const removeImageField = (fieldId: number) => {
    if (imageFields.length > 1) {
      setImageFields((prev) => prev.filter((id) => id !== fieldId));
      setSavedImagePaths((prev) => {
        const newPaths = [...prev];
        newPaths.splice(fieldId, 1);
        return newPaths;
      });
    }
  };


  const onSubmit = async (formData: any) => {
    const formDataToSend = new FormData();
    // Add basic form fields
    formDataToSend.append("name", formData?.name || "");
    formDataToSend.append("description", formData?.description || "");
    formDataToSend.append(
      "price",
      (formData?.price ? parseFloat(formData.price) : 0).toString()
    );

    // Handle categoryId - could be array or single value
    if (Array.isArray(formData?.categoryId)) {
      formData.categoryId.forEach((id: string) => {
        formDataToSend.append("categoryId", id);
      });
    } else {
      formDataToSend.append("categoryId", formData?.categoryId || "");
    }

    formDataToSend.append("isActive", isActive.toString());
    formDataToSend.append(
      "discount",
      formData?.discount ? formData.discount.toString() : "0"
    );

    const finalPrice = formData?.finalPrice
      ? parseFloat(formData.finalPrice)
      : (parseFloat(formData?.price) || 0) -
      (parseFloat(formData?.discount) || 0);
    formDataToSend.append("finalPrice", finalPrice.toString());

    formDataToSend.append(
      "stock",
      (formData?.stock ? parseInt(formData.stock, 10) : 0).toString()
    );
    formDataToSend.append("brand", formData?.brand || "");

    // Handle tags - could be array or single value
    if (Array.isArray(formData?.tags)) {
      formData.tags.forEach((tag: string) => {
        formDataToSend.append("tags", tag);
      });
    } else {
      formDataToSend.append("tags", formData?.tags || "");
    }

    formDataToSend.append("status", isActive ? "active" : "inactive");
    formDataToSend.append(
      "rating",
      (formData?.rating ? parseFloat(formData.rating) : 0).toString()
    );
    formDataToSend.append("metadata", formData?.metadata || "");

    // Handle images - collect both new files and existing image paths
    const imageFiles: File[] = [];
    const existingImagePaths: string[] = [];
    let hasLargeFile = false;

    imageFields.forEach((fieldId, _index) => {
      const imageFieldName = `images_${fieldId}`;
      const imageValue = formData[imageFieldName];
      if (imageValue) {
        // Check if it's a File object (new upload) or string (existing path)
        if (imageValue instanceof File) {
          if (imageValue.size > 1 * 1024 * 1024) { // 1MB limit
            hasLargeFile = true;
          }
          imageFiles.push(imageValue);
        } else if (
          typeof imageValue === "string" &&
          imageValue.startsWith("http")
        ) {
          // This is an existing image URL/path
          existingImagePaths.push(imageValue);
        }
      }
    });

    if (hasLargeFile) {
      toastMessage("error", "Images size is too large. Maximum size is 1MB.");
      return;
    }


    // Append new image files
    imageFiles.forEach((file, _index) => {
      formDataToSend.append(`images`, file);
    });

    // Append existing image paths as a separate field
    if (existingImagePaths.length > 0) {
      formDataToSend.append(
        "existingImages",
        JSON.stringify(existingImagePaths)
      );
    }
    // Send the FormData
    if (rowData) {
      putProducts({ id: rowData?.id, updates: formDataToSend });
    } else {
      postProducts(formDataToSend);
    }
  };

  const handleSwitchToggle = () => {
    setIsActive((prev: any) => !prev);
  };

  useEffect(() => {
    if (rowData?.images?.length > 0) {
      const baseURL = import.meta.env.VITE_IMAGE_BASE_URL;

      // Transform each image path to a full URL
      const imageFieldValues: Record<string, string> = {};
      rowData?.images.forEach((relativePath: string, index: number) => {
        const fullImageUrl = `${baseURL}${relativePath}`;
        imageFieldValues[`images_${index}`] = fullImageUrl;
      });

      // Set initial values and dynamic image fields
      methods.reset({
        ...rowData,
        ...imageFieldValues,
      });

      setImageFields(rowData.images.map((_: any, idx: any) => idx));
    }
  }, [rowData]);


  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFTextField
                customLabel="Product Title"
                name="name"
                required
                placeholder="Enter Product Title"
              />
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFSelect
                required
                customLabel="Product Category"
                name="categoryId"
                options={categoryDropdownData || []}
                placeholder="Select"
                isMultiple={true}
              />
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFTextField
                customLabel="Stock Quantity"
                name="stock"
                type="number"
                placeholder="Enter Stock Quantity"
              />
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFTextField
                customLabel="Product Price (NRs.)"
                name="price"
                type="number"
                required
                placeholder="Enter Product Price"
              />
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFTextField
                customLabel="Discount Product Price (NRs.)"
                name="discount"
                type="number"
                placeholder="Enter Discount Price"
                required
              />
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFTextField
                customLabel="Final Price (NRs.)"
                name="finalPrice"
                type="number"
                placeholder="Auto-calculated (Price - Discount)"
                disabled
                required
              />
            </Grid>

            <Grid size={{ xs: 4, md: 4 }}>
              <RHFTextField
                customLabel="Brand"
                name="brand"
                placeholder="Enter Brand Name"
              />
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFTextField
                customLabel="Rating"
                name="rating"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                placeholder="Enter Product Rating (0-5)"
              />
            </Grid>
            <Grid size={{ xs: 4, md: 4 }}>
              <RHFSelect
                customLabel="Tags"
                name="tags"
                options={tagDropdownData}
                placeholder="Select Tags"
                isMultiple={true}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <RHFTextField
                customLabel="Product Description"
                name="description"
                required
                multiline
                rows={6}
                placeholder="Enter Product Description"
              />
            </Grid>

            {/* Dynamic Image Upload Fields */}
            <Grid size={{ xs: 12, md: 12 }}>
              <FormLabel
                sx={{ fontWeight: "bold", display: "block", mb: "16px" }}
              >
                Product Images
              </FormLabel>

              {imageFields?.map((fieldId, index) => (
                <Grid container spacing={1.5} key={fieldId} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <RHFFileInput
                      customLabel={`Image ${index + 1}`}
                      isImage={true}
                      name={`images_${fieldId}`}
                      placeholder={`Click to add image ${index + 1} (Image Size: 1920 x 750 px)`}
                      maxWidth="100%"
                      maxHeight="300px"
                      aspectRatio={1920 / 750}
                      required={index === 0} // Only first image is required
                      existingImage={methods.getValues(`images_${fieldId}`)}
                    />
                  </Grid>
                  <Grid size={{ xs: 2, md: 2 }}>
                    {imageFields.length > 1 && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => removeImageField(fieldId)}
                        sx={{ mt: 4 }}
                      >
                        Remove
                      </Button>
                    )}
                  </Grid>
                </Grid>
              ))}

              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={addMoreImages}
                sx={{ mt: 1 }}
              >
                + Add More Image
              </Button>
            </Grid>

            <Grid size={{ xs: 6, md: 6, sm: 6 }}>
              <FormLabel
                sx={{ fontWeight: "bold", display: "block", mb: "6px" }}
              >
                Status
              </FormLabel>
              <CustomSwitch
                isStatusActive={isActive}
                switchFn={handleSwitchToggle}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            size="small"
            onClick={closeModal}
          // disabled={postLoading}
          >
            Cancel
          </Button>
          <Button
            variant={!isSubmitting ? "contained" : "outlined"}
            size="small"
            type="submit"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: "#2E7D32", // Custom green color
              "&:hover": {
                backgroundColor: "#2E7D32", // Custom green color for hover
              },
            }}
          // loading={postLoading}
          >
            Save
          </Button>
        </DialogActions>
      </FormProvider>
    </>
  );
};

export default AddEditProducts;
