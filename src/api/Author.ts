import type { Timestamp } from "firebase/firestore";

export interface Author {
  id: string;
  name: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
  /**
   * Author's Alias
   */
  pen_name?: string;
  image?: string;
  about: string;
  born?: {
    /**
     * Birth Date
     */
    date?: string;
    /**
     * Birth Place
     */
    place?: string;
  };
  died?: {
    date?: string;
    place?: string;
  };
  occupation?: string;
  languages?: string[];

  /**
   * Date.toJSON()
   */
  created_at: Timestamp;
}

export const Author_Collection = "author_collection" as const;
