# ToDo Refactor Lab

**Integrantes:** Laura Beatriz Ruiz Oros · Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago

Proyecto de **ToDo Refactor Lab**: refactorización, pruebas unitarias y Pair Programming.

## Inicio

```bash
npm install
npm test
```

Durante el desarrollo:

```bash
npm run test:watch
```

Para ver la aplicación en el navegador se abre `index.html` con **Live Server** (extensión de VS Code), porque `app.js` usa módulos ES y no funciona con doble clic.

La primera prueba está preparada para fallar: es el punto de partida de la **Misión 2** y del ciclo **RED → GREEN → REFACTOR**.

## Estructura

- `src/legacy.js`: código funcional simple para analizar antes de cambiar.
- `src/taskService.js`: lógica de dominio que completarás misión por misión.
- `src/app.js`: interfaz inicial; en la Misión 9 deberá delegar la lógica a `taskService.js`.
- `tests/taskService.test.js`: suite incremental de pruebas unitarias con Vitest.
- `evidencia/`: capturas de pantalla (RED, GREEN, suite final y aplicación funcionando).

## Misión 0 · Antes de modificar código

Responde aquí:

1. ¿Dónde almacenarías ahora el estado `completada` de una tarea?
   Lo guardaríamos como una propiedad booleana dentro del propio objeto de cada tarea: `{ id, titulo, completada: false }`.

2. ¿Qué ocurriría si mañana cada tarea necesita prioridad, fecha o responsable?
   Con strings tendríamos que agregar un array paralelo por cada dato nuevo (`prioridades`, `fechas`, `responsables`), todos dependientes del índice, y cualquier cambio en uno (eliminar, filtrar, ordenar) obligaría a modificar los demás o quedarían desfasados.
    Con objetos basta con agregar una propiedad (`prioridad: "alta"`, `fecha: "..."`, `responsable: "..."`) y las funciones existentes siguen funcionando sin cambios, porque el resto de las propiedades se conserva.

3. ¿Qué parte del código representa datos y qué parte representa interfaz?
   - Datos:el array `tareas` con los textos de las tareas.
   - Interfaz: la función `mostrarTareas()`, que usa `document.querySelector`, `lista.innerHTML` y arma el HTML de cada `<li>`.
   Ambas están mezcladas: la misma función recorre los datos con un `for` y escribe en el DOM, por lo que no se puede probar la lógica de recorrido sin un navegador. Además, `innerHTML` con texto del usuario permite inyectar HTML.

4. ¿Qué comportamiento debemos conservar durante el refactor?
   Que la aplicación siga mostrando las tareas en el mismo orden, que se puedan agregar tareas nuevas al final, que no se acepten títulos vacíos y que se puedan eliminar tareas. 
   
   El refactor cambia cómo está construido el código por dentro, no lo que el usuario observa.

### Tres comportamientos observables que NO deben cambiar

1. Al iniciar la aplicación se muestran las tres tareas iniciales, en este orden: "Revisar requisitos", "Diseñar pruebas" y "Refactorizar código".
2. Al escribir un título válido y presionar, la tarea aparece al final de la lista y el campo de texto se limpia.
3. Al enviar un título vacío (o solo espacios), la tarea no se agrega y se muestra el mensaje "Escribe un título antes de agregar."

## Misión 1 · Cambio de modelo (string → objeto)

Cada tarea pasó de ser un texto a un objeto `{ id, titulo, completada }`, y el estado de la aplicación es un **array de objetos**.

| Propiedad | ¿Dominio o interfaz? | Razón |
|---|---|---|
| `id` | Dominio | Identifica la tarea sin depender de su posición en el array. |
| `titulo` | Dominio | Es el contenido de la tarea. |
| `completada` | Dominio | Es el estado de la tarea y se usa en reglas (filtrar, contar). |
| Clase CSS `done`, texto del botón ("Completar"/"Reabrir") | Interfaz | Es solo la forma de mostrar el estado, no forma parte de la tarea. |

## Registro RED → GREEN → REFACTOR

Iteración documentada: **Misión 2 · `crearTarea`**

 **RED:** escribimos (con el formato Arrange–Act–Assert) la prueba *"crea una tarea pendiente con id y título"*, que llama a `crearTarea(10, "Diseñar pruebas")` y espera como resultado `{ id: 10, titulo: "Diseñar pruebas", completada: false }`. Al ejecutar `npm test` la prueba falló (1 failed de 1) porque la función aún no tenía implementación: solo lanzaba `Error("Misión 2 pendiente: implementar crearTarea()")`. Evidencia: `evidencia/01-red-crearTarea.png`.
