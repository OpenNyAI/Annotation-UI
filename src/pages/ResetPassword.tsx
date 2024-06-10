import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import zod from "zod";
import OpennyAILogo from "../assets/OpennyaiLogo.svg";
import { LabelledInput } from "../components/LabelledInput";
import useAxios from "../hooks/useAxios";
import { Styles } from "../types/styles";
import { PasswordSchema } from "./SignUp";

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
};

const ResetPasswordSchema = zod
  .object({
    reset_id: zod.string().min(1, { message: "Reset id can't be empty" }),
    verification_code: zod
      .string()
      .min(1, { message: "Verification code can't be empty" }),
    password: PasswordSchema,
    confirm_password: zod.string(),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "passwords didn't match",
        path: ["confirm_password"],
      });
    }
  });

type ResetPasswordFields = zod.infer<typeof ResetPasswordSchema>;

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { makeRequest, status } = useAxios();
  const [searchParams] = useSearchParams();

  const {
    control,
    getValues,
    formState: { isValid, isDirty },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
      reset_id: searchParams.get("reset_id") ?? "",
      verification_code: searchParams.get("verification_code") ?? "",
    },
    mode: "onChange",
  });

  const handleResetPassword = async () => {
    const { password, reset_id, verification_code } = getValues();

    try {
      await makeRequest("/auth/update-password", "POST", {
        reset_id,
        password,
        verification_code,
      });
      toast.success("Password updated successfully");
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
            Welcome to Annotation UI, Reset password
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ marginY: "16px", textAlign: "center" }}
          >
            Update your password
          </Typography>
        </Box>
        <Controller
          name="reset_id"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LabelledInput
              label={<Typography sx={styles.inputLabel}>Reset ID</Typography>}
              id="reset_id"
              placeholder="Enter Reset ID"
              type="text"
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
        <Controller
          name="verification_code"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LabelledInput
              label={
                <Typography sx={styles.inputLabel}>
                  Verification Code
                </Typography>
              }
              id="verification_code"
              placeholder="Enter Verification code"
              type="text"
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
        <Controller
          name="password"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LabelledInput
              label={<Typography sx={styles.inputLabel}>Password</Typography>}
              id="password"
              placeholder="Enter new password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              size="small"
              value={value}
              error={!!error}
              helperText={error?.message}
              onChange={onChange}
              onBlur={onBlur}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      data-testid="password-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="confirm_password"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LabelledInput
              label={
                <Typography sx={styles.inputLabel}>Confirm Password</Typography>
              }
              id="confirm_password"
              placeholder="Confirm new password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              size="small"
              sx={styles.textField}
              value={value}
              error={!!error}
              helperText={error?.message}
              onChange={onChange}
              onBlur={onBlur}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      data-testid="confirm-password-visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <LoadingButton
          variant="contained"
          type="submit"
          size="small"
          loading={status === "pending"}
          onClick={handleResetPassword}
          disabled={!isDirty || !isValid}
        >
          Reset
        </LoadingButton>
      </Box>
    </Box>
  );
};
