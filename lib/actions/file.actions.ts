"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";
import type { UploadFileProps, FileType, GetFilesProps, RenameFileProps, UpdateFileUsersProps, DeleteFileProps } from "@/types/index";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    // Ensure we have ownerId and accountId. If not provided, derive from current user.
    let owner = ownerId as string | undefined;
    let acc = accountId as string | undefined;

    if (!owner || !acc) {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        owner = owner || currentUser.$id;
        acc = acc || (currentUser.accountId as string | undefined);
      }
    }

    if (!acc) {
      throw new Error("Missing accountId for file document");
    }

    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner,
      accountId: acc,
      // store users as a JSON string to match collection attribute type
      users: JSON.stringify([]),
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number,
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      // `users` is stored as a JSON string in the collection, use full-text search
      Query.search("users", currentUser.email),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
    );
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const queries = createQueries(currentUser, types, searchText, sort, limit);
    let files: { total: number; documents: Models.Document[] } | undefined;

    try {
      // Try the normal query first (may use Query.search on users)
      files = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        queries,
      );
    } catch (err: unknown) {
      // If Appwrite complains about missing fulltext index for `users`,
      // fall back to client-side filtering.
      let msg = "";
      if (typeof err === "object" && err !== null && "message" in err) {
        const m = (err as Record<string, unknown>).message;
        msg = String(m);
      } else {
        msg = String(err);
      }
      if (msg.includes("fulltext index") || msg.includes("fulltext") || msg.includes("requires a fulltext index")) {
        // Fetch owned files first
        const owned = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.filesCollectionId,
          [Query.equal("owner", [currentUser.$id])],
        );

        // Fetch a larger set (limited) to find shared files — fallback when index unavailable.
        // NOTE: this may need adjustment for large datasets.
        const allCandidates = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.filesCollectionId,
          [Query.limit(limit || 1000)],
        );

        // Parse users JSON and filter documents where users include current user's email
        const sharedDocs = (allCandidates.documents || []).filter((doc: Models.Document) => {
          try {
            const docRec = doc as unknown as Models.Document & { users?: string | string[] };
            const usersRaw = docRec.users;
            const users = typeof usersRaw === "string" ? JSON.parse(usersRaw) : usersRaw;
            return Array.isArray(users) && users.includes(currentUser.email);
          } catch {
            return false;
          }
        });

        // Combine owned and shared (dedupe by $id)
        const combined = [ ...(owned.documents || []), ...sharedDocs ];
        const map = new Map();
        combined.forEach((d: Models.Document) => map.set(d.$id, d));

        files = { total: map.size, documents: Array.from(map.values()) } as { total: number; documents: Models.Document[] };
      } else {
        throw err;
      }
    }

    // Ensure `users` field is parsed to array for consumers
    if (files && Array.isArray(files.documents)) {
      files.documents = files.documents.map((doc) => {
        const cloned = { ...(doc as unknown as Models.Document) } as Models.Document & { users?: string | string[] };
        if (typeof cloned.users === "string") {
          try {
            cloned.users = JSON.parse(cloned.users as string);
          } catch {
            cloned.users = [];
          }
        }
        return cloned as Models.Document;
      });
    }

    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      },
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        // store users as JSON string to match collection attribute type
        users: JSON.stringify(emails),
      },
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

// ============================== TOTAL FILE SPACE USED
export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])],
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      const key = fileType as keyof Omit<typeof totalSpace, "used" | "all">;

      totalSpace[key].size += file.size as number;
      totalSpace.used += file.size as number;

      if (
        !totalSpace[key].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[key].latestDate)
      ) {
        totalSpace[key].latestDate = file.$updatedAt as string;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used:, ");
  }
}