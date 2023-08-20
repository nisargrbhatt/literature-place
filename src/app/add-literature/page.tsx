"use client";

import type { Author } from "@/api/Author";
import type { Literature } from "@/api/Literature";
import { LiteratureTypes } from "@/api/Literature";
import { getCollection } from "@/firebase/firestore/collection";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Autocomplete,
  MenuItem,
  Grid,
  Box,
  Typography,
  Stack,
  useTheme,
  Button,
  Tooltip,
  ListItem,
  Chip,
} from "@mui/material";
import {
  Timestamp,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import type { FC } from "react";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { LoadingButton } from "@mui/lab";
import { useAuthContext } from "@/context/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

const addLiteratureSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title is required"),
  content: z
    .string({
      required_error: "Content is required",
    })
    .min(1, "Content is required"),
  type: z.enum(LiteratureTypes, {
    required_error: "Type is required",
  }),
  author_id: z
    .string({
      required_error: "Author is required",
    })
    .min(1, "Author is required"),
  metadata: z.array(
    z.object({
      key: z
        .string({ required_error: "Key Name is required" })
        .min(1, "Key Name is required"),
      value: z
        .string({ required_error: "Value is required" })
        .min(1, "Value is required"),
    })
  ),
});

type AddLiteratureSchema = z.infer<typeof addLiteratureSchema>;

interface Props {}

const AddLiteraturePage: FC<Props> = () => {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const router = useRouter();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<AddLiteratureSchema>({
    resolver: zodResolver(addLiteratureSchema),
    mode: "all",
    values: {
      title: "",
      author_id: "",
      content: "",
      type: "gazal",
      metadata: [
        {
          key: "",
          value: "",
        },
      ],
    },
  });

  const { append, remove, fields } = useFieldArray({
    control: control,
    name: "metadata",
  });

  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const collectionRef = getCollection("author_collection");

    const unsubscribe = onSnapshot(
      query(collectionRef, where("status", "==", "active")),
      (snapshot) => {
        setAuthors(
          () =>
            snapshot.docs.map((author) => ({
              ...author.data(),
              id: author.id,
            })) as Author[]
        );
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      enqueueSnackbar("User authentication is required", {
        variant: "error",
        autoHideDuration: 4 * 1000,
      });
      router.push("/");
    }
  }, [user]);

  const submitHandler = handleSubmit(async (values) => {
    setFormLoading(() => true);
    const author = authors.find((author) => values.author_id === author.id);

    if (!author || !user) {
      setFormLoading(() => false);
      return;
    }

    const collectionRef = getCollection("literature_collection");

    const litData: Omit<Literature, "id"> = {
      author: author,
      content: values.content,
      created_at: Timestamp.fromDate(new Date()),
      meta: {
        added_by: user?.uid,
      },
      metadata: values.metadata,
      status: "pending",
      title: values.title,
      type: values.type,
      likes: [],
    };

    addDoc(collectionRef, litData)
      .then((addedLit) => {
        console.log(addedLit.id);
        enqueueSnackbar("Literature added successfully", {
          variant: "success",
          autoHideDuration: 2 * 1000,
        });
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFormLoading(() => false);
      });
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
          Add New Literature
        </Typography>
        <Grid
          container
          columns={{ xs: 1, sm: 2 }}
          rowSpacing={3}
          columnSpacing={2}
        >
          <Grid item xs={2}>
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  label="Title"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Type"
                  placeholder="Type of Literature"
                  select
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  fullWidth
                >
                  {LiteratureTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name="author_id"
              render={({ field, fieldState }) => (
                <Autocomplete
                  options={authors}
                  getOptionLabel={(option) =>
                    [
                      option.first_name,
                      option?.middle_name,
                      option?.last_name,
                    ].join(" ")
                  }
                  onChange={(_, val) => {
                    field.onChange(val?.id);
                  }}
                  renderOption={(props, option) => (
                    <ListItem {...props} key={option.id}>
                      {[
                        option.first_name,
                        option?.middle_name,
                        option?.last_name,
                      ].join(" ")}
                    </ListItem>
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.id}
                        label={[
                          option.first_name,
                          option?.middle_name,
                          option?.last_name,
                        ].join(" ")}
                      />
                    ))
                  }
                  disablePortal
                  renderInput={(params) => (
                    <TextField
                      {...field}
                      {...params}
                      label="Author"
                      placeholder="Author of Literature"
                      error={!!fieldState.error?.message}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Grid
              container
              columns={{ xs: 1, sm: 3 }}
              rowSpacing={2}
              columnSpacing={2}
            >
              {fields.map((field, index) => (
                <Fragment key={field.id}>
                  <Grid item xs={1}>
                    <Controller
                      control={control}
                      name={`metadata.${index}.key`}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          error={!!fieldState.error?.message}
                          helperText={fieldState.error?.message}
                          label="Key"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Controller
                      control={control}
                      name={`metadata.${index}.value`}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          error={!!fieldState.error?.message}
                          helperText={fieldState.error?.message}
                          label="Value"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      color="error"
                      onClick={() => remove(index)}
                      startIcon={<RemoveIcon />}
                      variant="outlined"
                      type="button"
                    >
                      Remove
                    </Button>
                  </Grid>
                </Fragment>
              ))}
              <Grid item xs={3}>
                <Tooltip
                  title={
                    <Stack>
                      <Typography
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        Add Other Meta information about Literature.
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        Meter: Ramal
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        Alankar: Antyanupras
                      </Typography>
                    </Stack>
                  }
                >
                  <Button
                    color="primary"
                    onClick={() => append({ key: "", value: "" })}
                    startIcon={<AddIcon />}
                    variant="outlined"
                    fullWidth
                    type="button"
                  >
                    Add Metadata
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Controller
              control={control}
              name="content"
              render={({ field, fieldState }) => (
                <Stack>
                  <ReactQuill
                    {...field}
                    theme="snow"
                    placeholder="Write something beautiful..."
                    style={
                      fieldState.error?.message
                        ? {
                            border: `1px solid ${theme.palette.error.main}`,
                          }
                        : {}
                    }
                  />
                  {fieldState.error?.message && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: (theme) => theme.palette.error.main,
                      }}
                    >
                      {fieldState.error?.message}
                    </Typography>
                  )}
                </Stack>
              )}
            />
          </Grid>
        </Grid>
        <LoadingButton
          type="submit"
          variant="contained"
          fullWidth
          loading={formLoading}
          sx={{
            marginY: 2,
          }}
        >
          Submit
        </LoadingButton>
      </Box>
    </form>
  );
};

export default AddLiteraturePage;
