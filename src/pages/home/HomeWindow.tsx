import "./homeWindow.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdLogout, MdPeople, MdChevronLeft, MdChevronRight, MdHome, MdMemory, MdPerson } from "react-icons/md";
import { handleLogout } from "../../commons/HandleLogout";

function HomeWindow() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <div className={`home-window ${collapsed ? "collapsed" : ""}`}>
        {/* Barra lateral */}
        <div className="home-window-sidebar">
          <button className="home-window-logo-button" onClick={() => navigate("/home")}>
            {collapsed ? <img src="/assets/LOGO2.png" alt="Logo" className="home-window-logo-collapsed" /> 
            : <img src="/assets/LOGO1.png" alt="Logo" className="home-window-logo" />}

          </button>

          <button
            className="home-window-collapse-button"
            aria-label="Alternar barra lateral"
            title={collapsed ? "Expandir" : "Contraer"}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? <MdChevronRight size={22} /> : <MdChevronLeft size={20} />}
          </button>

          <nav className="home-window-sidebar-nav">
            <button
              className="home-window-nav-button"
              onClick={() => navigate("/home")}
            >
              <MdHome size={25} />
              <span>Inicio</span>
            </button>
            <button
              className="home-window-nav-button"
              onClick={() => navigate("/home/my-drive")}
            >
              <MdMemory size={25} />
              <span>Mi Unidad</span>
            </button>
            <button
              className="home-window-nav-button"
              onClick={() => navigate("/home/shared")}
            >
              <MdPeople size={25} />
              <span>Compartidos</span>
            </button>
            <button
              className="home-window-nav-button"
              onClick={() => navigate("/home/profile")}
            >
              <MdPerson size={25} />
              <span>Mi Perfil</span>
            </button>
          </nav>

          <button className="home-window-logout-button" onClick={handleLogout}>
            <MdLogout size={24} />
          </button>
        </div>

        {/* Área de contenido principal */}
        <div className="home-window-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default HomeWindow;
