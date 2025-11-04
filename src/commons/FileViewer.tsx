import React from "react";
import "./fileViewer.css";
import { MdDownload } from "react-icons/md";
import type { UploadedFile, FileData } from "../services/files/types/GetFiles.type";

type Props = {
  open: boolean;
  selected: UploadedFile | null;
  fileData: FileData | null;
  textContent: string | null;
  loadingPreview: boolean;
  downloading?: boolean;
  onClose: () => void;
  onDownload?: (e?: React.MouseEvent) => void;
};

const FileViewer: React.FC<Props> = ({
  open,
  selected,
  fileData,
  textContent,
  loadingPreview,
  downloading = false,
  onClose,
  onDownload,
}) => {
  if (!open) return null;

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <div>
            <div className="viewer-title">
              {selected?.name}.{selected?.extension}
            </div>

            {(fileData?.url || typeof textContent === "string") ? (
              <button
                className="viewer-download"
                onClick={onDownload}
                title="Descargar archivo"
                disabled={downloading}
                aria-busy={downloading}
              >
                <MdDownload size={18} />
              </button>
            ) : null}
          </div>
          <button className="viewer-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <div className="viewer-content">
          {loadingPreview && <div className="viewer-loading">Cargando previsualización...</div>}

          {!loadingPreview && fileData && (() => {
            const mime = fileData.mimeType || "";
            const ext = (selected?.extension || "").toLowerCase();

            // Word / Excel / PowerPoint con Office Web Viewer
            const isOfficeExt = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext);
            const isOfficeMime =
              mime.includes("officedocument") ||
              mime.includes("msword") ||
              mime.includes("vnd.ms-powerpoint") ||
              mime.includes("vnd.ms-excel");
            if ((isOfficeExt || isOfficeMime) && fileData.url) {
              const officeUrl =
                `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileData.url)}&ui=en-US&wdOrigin=BROWSELINK`;
              return (
                <iframe
                  className="viewer-frame"
                  src={officeUrl}
                  title={`${selected?.name}.${ext}`}
                  loading="lazy"
                />
              );
            }

            if (mime.startsWith("image/")) {
              return <img className="viewer-media" src={fileData.url} alt={selected?.name || ""} />;
            }
            if (mime.startsWith("audio/")) {
              return <audio className="viewer-media" src={fileData.url} controls />;
            }
            if (mime.startsWith("video/")) {
              return <video className="viewer-media" src={fileData.url} controls />;
            }
            if (mime === "application/pdf") {
              return (
                <iframe
                  className="viewer-frame"
                  src={fileData.url}
                  title={`${selected?.name}.pdf`}
                  loading="lazy"
                />
              );
            }
            if (
              mime.startsWith("text/") ||
              ["js", "ts", "tsx", "jsx", "html", "css", "json", "md"].includes(ext)
            ) {
              return (
                <pre className="viewer-code">
                  <code>{textContent ?? "Contenido no disponible."}</code>
                </pre>
              );
            }
            return (
              <div className="viewer-fallback">
                <p>Vista previa no disponible para este tipo de archivo.</p>
                <div className="viewer-meta">
                  <span>{fileData.mimeType}</span>
                  <span>•</span>
                  <span>Tamaño: ~{Math.round(fileData.size / 1024)} KB</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
