import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  user: mongoose.Schema.Types.ObjectId;
  originalName: string;
  convertedName: string;
  type: string;
  originalPath: string;
  convertedPath: string;
  createdAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    convertedName: { type: String, required: true },
    type: { type: String, required: true },
    originalPath: { type: String, required: true },
    convertedPath: { type: String, required: true },
  },
  { timestamps: true }
);

const File = mongoose.model<IFile>("File", fileSchema);
export default File;
