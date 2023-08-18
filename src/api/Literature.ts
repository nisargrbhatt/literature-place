import type { ArrayElement } from "@/lib/type/array";
import type { Author } from "./Author";
import type { Timestamp } from "firebase/firestore";

export const LiteratureTypes = ["gazal", "geet"] as const;

type LiteratureType = ArrayElement<typeof LiteratureTypes>;

export interface Literature {
  id: string;
  title: string;
  content: string;
  type: LiteratureType;
  author: Author;
  status: "active" | "inactive" | "pending";
  metadata: Array<{
    key: string;
    value: string;
  }>;
  meta: {
    /**
     * User's uid (whoever adds this literature)
     */
    added_by: string;
  };

  /**
   * Date.toJSON()
   */
  created_at: Timestamp;
}

export const Literature_Collection = "literature_collection" as const;
