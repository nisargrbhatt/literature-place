"use client";

import { useAuthContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const addAuthorFormSchema = z.object({
  first_name: z
    .string({
      required_error: "First Name is required",
    })
    .min(1, "First Name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  pen_name: z.string().optional(),
  about: z
    .string({
      required_error: "About is required",
    })
    .min(1, "About is required"),
  born: z
    .object({
      date: z.date().optional(),
      place: z.string().optional(),
    })
    .optional(),
  died: z
    .object({
      date: z.date().optional(),
      place: z.string().optional(),
    })
    .optional(),
  occupation: z.string().optional(),
  languages: z.array(z.string()),
});

type AddAuthorFormSchema = z.infer<typeof addAuthorFormSchema>;

interface Props {}

const AddAuthorPage: NextPage<Props> = () => {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const [formLoading, setFormLoading] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<AddAuthorFormSchema>({
    resolver: zodResolver(addAuthorFormSchema),
    values: {
      first_name: "",
      middle_name: "",
      last_name: "",
      pen_name: "",
      about: "",
      languages: [],
      occupation: "",
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    setFormLoading(() => true);
    console.log(values);
    setFormLoading(() => false);
  });

  return (
    <form onSubmit={submitHandler}>
      <Box
        sx={{
          paddingY: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            paddingY: 2,
          }}
        >
          Add New Author
        </Typography>
        <Grid
          container
          columns={{ xs: 1, sm: 2 }}
          rowSpacing={3}
          columnSpacing={2}
        >
          <Grid item xs={1}>
            <Controller
              control={control}
              name="first_name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  label="First Name"
                  placeholder="First Name"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="middle_name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  label="Middle Name"
                  placeholder="Middle Name"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="last_name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  label="Last Name"
                  placeholder="Last Name"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="pen_name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  label="Pen Name"
                  placeholder="Pen Name"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Controller
              control={control}
              name="about"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  label="About"
                  placeholder="About author"
                  fullWidth
                  multiline
                  minRows={3}
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="born.date"
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Birth Date"
                  sx={{
                    width: "100%",
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="born.place"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  label="Birth Place"
                  placeholder="Birth Place"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="died.date"
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Died Date"
                  sx={{
                    width: "100%",
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="died.place"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  label="Died Place"
                  placeholder="Died Place"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="occupation"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  label="Occupation"
                  placeholder="Occupation"
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default AddAuthorPage;