- **GREEN:** el cambio mínimo fue reemplazar el `throw` por `return { id, titulo, completada: false };`. Al ejecutar `npm test` de nuevo, la prueba pasó (1 passed). Evidencia: `evidencia/02-green-crearTarea.png`.
- **REFACTOR:** revisamos nombres y estructura. Los nombres `id`, `titulo` y `completada` ya expresan la intención y la función tiene una sola responsabilidad (construir una tarea), por lo que usamos la sintaxis abreviada de propiedades del objeto (`{ id, titulo }` en lugar de `{ id: id, titulo: titulo }`) y volvimos a ejecutar `npm test` para confirmar que seguía en verde.

## Decisiones de diseño por misión

| Misión | Función | Método elegido | Por qué |
|---|---|---|---|
| 2 | `crearTarea(id, titulo)` | Objeto literal | Construye una tarea pendiente con una sola responsabilidad. |
| 3 | `agregarTarea(tareas, nueva)` | Spread `[...tareas, nueva]` | Devuelve un array nuevo y no modifica el recibido. Sin esa garantía haría falta una prueba de no mutación (la incluimos). |
| 4 | `buscarTarea(tareas, id)` | `find()` | La intención es "encontrar uno". Devuelve el elemento o `undefined`. `filter()` devolvería un array y habría que sacar el primer elemento. |
| 5 | `obtenerPendientes` / `obtenerTerminadas` | `filter()` | Selecciona un subconjunto sin transformar los elementos. Si no hay coincidencias devuelve `[]`, nunca `undefined`. |
| 6 | `cambiarEstado(tareas, id)` | `map()` + spread | Produce una colección del mismo tamaño donde solo cambia una tarea. El spread crea un objeto nuevo y no muta el original. `forEach` no devuelve colección y modificaría el objeto directamente. |
| 7 | `eliminarTarea(tareas, id)` | `filter()` | Eliminar es "conservar todos excepto el id indicado". `map()` mantiene el tamaño y `find()` devuelve un solo elemento. |
| 8 | `obtenerResumen(tareas)` | Reutiliza `obtenerPendientes` y `obtenerTerminadas` | Ver comparación abajo. |
| 10 | `esTituloValido`, `filtrarPorEstado`, `siguienteId` | Funciones puras en el servicio | Eran reglas escondidas en el DOM. Ahora se prueban sin navegador. |
| 11 | `buscarPorTexto(tareas, texto)` | `filter()` + `includes()` | Selecciona las tareas cuyo título contiene el texto, sin distinguir mayúsculas. |

### Comparación de soluciones para `obtenerResumen` (Misión 8)

| | Reutilizar funciones ya probadas | Calcular directamente |
|---|---|---|
| Código | `obtenerPendientes(tareas).length` | Un solo `reduce()` o `for` con contadores |
| Intención | Se lee casi como una frase | Hay que interpretar la lógica |
| Trabajo | Recorre el array más veces | Un solo recorrido |
| Mantenimiento | Si cambia qué es "pendiente", se cambia en un solo lugar | La regla queda duplicada |

**Elegimos reutilizar** las funciones ya probadas porque comunica mejor la intención y evita duplicar la regla de qué es pendiente o terminada. El recorrido extra es irrelevante con este tamaño de datos.

## Pruebas unitarias

Se ejecutan con `npm test` (Vitest) y usan el formato **Arrange–Act–Assert**. La suite final tiene **34 pruebas, todas en verde**.

