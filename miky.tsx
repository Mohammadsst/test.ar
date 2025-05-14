import { Button } from "@headlessui/react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export default function Miky() {
  const schema = z.object({
    productName: z.string().min(50, { message: "min is 50 " }),
  });

  const formik = useFormik({
    initialValues: {
      productName: "",
    },
    validationSchema: toFormikValidationSchema(schema),
    onSubmit: (values) => {
      console.log("submitted", values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="productName">productName</FormLabel>
          <TextField
            required
            fullWidth
            id="productName"
            placeholder="Product Name"
            name="productName"
            autoComplete="productName"
            variant="outlined"
            value={formik.values.productName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.productName && Boolean(formik.errors.productName)
            }
            helperText={formik.touched.productName && formik.errors.productName}
            color={formik.errors.productName ? "error" : "primary"}
          />
        </FormControl>
        <Button type="submit">submit</Button>
      </form>
    </>
  );
}
