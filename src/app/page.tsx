"use client";

import { LiteratureTypes, type Literature } from "@/api/Literature";
import { getCollection } from "@/firebase/firestore/collection";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type { NextPage } from "next";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareLit from "@/components/literature/ShareLit";
import { useAuthContext } from "@/context/AuthContext";
import { loginWithGoogle } from "@/firebase/auth/login";
import { enqueueSnackbar } from "notistack";

interface Props {}

const HomePage: NextPage<Props> = () => {
  const [litItems, setLitItems] = useState<Literature[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const { user } = useAuthContext();

  useEffect(() => {
    const collectionRef = getCollection("literature_collection");

    const queries = [where("status", "==", "active")];

    const type = selectedTypes?.map((t) => t.trim());

    const search = searchText?.trim();

    if (type && type?.length > 0) {
      queries.push(where("type", "in", type));
    }

    if (search && search?.length > 0) {
      queries.push(where("title", ">=", search));
      queries.push(where("title", "<=", search + "~"));
    }

    const unsubscribe = onSnapshot(
      query(collectionRef, ...queries),
      (snapshot) => {
        setLitItems(
          () =>
            snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            })) as Literature[]
        );
      }
    );

    return unsubscribe;
  }, [selectedTypes, searchText]);

  const handleTypeChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedTypes((prev) => [...prev, event.target.name]);
    } else {
      const duplicate = [...selectedTypes];
      const index = duplicate.indexOf(event.target.name);
      if (index > -1) {
        duplicate.splice(index, 1);
        setSelectedTypes(() => duplicate);
      }
    }
  };

  const handleLike = async (id: string, likes: string[]) => {
    if (!user) {
      loginWithGoogle();
      return;
    }
    const db = getFirestore();
    const docRef = doc(db, "literature_collection", id);

    if (likes?.includes(user.uid)) {
      updateDoc(docRef, {
        likes: arrayRemove(user.uid),
      }).catch((error) => {
        console.error(error);
        enqueueSnackbar(
          "Something went wrong while removing like from this post",
          {
            variant: "error",
            autoHideDuration: 2.5 * 1000,
          }
        );
      });
    } else {
      updateDoc(docRef, {
        likes: arrayUnion(user.uid),
      }).catch((error) => {
        console.error(error);
        enqueueSnackbar("Something went wrong while adding like to this post", {
          variant: "error",
          autoHideDuration: 2.5 * 1000,
        });
      });
    }
  };

  return (
    <Box
      sx={{
        paddingY: 2,
      }}
    >
      <TextField
        name="Search"
        placeholder="Search"
        type="search"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
      />
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent={"flex-start"}
        alignItems={{
          xs: "center",
          sm: "flex-start",
        }}
        sx={{ paddingY: 2 }}
        columnGap={1}
        rowGap={2}
      >
        <Stack
          sx={{
            flex: "30%",
            width: "100%",
          }}
        >
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Type</FormLabel>
            <FormGroup>
              {LiteratureTypes.map((item) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      checked={selectedTypes?.includes(item)}
                      onChange={handleTypeChange}
                      name={item}
                    />
                  }
                  label={item.toUpperCase()}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Stack>
        <Stack
          sx={{
            flex: "70%",
            width: "100%",
          }}
        >
          <Grid
            container
            columns={{ xs: 1, sm: 2 }}
            rowSpacing={2}
            columnSpacing={2}
          >
            {litItems.map((item) => (
              <Grid item xs={1} key={item.id}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar
                        title={item?.author?.name}
                        sx={{
                          bgcolor: (theme) => theme.palette.secondary.main,
                        }}
                      >
                        {item?.author?.name?.at(0)}
                      </Avatar>
                    }
                    title={item.title}
                    subheader={item.type.toUpperCase()}
                  />
                  <CardContent>
                    <div
                      style={{
                        height: "100px",
                        overflowY: "hidden",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: item.content,
                      }}
                    ></div>
                    <Typography title={item.author.name}>
                      {[
                        "By",
                        item.author.first_name,
                        item.author.last_name,
                        item.author?.pen_name,
                      ].join(" ")}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton
                      aria-label="add a like"
                      onClick={() => handleLike(item.id, item.likes)}
                    >
                      <FavoriteIcon
                        color={
                          user && item?.likes?.includes(user.uid)
                            ? "error"
                            : "inherit"
                        }
                      />
                    </IconButton>
                    <ShareLit id={item.id} />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Box>
  );
};

export default HomePage;
