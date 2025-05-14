// Material-UI Components
import { Box, FormControl, FormLabel, Input } from "@mui/material";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";

// Local imports
import { Card, SignUpContainer } from "../reusables/CustomMUIComponents";

// Localization
import { t } from "i18next";

// Formik and Zod imports
import imageCompression from "browser-image-compression";
import { ErrorMessage, Form, Formik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { StepComponentProps, UserData } from "../../types/Vendor";

// Validation schema using Zod
const documentSchema = z.object({
    idFront: z
        .any()
        .refine((file) => file instanceof File, { message: t("idFront") }),
    idBack: z
        .any()
        .refine((file) => file instanceof File, { message: t("idBack") }),
    taxCard: z
        .any()
        .refine((file) => file instanceof File, { message: t("taxCard") }),
    commercialRecord: z.any().refine((file) => file instanceof File, {
        message: t("commercialRecord"),
    }),
    bankStatement: z.any().refine((file) => file instanceof File, {
        message: t("bankStatement"),
    }),
});

const compressFile = async (file: File) => {
    try {
        const options = {
            maxSizeMB: 1, // Max file size in MB
            maxWidthOrHeight: 1920, // Resize to fit within this size
            useWebWorker: true, // Enable web worker for faster compression
        };
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error("Error compressing file:", error);
        return file; // Return original file if compression fails
    }
};

// Form submission handler
const handleSubmit = async (
    values: { [key: string]: File | null },
    setUserData: (data: UserData) => void
) => {
    const compressedValues: { [key: string]: File | null } = {};

    // Compress each file in the form values
    for (const [key, value] of Object.entries(values)) {
        if (value instanceof File) {
            compressedValues[key] = await compressFile(value);
        } else {
            compressedValues[key] = value;
        }
    }

    console.log("Compressed Files:", compressedValues);
    /* @ts-ignore */
    setUserData((prevState: UserData) => ({
        ...prevState,
        documents: { ...compressedValues },
    }));
};

const Documents: React.FC<StepComponentProps> = ({
    onNext,
    onPrev,
    setUserData,
}) => {
    return (
        <div className="w-2/5 mx-auto mt-32 rounded shadow max-tablet:w-full">
            <Formik
                initialValues={{
                    idFront: null,
                    idBack: null,
                    taxCard: null,
                    commercialRecord: null,
                    bankStatement: null,
                }}
                validationSchema={toFormikValidationSchema(documentSchema)}
                onSubmit={(values) => {
                    handleSubmit(values, setUserData);
                    onNext();
                }}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <CssBaseline enableColorScheme />
                        <SignUpContainer
                            direction="column"
                            justifyContent="space-between"
                        >
                            <Card variant="outlined">
                                <Typography
                                    component="h1"
                                    variant="h4"
                                    sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        width: "100%",
                                        fontSize: "clamp(2rem, 10vw, 2.15rem)",
                                    }}
                                >
                                    {t("documents")}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                        marginBottom: "20px",
                                    }}
                                >
                                    {/* ID Front */}
                                    <FormControl>
                                        <FormLabel htmlFor="idFront">
                                            {t("idFront")}
                                        </FormLabel>
                                        <Input
                                            id="idFront"
                                            name="idFront"
                                            type="file"
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "idFront",
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).files?.[0] || null
                                                )
                                            }
                                        />
                                        <ErrorMessage
                                            name="idFront"
                                            component="div"
                                            render={(msg) => (
                                                <div style={{ color: "red" }}>
                                                    {msg}
                                                </div>
                                            )}
                                        />
                                    </FormControl>

                                    {/* ID Back */}
                                    <FormControl>
                                        <FormLabel htmlFor="idBack">
                                            {t("idBack")}
                                        </FormLabel>
                                        <Input
                                            id="idBack"
                                            name="idBack"
                                            type="file"
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "idBack",
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).files?.[0] || null
                                                )
                                            }
                                        />
                                        <ErrorMessage
                                            name="idBack"
                                            component="div"
                                            render={(msg) => (
                                                <div style={{ color: "red" }}>
                                                    {msg}
                                                </div>
                                            )}
                                        />
                                    </FormControl>

                                    {/* Tax Card */}
                                    <FormControl>
                                        <FormLabel htmlFor="taxCard">
                                            {t("taxCard")}
                                        </FormLabel>
                                        <Input
                                            id="taxCard"
                                            name="taxCard"
                                            type="file"
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "taxCard",
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).files?.[0] || null
                                                )
                                            }
                                        />
                                        <ErrorMessage
                                            name="taxCard"
                                            component="div"
                                            render={(msg) => (
                                                <div style={{ color: "red" }}>
                                                    {msg}
                                                </div>
                                            )}
                                            // style={{ color: "red" }}
                                        />
                                    </FormControl>

                                    {/* Commercial Record */}
                                    <FormControl>
                                        <FormLabel htmlFor="commercialRecord">
                                            {t("commercialRecord")}
                                        </FormLabel>
                                        <Input
                                            id="commercialRecord"
                                            name="commercialRecord"
                                            type="file"
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "commercialRecord",
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).files?.[0] || null
                                                )
                                            }
                                        />
                                        <ErrorMessage
                                            name="commercialRecord"
                                            component="div"
                                            // style={{ color: "red" }}
                                            render={(msg) => (
                                                <div style={{ color: "red" }}>
                                                    {msg}
                                                </div>
                                            )}
                                        />
                                    </FormControl>

                                    {/* Bank Statement */}
                                    <FormControl>
                                        <FormLabel htmlFor="bankStatement">
                                            {t("bankStatement")}
                                        </FormLabel>
                                        <Input
                                            id="bankStatement"
                                            name="bankStatement"
                                            type="file"
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "bankStatement",
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).files?.[0] || null
                                                )
                                            }
                                        />
                                        <ErrorMessage
                                            name="bankStatement"
                                            component="div"
                                            // style={{ color: "red" }}
                                            // TODO
                                            render={(msg) => (
                                                <div style={{ color: "red" }}>
                                                    {msg}
                                                </div>
                                            )}
                                        />
                                    </FormControl>
                                </Box>

                                <div className="flex justify-between">
                                    <Button
                                        variant="contained"
                                        sx={{
                                            background: "black",
                                            borderRadius: "7px",
                                            marginTop: "10px",
                                            width: "20%",
                                        }}
                                        onClick={onPrev}
                                    >
                                        {t("previous")}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            background: "black",
                                            borderRadius: "7px",
                                            marginTop: "10px",
                                            width: "20%",
                                        }}
                                        type="submit"
                                    >
                                        {t("next")}
                                    </Button>
                                </div>
                            </Card>
                        </SignUpContainer>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Documents;
