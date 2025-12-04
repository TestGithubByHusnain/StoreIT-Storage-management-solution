/* eslint-disable no-unused-vars */
import type { Models } from "node-appwrite";

export type FileType = "document" | "image" | "video" | "audio" | "other";

export interface ActionType {
  label: string;
  icon: string;
  value: string;
}

export interface SearchParamProps {
  params?: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}
export interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}
export interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
export interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}
export interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

export interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

export interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
export interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

export interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

export interface FileDocument extends Models.Document {
  type: FileType;
  name: string;
  url: string | null;
  extension: string;
  size: number;
  owner: string;
  accountId: string;
  users: string | string[];
  bucketFileId: string;
}

export interface UserDocument extends Models.Document {
  email: string;
  name: string;
  avatar: string;
  accountId?: string;
}

export interface ShareInputProps {
  file: FileDocument;
  onInputChange: (emails: string[]) => void;
  onRemove: (email: string) => void;
}