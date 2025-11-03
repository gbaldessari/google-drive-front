import { useEffect, useState } from "react";
import "./myDriveWindow.css";
import { getMyFiles, getFileDataById, getTextContentById } from "../../../../services/files/files.service";
import {
  MdInsertDriveFile,
  MdImage,
  MdPictureAsPdf,
  MdVideoLibrary,
  MdAudioFile,
  MdTextSnippet,
  MdArchive,
  MdCode,
  MdPushPin,
  MdErrorOutline,
} from "react-icons/md";
import type { UploadedFile, FileData } from "../../../../services/files/types/GetFiles.type";

function getIconByExtension(ext: string) {
  const e = ext.toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(e)) return <MdImage size={28} />;
  if (["pdf"].includes(e)) return <MdPictureAsPdf size={28} />;
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(e)) return <MdVideoLibrary size={28} />;
  if (["mp3", "wav", "ogg"].includes(e)) return <MdAudioFile size={28} />;
  if (["txt", "md", "rtf"].includes(e)) return <MdTextSnippet size={28} />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(e)) return <MdArchive size={28} />;
  if (["js", "ts", "tsx", "jsx", "html", "css", "json"].includes(e)) return <MdCode size={28} />;
  if (["xls", "xlsx", "csv"].includes(e)) return <MdInsertDriveFile size={28} />;
  if (["doc", "docx"].includes(e)) return <MdInsertDriveFile size={28} />;
  if (["ppt", "pptx"].includes(e)) return <MdInsertDriveFile size={28} />;
  return <MdInsertDriveFile size={28} />;
}

function MyDriveWindow() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selected, setSelected] = useState<UploadedFile | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getMyFiles()
      .then((res) => {
        if (!mounted) return;
        if (res.success && res.data) setFiles(res.data);
        else setError(res.error || "No se pudo obtener la lista de archivos.");
      })
      .catch(() => mounted && setError("Ocurrió un error inesperado."))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const openViewer = async (file: UploadedFile) => {
    setViewerOpen(true);
    setSelected(file);
    setFileData(null);
    setTextContent(null);
    setLoadingPreview(true);
    const fdRes = await getFileDataById(file.fileDataId);
    if (fdRes.success && fdRes.data) {
      setFileData(fdRes.data);
      const ext = file.extension.toLowerCase();
      const isText =
        fdRes.data.mimeType.startsWith("text/") ||
        ["txt", "md", "json"].includes(ext);
      const isCode = ["js", "ts", "tsx", "jsx", "html", "css", "json"].includes(ext);
      if (isText || isCode) {
        const txt = await getTextContentById(file.fileDataId);
        if (txt.success && txt.data) setTextContent(txt.data);
      }
    }
    setLoadingPreview(false);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelected(null);
    setFileData(null);
    setTextContent(null);
  };

  if (loading) {
    return (
      <div className="my-drive-window">
        <div className="my-drive-header">
          <h2>Mi Unidad</h2>
        </div>
        <div className="my-drive-placeholder">Cargando archivos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-drive-window">
        <div className="my-drive-header">
          <h2>Mi Unidad</h2>
        </div>
        <div className="my-drive-error">
          <MdErrorOutline size={22} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-drive-window">
      <div className="my-drive-header">
        <h2>Mi Unidad</h2>
        <span className="my-drive-counter">{files.length} archivos</span>
      </div>

      <div className="my-drive-grid">
        {files.map((f) => (
          <div
            key={f._id}
            className="file-card"
            onClick={() => openViewer(f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" ? openViewer(f) : null)}
          >
            <div className="file-icon">{getIconByExtension(f.extension)}</div>
            <div className="file-meta">
              <div className="file-title-row">
                <span className="file-name" title={f.name}>{f.name}</span>
                {f.isPinned && <MdPushPin className="file-pin" title="Anclado" />}
              </div>
              <div className="file-sub">
                <span className="file-ext">{f.extension}</span>
                <span className="file-dot">•</span>
                <span className="file-date">
                  Visto {new Date(f.lastSeen).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visor modal */}
      {viewerOpen && (
        <div className="viewer-overlay" onClick={closeViewer}>
          <div className="viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="viewer-header">
              <div className="viewer-title">
                {selected?.name}.{selected?.extension}
              </div>
              <button className="viewer-close" onClick={closeViewer} aria-label="Cerrar">×</button>
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
                  const useEmbed = ["doc", "docx", "ppt", "pptx"].includes(ext); // Excel queda con 'view'
                  const officePath = useEmbed ? "embed" : "view";
                  const officeUrl =
                    `https://view.officeapps.live.com/op/${officePath}.aspx?src=${encodeURIComponent(fileData.url)}&ui=en-US&wdOrigin=BROWSELINK`;
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
                  return <img className="viewer-media" src={fileData.url} alt={selected?.name} />;
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
                    {fileData.url ? (
                      <a className="viewer-download" href={fileData.url} target="_blank" rel="noreferrer">
                        Descargar archivo
                      </a>
                    ) : null}
                    <div className="viewer-meta">
                      <span>MIME: {fileData.mimeType}</span>
                      <span>•</span>
                      <span>Tamaño: ~{Math.round(fileData.size / 1024)} KB</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyDriveWindow;