| Misión | Función | Pruebas | Casos cubiertos |
|---|---|---|---|
| 2 | `crearTarea` | 1 | Tarea pendiente con id y título. |
| 3 | `agregarTarea` | 3 | Resultado correcto, un elemento más, el array original no se modifica. |
| 4 | `buscarTarea` | 3 | Id existente, id inexistente (`undefined`), colección vacía. |
| 5 | `obtenerPendientes` / `obtenerTerminadas` | 3 | Colección mixta, sin coincidencias, colección vacía. |
| 6 | `cambiarEstado` | 4 | Cambia la tarea correcta, no altera las demás, id inexistente, no muta el original. |
| 7 | `eliminarTarea` | 4 | Id existente, id inexistente, colección vacía, no muta el original. |
| 8 | `obtenerResumen` | 3 | Conteo correcto, colección vacía, pendientes + terminadas = total. |
| 10 | `esTituloValido` | 2 | Título válido, vacío y solo espacios. |
| 10 | `filtrarPorEstado` | 3 | "todas", "pendientes" y "terminadas". |
| 10 | `siguienteId` | 2 | Colección vacía y no reutiliza ids tras eliminar. |
| 11 | `buscarPorTexto` | 6 | Coincidencia parcial, mayúsculas, espacios, texto vacío, sin coincidencias, colección vacía. |

### Casos frontera

Además del caso normal, probamos id inexistente, colección vacía, colección sin coincidencias y que las funciones **no modifiquen** los datos recibidos. Son los escenarios donde una implementación incorrecta suele fallar sin que se note a simple vista (por ejemplo, mutar el array original o lanzar un error con una lista vacía).

## Registro de fallos

Formato: entrada → resultado observado → resultado esperado → corrección.

| Misión | Entrada | Observado | Esperado | Corrección |
|---|---|---|---|---|
| 4 | `buscarTarea(mixtas(), 2)` | Título `"Disenar pruebas"` | `"Diseñar pruebas"` | El error estaba en el dato del helper `mixtas` (la "ñ" mal escrita), no en la función. Se corrigió el dato y la suite volvió a verde. |

## Misión 9 · Integración con la interfaz

`app.js` quedó como **adaptador**: lee el evento del usuario, llama a una función de `taskService.js`, guarda el nuevo estado y vuelve a dibujar con `render()`. No decide reglas de negocio, solo las usa.

```
evento del usuario → app.js → taskService.js (probado) → nuevo estado → render() → DOM
```

La asignación `tareas = agregarTarea(...)` reemplaza la variable por la colección nueva en lugar de modificar el array.

## Misión 10 · Refactor final

Con la suite en verde y ejecutando `npm test` después de cada cambio pequeño:

| Cambio | Problema que resolvía |
|---|---|
| Se movió la validación del título a `esTituloValido` | La regla estaba dentro de un `if` del evento del DOM. |
| Se movió el filtrado a `filtrarPorEstado` | `app.js` tenía su propia función `aplicarFiltro` con la regla. |
| Se creó `siguienteId` | El cálculo del id estaba suelto dentro del evento. |
| Se separó `crearItem(tarea)` de `render()` | `render()` decidía qué mostrar y además construía cada elemento. |
| Se cambió `innerHTML` por `textContent` | Un título como `<b>hola</b>` se interpretaba como HTML (riesgo de inyección). Ahora se muestra como texto. |

## Pruebas de integración manual

Se probaron en el navegador con Live Server.

| Escenario | Acción | Resultado esperado | ¿OK? |
|---|---|---|---|
| Alta válida | Escribir título y pulsar Agregar | Aparece una nueva tarea pendiente y cambia el resumen | ☐ |
| Alta inválida | Enviar título vacío | No se agrega; se muestra mensaje claro | ☐ |
| Cambio de estado | Pulsar Completar | Cambia estilo/estado y contadores | ☐ |
| Filtro | Elegir Pendientes | Solo se muestran pendientes | ☐ |
| Eliminar | Pulsar Eliminar | Desaparece y se actualiza el resumen | ☐ |
| Búsqueda (extensión) | Escribir "PRUEB" | Solo aparece "Diseñar pruebas" | ☐ |
| HTML en el título | Agregar `<b>prueba</b>` | Se muestra como texto, sin formato | ☐ |

## Misión 11 · Nuevo requerimiento

**Extensión elegida: B · Buscar por texto.**

- **¿Debe ignorar mayúsculas y minúsculas?** Sí. También ignora los espacios al inicio y al final de lo buscado.
- Si el texto está vacío devuelve todas las tareas; si no hay coincidencias devuelve `[]`.
- La búsqueda se combina con el filtro de estado: `buscarPorTexto(filtrarPorEstado(tareas, filtro), busqueda)`.

