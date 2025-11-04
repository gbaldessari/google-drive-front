import type { ServiceResponse } from "../ServiceResponce.type";
import type { UploadedFile, FileData } from "./types/GetFiles.type";


const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const mockFiles: UploadedFile[] = [
  {
    _id: "f1",
    fileDataId: "d1",
    name: "Proyecto Presentación",
    extension: "pdf",
    isPinned: true,
    lastSeen: new Date("2025-10-01T10:15:00Z"),
    uploadedAt: new Date("2025-09-28T12:00:00Z"),
    observations: [],
  },
  {
    _id: "f2",
    fileDataId: "d2",
    name: "Foto de vacaciones",
    extension: "jpg",
    isPinned: false,
    lastSeen: new Date("2025-10-31T08:40:00Z"),
    uploadedAt: new Date("2025-10-20T09:10:00Z"),
    observations: [],
  },
  {
    _id: "f3",
    fileDataId: "d3",
    name: "Notas de reunión",
    extension: "txt",
    isPinned: false,
    lastSeen: new Date("2025-10-10T11:02:00Z"),
    uploadedAt: new Date("2025-10-10T09:00:00Z"),
    observations: [],
  },
  {
    _id: "f4",
    fileDataId: "d4",
    name: "Demo app",
    extension: "zip",
    isPinned: false,
    lastSeen: new Date("2025-10-02T14:30:00Z"),
    uploadedAt: new Date("2025-09-30T16:00:00Z"),
    observations: [],
  },
  {
    _id: "f5",
    fileDataId: "d5",
    name: "Reporte mensual",
    extension: "xlsx",
    isPinned: true,
    lastSeen: new Date("2025-10-29T12:20:00Z"),
    uploadedAt: new Date("2025-10-01T08:00:00Z"),
    observations: [],
  },
  {
    _id: "f6",
    fileDataId: "d6",
    name: "Script utilidades",
    extension: "ts",
    isPinned: false,
    lastSeen: new Date("2025-10-25T10:00:00Z"),
    uploadedAt: new Date("2025-10-21T10:00:00Z"),
    observations: [],
  },
  {
    _id: "f7",
    fileDataId: "d7",
    name: "Audio entrevista",
    extension: "mp3",
    isPinned: false,
    lastSeen: new Date("2025-10-05T07:00:00Z"),
    uploadedAt: new Date("2025-10-04T07:00:00Z"),
    observations: [],
  },
  {
    _id: "f8",
    fileDataId: "d8",
    name: "Video promo",
    extension: "mp4",
    isPinned: false,
    lastSeen: new Date("2025-10-15T18:00:00Z"),
    uploadedAt: new Date("2025-10-12T18:00:00Z"),
    observations: [],
  },
  {
    _id: "f9",
    fileDataId: "d9",
    name: "Contrato plantilla",
    extension: "docx",
    isPinned: false,
    lastSeen: new Date("2025-10-22T09:30:00Z"),
    uploadedAt: new Date("2025-10-22T08:00:00Z"),
    observations: [],
  },
  {
    _id: "f10",
    fileDataId: "d10",
    name: "Presentación comercial",
    extension: "pptx",
    isPinned: false,
    lastSeen: new Date("2025-10-18T10:00:00Z"),
    uploadedAt: new Date("2025-10-17T17:00:00Z"),
    observations: [],
  },
  {
    _id: "f11",
    fileDataId: "d11",
    name: "Ventas Q4",
    extension: "csv",
    isPinned: false,
    lastSeen: new Date("2025-10-31T09:00:00Z"),
    uploadedAt: new Date("2025-10-30T18:15:00Z"),
    observations: [],
  },
];

// Mapea cada fileDataId a su metadata y URL de previsualización/descarga
const mockFileData: Record<string, FileData> = {
  d1: {
    _id: "d1",
    blobName: "presentacion.pdf",
    url: "https://www.turnerlibros.com/wp-content/uploads/2021/02/ejemplo.pdf",
    size: 860_000,
    mimeType: "application/pdf",
  },
  d2: {
    _id: "d2",
    blobName: "vacaciones.jpg",
    url: "https://picsum.photos/seed/picsum/1200/800",
    size: 350_000,
    mimeType: "image/jpeg",
  },
  d3: {
    _id: "d3",
    blobName: "notas.txt",
    url: "",
    size: 2_400,
    mimeType: "text/plain; charset=utf-8",
  },
  d4: {
    _id: "d4",
    blobName: "demo.zip",
    url: "https://file-examples.com/wp-content/uploads/2017/02/zip_2MB.zip",
    size: 2_097_152,
    mimeType: "application/zip",
  },
  d5: {
    _id: "d5",
    blobName: "reporte.xlsx",
    url: "https://filesamples.com/samples/document/xlsx/sample1.xlsx",
    size: 10_240,
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  d6: {
    _id: "d6",
    blobName: "utilidades.ts",
    url: "",
    size: 4_096,
    mimeType: "text/x-typescript; charset=utf-8",
  },
  d7: {
    _id: "d7",
    blobName: "entrevista.mp3",
    url: "https://www.w3schools.com/html/horse.mp3",
    size: 700_000,
    mimeType: "audio/mpeg",
  },
  d8: {
    _id: "d8",
    blobName: "promo.mp4",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    size: 4_500_000,
    mimeType: "video/mp4",
  },
  d9: {
    _id: "d9",
    blobName: "contrato.docx",
    url: "https://filesamples.com/samples/document/docx/sample1.docx",
    size: 100_000,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  d10: {
    _id: "d10",
    blobName: "presentacion.pptx",
    url: "https://www.unileon.es/ficheros/informacion_general/id_visual_corporativa/nueva_marca/ejemplos-ppt.ppt",
    size: 500_000,
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  d11: {
    _id: "d11",
    blobName: "ventas_q4.csv",
    url: "",
    size: 480,
    mimeType: "text/csv; charset=utf-8",
  },
};

// Contenidos de texto/código (mock)
const mockTextContent: Record<string, string> = {
  d3: `# Notas de reunión
- Tema: Roadmap Q4
- Participantes: Ana, Luis, Marta
- Acciones:
  1. Cerrar backlog de bugs críticos.
  2. Preparar demo de funcionalidades nuevas.
  3. Publicar release 1.2.0.

Gracias.`,
  d6: `// utilidades.ts (mock)
export function sum(a: number, b: number) {
  return a + b;
}

export const greet = (name: string) => \`Hola \${name}!\`;`,
  d11: `fecha,cliente,producto,cantidad,precio_total
2025-10-01,Ana SA,Suscripcion Pro,3,149.97
2025-10-05,Luis SL,Consultoria,1,500.00
2025-10-12,Marta Tech,Licencia Enterprise,10,2990.00
2025-10-20,Acme Corp,Soporte Anual,2,800.00
2025-10-28,Globex,Add-on Storage,5,125.00`,
};

export async function getMyFiles(): Promise<ServiceResponse<UploadedFile[]>> {
  await delay(600);
  return { success: true, data: mockFiles };
}

// Nuevo: obtiene metadata/URL del archivo
export async function getFileDataById(fileDataId: string): Promise<ServiceResponse<FileData>> {
  await delay(300);
  const data = mockFileData[fileDataId];
  if (!data) return { success: false, error: "Archivo no encontrado." };
  return { success: true, data };
}

// Nuevo: obtiene contenido para texto/código
export async function getTextContentById(fileDataId: string): Promise<ServiceResponse<string>> {
  await delay(250);
  const content = mockTextContent[fileDataId];
  if (typeof content !== "string") return { success: false, error: "Contenido no disponible." };
  return { success: true, data: content };
}
