import { api } from "@/client";
import { createScinDNClient } from "@/scindn/client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const scindn = createScinDNClient({
  clientId: process.env.NEXT_PUBLIC_SCINDN_CLIENT_ID!,
  scindnDomain: process.env.NEXT_PUBLIC_SCINDN_DOMAIN!,
});

function MyDropzone() {
  const [files, setFiles] = useState([] as File[]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles([...files, ...acceptedFiles]),
  });

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>

      {files.length > 0 && (
        <button
          onClick={async () => {
            const uploaded = await scindn.upload(await api.generatePresigned.query(), files);
            const metadata = await api.updateProfilePic.mutate({ encrypted: uploaded });
            console.log(metadata);

            setFiles([]);
          }}
        >
          Upload {files.length} Files
        </button>
      )}
    </>
  );
}

export default function Home() {
  return (
    <>
      <MyDropzone />
    </>
  );
}
