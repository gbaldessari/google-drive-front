export type UploadedFile = {
  _id: string;
  fileDataId: string;
  name: string;
  extension: string;
  isPinned: boolean;
  lastSeen: Date;
  uploadedAt: Date;
  observations: Observation[];
}
export type FileData = {
  _id: string;
  blobName: string;
  url: string;
  size: number;
  mimeType: string;
}

export type SharedFile = {
  _id: string;
  fileId: string;
  sharedByUserId: string;
  sharedWithUsersIds: string[];
  permission: 'read' | 'coowner';
  sharedAt: Date;
}

export type Observation = {
  _id: string;
  userId: string;
  comment: string;
  createdAt: Date;
}