"use client";

import { useState } from "react";

type PreviewImageProps = {
    onFileChange: (file: File) => void; // 👈 recebendo a prop
};

export function PreviewImage({ onFileChange }: PreviewImageProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(file);
        if (file && file.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(file));
            onFileChange(file); // 👈 enviando o arquivo para o componente pai
        }
    };

    return (
        <div>
            {preview && (
                <div className="mb-4">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded border"
                    />
                </div>
            )}
            <label
                htmlFor="File"
                className="block rounded border w-fit cursor-pointer border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6"
            >
                <div className="flex items-center justify-center gap-4 w-fit">
                    <span className="font-medium">Foto do Produto</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                        />
                    </svg>
                </div>
                <input
                    type="file"
                    id="File"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
}
