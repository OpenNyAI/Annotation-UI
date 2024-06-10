import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import { useState } from "react";
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
    textAlign: "right",
    fontSize: {
      xs: "14px",
      sm: "18px",
      md: "20px",
    },
  }),
};

const PasswordSchema = zod
  .string()
  .regex(/[a-z]+/, {
    message: "password should contain minimum of 1 lowercase character",
  })
  .regex(/[0-9]+/, {
    message: "password should contain minimum of 1 number",
  })
  .regex(/[A-Z]+/, {
    message: "password should contain minimum of 1 uppercase character",
  })
  .min(8, { message: "password should be minimum of 8 characters" });

const SignUpSchema = zod
  .object({
    name: zod.string().trim().min(1, { message: "name can't be empty" }),
    username: zod
      .string()
      .trim()
      .min(1, { message: "username can't be empty" }),
    email: zod
      .string({ required_error: "email address can't be empty" })
      .email({ message: "invalid email address" }),
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

type SignUpFields = zod.infer<typeof SignUpSchema>;

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { makeRequest, status } = useAxios();

  const {
    control,
    getValues,
    formState: { isValid, isDirty },
  } = useForm<SignUpFields>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      name: "",
      confirm_password: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();

  const handleSignUp = async () => {
    const { email, password, username, name } = getValues();
    const body = { name, email, password, username };
    try {
      await makeRequest("/auth/signup", "POST", body);
      navigate("/signin");
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
        <Typography variant="h5" sx={{ margin: "16px", textAlign: "center" }}>
          Welcome to Annotation UI, Please Sign up
        </Typography>
        <Controller
          name="name"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LabelledInput
              label={<Typography sx={styles.inputLabel}>Name</Typography>}
              id="name"
              placeholder="Enter your name"
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
          name="username"
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LabelledInput
              label={<Typography sx={styles.inputLabel}>Username</Typography>}
              id="username"
              placeholder="Enter your username"
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
              placeholder="Enter your password"
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
              placeholder="Confirm your password"
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
          onClick={handleSignUp}
          disabled={!isDirty || !isValid}
        >
          Sign Up
        </LoadingButton>
        <Typography sx={styles.link}>
          <Link
            to="/signin"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Already have an account? Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
