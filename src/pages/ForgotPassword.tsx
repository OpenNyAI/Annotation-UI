import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import zod from "zod";
import OpennyAILogo from "../assets/OpennyaiLogo.svg";
import { LabelledInput } from "../components/LabelledInput";
import useAxios from "../hooks/useAxios";
import { Styles } from "../types/styles";

const styles: Styles = {
  container: {
    height: "100vh",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "5%",
    boxSizing: "border-box",
  },
  inputLabel: { fontSize: { xs: "18px", md: "20px" } },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: {
      xs: "100%",
      md: "50%",
      lg: "45%",
    },
    gap: "28px",
  },
  link: (theme) => ({
    color: theme.palette.text.primary,
    textAlign: "center",
    fontSize: {
      xs: "14px",
      sm: "16px",
      md: "18px",
      lg: "20px",
    },
  }),
};

const ForgotPasswordSchema = zod.object({
  email: zod
    .string({ required_error: "email address can't be empty" })
    .email({ message: "invalid email address" }),
});
type ForgotPasswordFields = zod.infer<typeof ForgotPasswordSchema>;

export const ForgotPassword = () => {
  const { makeRequest, status } = useAxios();

  const {
    control,
    getValues,
    formState: { isValid, isDirty },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const { email } = getValues();

    try {
      await makeRequest("/auth/reset-password", "POST", {
        email,
      });
      toast.success("Email sent Successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={{ marginBottom: "48px" }}>
        <OpennyAILogo />
      </Box>
      <Box sx={styles.formContainer}>
        <Box>
          <Typography variant="h5" sx={{ margin: "16px", textAlign: "center" }}>
            Welcome to Annotation UI, Forgot password
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ marginY: "16px", textAlign: "center" }}
          >
            Enter your registered email and we’ll send you a link to reset
            password
          </Typography>
        </Box>
        <Controller
          name="email"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LabelledInput
              label={<Typography sx={styles.inputLabel}>Email</Typography>}
              id="email"
              placeholder="Enter your email"
              type="email"
              variant="outlined"
              size="small"
              value={value}
              error={!!error}
              helperText={error?.message}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <LoadingButton
          variant="contained"
          type="submit"
          size="small"
          loading={status === "pending"}
          onClick={handleForgotPassword}
          disabled={!isDirty || !isValid}
        >
          Send Email
        </LoadingButton>
        <Typography sx={styles.link}>
          <Link
            to="/signin"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Back to Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
