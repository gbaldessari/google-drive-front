import { useEffect, useState, useMemo } from "react";
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
  MdSort,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import FileViewer from "../../../../commons/FileViewer";
import type { UploadedFile, FileData } from "../../../../services/files/types/GetFiles.type";
import { Alert } from "../../../../commons/Alert";

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
  const [downloading, setDownloading] = useState(false);
  const [alert, setAlert] = useState({ type: "error" as const, message: "", show: false });

  // Nuevo: estado de ordenación
  const [sortBy, setSortBy] = useState<"recent" | "name" | "type" | "uploaded">("recent");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [pinFirst, setPinFirst] = useState(true);

  // Nuevo: lista ordenada sin mutar 'files'
  const sortedFiles = useMemo(() => {
    const arr = [...files];
    const dir = sortDir === "asc" ? 1 : -1;

    const cmp = (a: UploadedFile, b: UploadedFile) => {
      // Anclados primero (si aplica)
      if (pinFirst && a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

      let vA = 0;
      let vB = 0;
      if (sortBy === "recent") {
        vA = new Date(a.lastSeen).getTime();
        vB = new Date(b.lastSeen).getTime();
      } else if (sortBy === "uploaded") {
        vA = new Date(a.uploadedAt).getTime();
        vB = new Date(b.uploadedAt).getTime();
      } else if (sortBy === "name") {
        const res = a.name.localeCompare(b.name, "es", { sensitivity: "base" });
        if (res !== 0) return res * dir;
      } else if (sortBy === "type") {
        const res = a.extension.localeCompare(b.extension, "es", { sensitivity: "base" });
        if (res !== 0) return res * dir;
      }
      // Para comparaciones numéricas (fechas)
      if (vA !== vB) return (vA < vB ? -1 : 1) * dir;

      // Desempate por nombre
      return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
    };

    return arr.sort(cmp);
  }, [files, sortBy, sortDir, pinFirst]);

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

  const handleDownload = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!selected) return;
    const filename = `${selected.name}.${selected.extension}`;
    try {
      setDownloading(true);
      if (fileData?.url) {
        const resp = await fetch(fileData.url, { mode: "cors", referrerPolicy: "no-referrer" });
        if (!resp.ok) throw new Error("Respuesta no OK");
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
        return;
      }
      if (typeof textContent === "string") {
        const blob = new Blob([textContent], { type: fileData?.mimeType || "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
        return;
      }
      throw new Error("No hay fuente descargable");
    } catch (err) {
      console.error("Fallo al descargar:", err);
      setAlert({
        type: "error",
        message: "No se pudo descargar este archivo (posible restricción CORS).",
        show: true,
      });
      setTimeout(() => setAlert((a) => ({ ...a, show: false })), 3500);
    } finally {
      setDownloading(false);
    }
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
        <Alert type="error" message={error} show={true} />
      </div>
    );
  }

  return (
    <div className="my-drive-window">
      <Alert type={alert.type} message={alert.message} show={alert.show} />
      <div className="my-drive-header">
        <h2>Mi Unidad</h2>
        <div className="my-drive-actions">
          <span className="my-drive-counter">{files.length} archivos</span>
          <div className="my-drive-toolbar">
            <label className="sort-label">
              <MdSort size={18} />
              <span>Ordenar por</span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="recent">Recientes</option>
                <option value="uploaded">Fecha de subida</option>
                <option value="name">Nombre</option>
                <option value="type">Tipo</option>
              </select>
            </label>

            <button
              className="sort-dir-btn"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              title={sortDir === "asc" ? "Ascendente" : "Descendente"}
              aria-pressed={sortDir === "desc"}
            >
              {sortDir === "asc" ? <MdArrowUpward size={18} /> : <MdArrowDownward size={18} />}
            </button>

            <label className="pinfirst">
              <input
                type="checkbox"
                checked={pinFirst}
                onChange={(e) => setPinFirst(e.target.checked)}
              />
              <span>Anclados primero</span>
            </label>
          </div>
        </div>
      </div>

      <div className="my-drive-grid">
        {sortedFiles.map((f) => (
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
                <span className="file-date">Visto {new Date(f.lastSeen).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FileViewer
        open={viewerOpen}
        selected={selected}
        fileData={fileData}
        textContent={textContent}
        loadingPreview={loadingPreview}
        downloading={downloading}
        onClose={closeViewer}
        onDownload={handleDownload}
      />
    </div>
  );
}

export default MyDriveWindow;