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
  esTituloValido,
  filtrarPorEstado,
  siguienteId
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

function crearItem(tarea) {
  const li = document.createElement("li");
  li.className = tarea.completada ? "task done" : "task";

  const titulo = document.createElement("span");
  titulo.className = "title";
  titulo.textContent = tarea.titulo;

  const acciones = document.createElement("span");
  acciones.className = "task-actions";

  const botonEstado = document.createElement("button");
  botonEstado.dataset.toggle = tarea.id;
  botonEstado.textContent = tarea.completada ? "Reabrir" : "Completar";

  const botonEliminar = document.createElement("button");
  botonEliminar.dataset.delete = tarea.id;
  botonEliminar.textContent = "Eliminar";

  acciones.append(botonEstado, botonEliminar);
  li.append(titulo, acciones);
  return li;
}

function render() {
  const visibles = filtrarPorEstado(tareas, filtro);
  list.replaceChildren(...visibles.map(crearItem));

  const { total, pendientes, terminadas } = obtenerResumen(tareas);
  summary.textContent = `Total: ${total} · Pendientes: ${pendientes} · Terminadas: ${terminadas}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!esTituloValido(input.value)) {
    message.textContent = "Escribe un título antes de agregar.";
    return;
  }
  const nueva = crearTarea(siguienteId(tareas), input.value.trim());
  tareas = agregarTarea(tareas, nueva);
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