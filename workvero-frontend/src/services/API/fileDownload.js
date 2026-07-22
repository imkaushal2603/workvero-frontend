import { useState } from "react";
import api from "../../services/api";

export default function useDownload() {
    const [downloading, setDownloading] = useState(false);

    const download = async ({ url, fileName, method = "get", params, data }) => {
        if (downloading) return;

        try {
            setDownloading(true);

            const res = await api({ url, method, params, data, responseType: "blob" });

            const blobUrl = URL.createObjectURL(res.data);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(blobUrl);
        } finally {
            setDownloading(false);
        }
    };

    return {
        downloading,
        download,
    };
}