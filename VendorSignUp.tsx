import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { registerVendor } from "../../api/vendorRequests";
import { TransitionsModal } from "../../components/reusables/PopUpModal";
import AddressData from "../../components/vendor/AddressData";
import Documents from "../../components/vendor/Documents";
import VendorData from "../../components/vendor/VendorData";
import { StepConfig, UserData } from "../../types/Vendor";

// Step configurations
const stepsConfig: StepConfig[] = [
    {
        id: 1,
        title: "Personal Info",
        component: VendorData,
    },
    {
        id: 2,
        title: "Required Documents",
        component: Documents,
    },
    {
        id: 3,
        title: "Address",
        component: AddressData,
    },
];

const VendorSignUp = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [activeComponent, setActiveComponent] = useState(
        stepsConfig[currentStep]
    );
    const [userData, setUserData] = useState<UserData>({
        user: {
            email: "",
            full_name: "",
            password1: "",
            password2: "",
            phone: "",
        },
        documents: {
            idFront: "",
            idBack: "",
            taxCard: "",
            commercialRecord: "",
            bankStatement: "",
        },
        address: {
            country: "",
            state: "",
            city: "",
            postal_code: "",
            address1: "",
            address2: "",
        },
    });
    const [userDataSubmit, setUserDataSubmit] = useState<UserData>({
        user: {
            email: "",
            full_name: "",
            password1: "",
            password2: "",
            phone: "",
        },
        documents: {
            idFront: "",
            idBack: "",
            taxCard: "",
            commercialRecord: "",
            bankStatement: "",
        },
        address: {
            country: "",
            state: "",
            city: "",
            postal_code: "",
            address1: "",
            address2: "",
        },
    });

    useEffect(() => {
        setActiveComponent(() => stepsConfig[currentStep]);
    }, [currentStep]);

    useEffect(() => {
        setUserDataSubmit(userData);
    }, [userData]);

    const NextStep = async (updatedUserData?: UserData) => {
        if (updatedUserData) {
            setUserData((prev) => ({ ...prev, ...updatedUserData }));
        }

        if (currentStep < stepsConfig.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setIsLoading(true);
            try {
                await registerVendor(userDataSubmit);
                enqueueSnackbar(t("Account Created successfully"), {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                setOpen(true);
            } catch (error) {
                console.error("Error during registration:", error);

                const userErrors = error.response?.data?.user_errors || {};
                Object.values(userErrors).forEach((errorMessages: string[]) => {
                    errorMessages.forEach((errorMessage) => {
                        enqueueSnackbar(errorMessage, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right",
                            },
                        });
                    });
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const PreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const StepComponent = activeComponent.component;

    return (
        <div className="mt-16">
            <StepComponent
                /* @ts-ignore */
                onNext={NextStep}
                onPrev={PreviousStep}
                userData={userData}
                setUserData={setUserData}
                isLoading={isLoading}
            />
            <TransitionsModal
                dialogueText={t("accountUnderReview")}
                open={open}
                setOpen={setOpen}
            />
        </div>
    );
};

export default VendorSignUp;
