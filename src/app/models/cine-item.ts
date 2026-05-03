import { MediaType } from "../types/media-type";
import { Status } from "../types/status";

export interface CineItem {
  id: number;
  title: string;
  type: MediaType;
  status: Status;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
