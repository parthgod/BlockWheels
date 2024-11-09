"use client";

import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
};

export function FileUploader({ imageUrl, onFieldChange }: FileUploaderProps) {
  return (
    <main className="flex flex-col items-center justify-between">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          onFieldChange(res[0].url);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      {imageUrl && (
        <div>
          <Image
            src={imageUrl}
            alt="Car Image"
            width={500}
            height={500}
          />
        </div>
      )}
    </main>
  );
}
