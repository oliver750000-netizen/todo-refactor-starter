/*
 * MISIÓN 9 · ADAPTADOR DE INTERFAZ
 * app.js: lee eventos del DOM → llama a taskService.js → guarda el nuevo estado → render()
 */
import {
  crearTarea,
  agregarTarea,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen,
  obtenerPendientes,
  obtenerTerminadas
} from "./taskService.js";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
const filters = [...document.querySelectorAll("[data-filter]")];

let tareas = [
  crearTarea(1, "Revisar requisitos"),
  crearTarea(2, "Diseñar pruebas"),
  crearTarea(3, "Refactorizar código")
];
let filtro = "todas";

function aplicarFiltro() {
  if (filtro === "pendientes") return obtenerPendientes(tareas);
  if (filtro === "terminadas") return obtenerTerminadas(tareas);
  return tareas;
}

function render() {
  list.innerHTML = "";
  aplicarFiltro().forEach((tarea) => {
    const li = document.createElement("li");
    li.className = tarea.completada ? "task done" : "task";
    li.innerHTML = `<span class="title">${tarea.titulo}</span>
      <span class="task-actions">
        <button data-toggle="${tarea.id}">${tarea.completada ? "Reabrir" : "Completar"}</button>
        <button data-delete="${tarea.id}">Eliminar</button>
      </span>`;
    list.appendChild(li);
  });

  const { total, pendientes, terminadas } = obtenerResumen(tareas);
  summary.textContent = `Total: ${total} · Pendientes: ${pendientes} · Terminadas: ${terminadas}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = input.value.trim();
  if (!titulo) {
    message.textContent = "Escribe un título antes de agregar.";
    return;
  }
  const nuevoId = Math.max(0, ...tareas.map((t) => t.id)) + 1;
  tareas = agregarTarea(tareas, crearTarea(nuevoId, titulo));
  input.value = "";
  message.textContent = "";
  render();
});

list.addEventListener("click", (event) => {
  const { toggle, delete: borrar } = event.target.dataset;
  if (toggle !== undefined) tareas = cambiarEstado(tareas, Number(toggle));
  else if (borrar !== undefined) tareas = eliminarTarea(tareas, Number(borrar));
  else return;
  render();
});

filters.forEach((button) =>
  button.addEventListener("click", () => {
    filtro = button.dataset.filter;
    filters.forEach((b) => b.classList.toggle("active", b === button));
    message.textContent = "";
    render();
  })
);

render();