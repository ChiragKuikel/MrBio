import * as yup from "yup";

export const LOGIN_PAGE_VALIDATION = yup.object({
  username: yup.string()
    .email("Enter a valid email")
    .required("Username/Email is required"),
  password: yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
  remember: yup.boolean(),
});

export const PRODUCT_VALIDATION_SCHEMA_ALT = yup.object().shape({
  name: yup
    .string()
    .required("Product title is required")
    .min(2, "Product title must be at least 2 characters long")
    .max(255, "Product title cannot exceed 255 characters"),

  categoryId: yup
    .array()
    .of(yup.string())
    .min(1, "Please select at least one category")
    .required("Product category is required"),

  description: yup
    .string()
    .required("Product description is required")
    .min(10, "Product description must be at least 10 characters long")
    .max(5000, "Product description cannot exceed 5000 characters"),

  price: yup
    .number()
    .typeError("Price must be a valid number")
    .required("Product price is required")
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price cannot exceed 999,999.99"),

  discount: yup
    .number()
    .typeError("Discount must be a valid number")
    .required("Discount price is required")
    .min(0, "Discount cannot be negative")
    .test(
      "discount-less-than-price",
      "Discount price must be less than the product price",
      function (value) {
        const { price } = this.parent;
        if (price && value) {
          return value < price;
        }
        return true;
      }
    ),

  finalPrice: yup
    .number()
    .typeError("Final price must be a valid number")
    .required("Final price is required")
    .min(0, "Final price cannot be negative"),

  stock: yup
    .number()
    .typeError("Stock quantity must be a valid number")
    .integer("Stock quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative")
    .max(999999, "Stock quantity cannot exceed 999,999"),

  brand: yup
    .string()
    .max(100, "Brand name cannot exceed 100 characters").nullable(),

  rating: yup
    .number()
    .typeError("Rating must be a valid number")
    .min(0, "Rating cannot be less than 0")
    .max(5, "Rating cannot be more than 5"),

  tags: yup
    .array(yup.string().max(50, "Tag cannot exceed 50 characters"))
    .max(5, "You can add a maximum of 5 tags"),


  // images: yup
  //   .array()
  //   .of(yup.mixed())
  //   .min(1, "At least one product image is required")
  //   .max(5, "You can upload maximum 5 images"),

  // metadata: yup
  //   .string()
  //   .max(1000, "Metadata cannot exceed 1000 characters"),
});


export const USER_CREATE_VALIDATION = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string(),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  dob: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),

  password: yup.string().when("$isEditMode", {
    is: false, // means it's in "create" mode
    then: (schema) =>
      schema
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),

  phones: yup.array().of(
    yup.object().shape({
      value: yup.string().required("Phone number is required"),
      countryCode: yup.string().required("Country code is required"),
      countryISO: yup.string().required("Country ISO is required"),
    })
  ),

  address: yup.object().shape({
    line1: yup.string().required("Address Line 1 is required"),
    line2: yup.string(),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup.string().required("ZIP code is required"),
  }),

  roleCodes: yup
    .array()
    .of(yup.string().required("Role code is required"))
    .min(1, "At least one role code is required"),
});
