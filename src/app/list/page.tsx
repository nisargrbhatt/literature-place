"use client";

import type { Literature } from "@/api/Literature";
import { getCollection } from "@/firebase/firestore/collection";
import { Typography } from "@mui/material";
import { onSnapshot, query, where } from "firebase/firestore";
import type { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {}

const ListPage: NextPage<Props> = () => {
  const [litItems, setLitItems] = useState<Literature[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const collectionRef = getCollection("literature_collection");
    const litType = searchParams.get("type");

    const unsubscribe = onSnapshot(
      query(collectionRef, where("type", "==", litType ?? "gazal")),
      (snapshot) => {
        setLitItems(
          () => snapshot.docs.map((doc) => doc.data()) as Literature[]
        );
      }
    );

    return unsubscribe;
  }, [searchParams]);

  return (
    <>
      {litItems.map((item) => (
        <Typography>{item?.title}</Typography>
      ))}
    </>
  );
};

export default ListPage;