**¿El refactor facilitó el cambio?** Sí. Para agregar la búsqueda solo se creó una función nueva en `taskService.js` (con sus pruebas), un `input` en `index.html` y unas pocas líneas en `app.js`. No hubo que modificar `crearTarea`, `cambiarEstado`, `eliminarTarea` ni las demás funciones. Esto indica que la regla vive en el dominio y la interfaz solo la conecta.

## Pair Programming

Registra por misión quién fue **Driver** y quién **Navigator**. Intercambien roles con frecuencia y no hagan commit hasta que ambos puedan explicar el código y la prueba.

| Misión | Driver | Navigator |
|---|---|---|
| 0 · Comprender antes de cambiar | Laura Beatriz Ruiz Oros | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago |
| 1 · Cambiar el modelo (string → objeto) | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago | Laura Beatriz Ruiz Oros |
| 2 · `crearTarea` + primera prueba | Laura Beatriz Ruiz Oros | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago |
| 3 · `agregarTarea` | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago | Laura Beatriz Ruiz Oros |
| 4 · `buscarTarea` (`find`) | Laura Beatriz Ruiz Oros | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago |
| 5 · `obtenerPendientes` / `obtenerTerminadas` (`filter`) | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago | Laura Beatriz Ruiz Oros |
| 6 · `cambiarEstado` (`map` + spread) | Laura Beatriz Ruiz Oros | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago |
| 7 · `eliminarTarea` | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago | Laura Beatriz Ruiz Oros |
| 8 · `obtenerResumen` | Laura Beatriz Ruiz Oros | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago |
| 9 · Integrar con la interfaz | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago | Laura Beatriz Ruiz Oros |
| 10 · Refactor final | Laura Beatriz Ruiz Oros | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago |
| 11 · Nuevo requerimiento | Oliver Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago Vásquez Santiago | Laura Beatriz Ruiz Oros |


## Evidencia

Las capturas están en la carpeta `evidencias/`. En cada misión se guardó una captura de la prueba fallando (RED) y otra pasando (GREEN).

| Misión | RED (la prueba falla) | GREEN (la prueba pasa) |
|---|---|---|
| 2 · `crearTarea` | `1-red-crearTarea.png` | `02-green-crearTarea.png` |
| 3 · `agregarTarea` | `03-con-falla.png` | `03-bien.png` |
| 4 · `buscarTarea` | `04- buscar tarea falla.png`, `4.2 falla buscar tarea.png` | `mision 4 green .png` |
| 5 · `filter` | (completar con el nombre del archivo) | `5-bien.png` |
| 6 · `cambiarEstado` | `6- mision fallida.png` | `6- mision green.png` |
| 7 · `eliminarTarea` | `7-falla.png` | `7-bien.png` |
| 8 · `obtenerResumen` | `8- falla.png` | `8-green.png` |
| 9 · Integración con la interfaz | No aplica (no hay pruebas nuevas) | `9-correcto.png` |
| 10 · Refactor final | `10- falla.png` | `10-green.png` |
| 11 · final mision| `11-correcto.png` |

Aplicación funcionando en el navegador: `evidencia pagina.png` y `evidencia pagina 2.png`.
## Reflexión de pareja

El cambio que más aumentó la mantenibilidad fue pasar de strings a objetos y mover las reglas a `taskService.js`. Con strings, el estado `completada` no tenía dónde vivir y cada dato nuevo habría exigido arrays paralelos dependientes del índice. Con objetos y funciones que reciben y devuelven datos, cada regla se prueba sin navegador y `app.js` quedó como un adaptador delgado. La prueba que más confianza nos dio fue "no altera las demás tareas" de `cambiarEstado`, porque protege un error silencioso y fácil de cometer al refactorizar: modificar la tarea equivocada o mutar el objeto original. También valoramos las pruebas de no mutación en `agregarTarea` y `eliminarTarea`, pues sin ellas esos defectos solo aparecerían como comportamientos extraños en pantalla. En la Misión 4 una prueba falló por una "ñ" mal escrita en los datos, y aprendimos a leer el mensaje de error antes de culpar a la función. Al agregar la búsqueda por texto comprobamos el beneficio del diseño: bastó una función nueva con sus pruebas y pocas líneas en la interfaz, sin tocar el resto. Además, trabajar en pareja nos obligó a explicar cada decisión en voz alta antes de hacer commit, y eso mejoró tanto el código como nuestra comprensión de por qué elegimos `map()`, `filter()` o `find()` en cada caso.