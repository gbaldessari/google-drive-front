import './alert.css'

export function Alert({
  type,
  message,
  show,
}: {
  type: "error" | "success";
  message: string;
  show: boolean;
}) {
  return (
    <div className={`${type}-alert ${show ? "show" : "hide"}`}>
      {/* Mensaje de la alerta */}
      <span>{message}</span>
    </div>
  );
}