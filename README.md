# ToDo Refactor Starter

Proyecto para **ToDo Refactor Lab**: refactorización, pruebas unitarias y Pair Programming.

**Integrantes:** Laura Beatriz Ruiz Oros · Oliver

## Inicio

```bash
npm install
npm test
```

Durante el desarrollo:

```bash
npm run test:watch
```

La primera prueba está preparada para fallar: es el punto de partida de la **Misión 2** y del ciclo **RED → GREEN → REFACTOR**.

## Estructura

- `src/legacy.js`: código funcional simple para analizar antes de cambiar.
- `src/taskService.js`: lógica de dominio que completarás misión por misión.
- `src/app.js`: interfaz; delega la lógica a `taskService.js` (Misión 9).
- `tests/taskService.test.js`: suite incremental de pruebas unitarias con Vitest.

---

## Misión 0 · Antes de modificar código

Responde aquí:

1. **¿Dónde almacenarías ahora el estado `completada` de una tarea?**
   Lo guardaríamos como una propiedad booleana dentro del propio objeto de cada tarea: `{ id, titulo, completada: false }`.

2. **¿Qué ocurriría si mañana cada tarea necesita prioridad, fecha o responsable?**
   Con strings tendríamos que agregar un array paralelo por cada dato nuevo (`prioridades`, `fechas`, `responsables`), todos dependientes del índice, y cualquier cambio en uno (eliminar, filtrar, ordenar) obligaría a modificar los demás o quedarían desfasados.
   Con objetos basta con agregar una propiedad (`prioridad: "alta"`, `fecha: "..."`, `responsable: "..."`) y las funciones existentes siguen funcionando sin cambios, porque el resto de las propiedades se conserva.

3. **¿Qué parte del código representa datos y qué parte representa interfaz?**
   - Datos: el array `tareas` con los textos de las tareas.
   - Interfaz: la función `mostrarTareas()`, que usa `document.querySelector`, `lista.innerHTML` y arma el HTML de cada `<li>`.

   Ambas están mezcladas: la misma función recorre los datos con un `for` y escribe en el DOM, por lo que no se puede probar la lógica de recorrido sin un navegador. Además, `innerHTML` con texto del usuario permite inyectar HTML.

4. **¿Qué comportamiento debemos conservar durante el refactor?**
   Que la aplicación siga mostrando las tareas en el mismo orden, que se puedan agregar tareas nuevas al final, que no se acepten títulos vacíos y que se puedan eliminar tareas.
   El refactor cambia cómo está construido el código por dentro, no lo que el usuario observa.

### Tres comportamientos observables que NO deben cambiar

1. Al iniciar la aplicación se muestran las tres tareas iniciales, en este orden: "Revisar requisitos", "Diseñar pruebas" y "Refactorizar código".
2. Al escribir un título válido y presionar, la tarea aparece al final de la lista y el campo de texto se limpia.
3. Al enviar un título vacío (o solo espacios), la tarea no se agrega y se muestra el mensaje "Escribe un título antes de agregar."

---

## Decisiones de refactor

| Decisión | Motivo |
|---|---|
| Pasar de `string` a objeto `{ id, titulo, completada }` (Misión 1) | Da identidad y estado a cada tarea y permite agregar propiedades sin arrays paralelos. |
| Mover las reglas a `src/taskService.js` | La lógica se puede probar sin navegador; `app.js` queda como adaptador entre eventos, dominio y DOM. |
| Funciones que reciben datos y devuelven datos | Menos efectos secundarios y pruebas más deterministas. |
| `find()` en `buscarTarea` | Expresa "encontrar uno" y devuelve `undefined` si no existe. |
| `filter()` en `obtenerPendientes` / `obtenerTerminadas` | Selecciona subconjuntos sin alterar la colección original. |
| `map()` + spread en `cambiarEstado` | Produce una colección nueva sin mutar el objeto original. |
| `filter()` en `eliminarTarea` | Se expresa como "conservar todos excepto…". |

---

## Registro RED → GREEN → REFACTOR

Iteración documentada: **Misión 2 · `crearTarea`**

- **RED:** escribimos (con el formato Arrange–Act–Assert) la prueba *"crea una tarea pendiente con id y título"*, que llama a `crearTarea(10, "Diseñar pruebas")` y espera como resultado `{ id: 10, titulo: "Diseñar pruebas", completada: false }`. Al ejecutar `npm test` la prueba falló (1 failed de 1) porque la función aún no tenía implementación: solo lanzaba `Error("Misión 2 pendiente: implementar crearTarea()")`. Evidencia: `evidencia/01-red-crearTarea.png`.
- **GREEN:** el cambio mínimo fue reemplazar el `throw` por `return { id, titulo, completada: false };`. Al ejecutar `npm test` de nuevo, la prueba pasó (1 passed). Evidencia: `evidencia/02-green-crearTarea.png`.
- **REFACTOR:** revisamos nombres y estructura. Los nombres `id`, `titulo` y `completada` ya expresan la intención y la función tiene una sola responsabilidad (construir una tarea), por lo que usamos la sintaxis abreviada de propiedades del objeto (`{ id, titulo }` en lugar de `{ id: id, titulo: titulo }`) y volvimos a ejecutar `npm test` para confirmar que seguía en verde.

---

## Pruebas unitarias

Ejecutar con `npm test`. Cada prueba usa Arrange–Act–Assert.

| Función | Casos probados |
|---|---|
| `crearTarea` | Crea una tarea pendiente con id y título. |
| `agregarTarea` | Caso normal; el resultado contiene un elemento más; no modifica el array recibido. |
| `buscarTarea` | Encuentra un id existente; un id inexistente devuelve `undefined`. |
| `obtenerPendientes` / `obtenerTerminadas` | Colección mixta; ninguna pendiente; colección vacía. |
| `cambiarEstado` | Cambia el estado correcto; no altera otra tarea; un id inexistente conserva el contenido. |
| `eliminarTarea` | Elimina un id existente; id inexistente; colección vacía. |
| `obtenerResumen` | Devuelve `{ total, pendientes, terminadas }`. |

---

## Pruebas de integración manual

| Escenario | Acción | Resultado esperado |
|---|---|---|
| Alta válida | Escribir título y Agregar. | Aparece una nueva tarea pendiente y cambia el resumen. |
| Alta inválida | Enviar título vacío. | No se agrega; se muestra mensaje claro. |
| Cambio de estado | Marcar una tarea. | Cambia estilo/estado y contadores. |
| Filtro | Elegir Pendientes. | Solo se muestran pendientes. |
| Eliminar | Eliminar una tarea. | Desaparece y se actualiza el resumen. |

Formato para registrar fallos: entrada → resultado observado → resultado esperado → corrección.

---

## Evidencia

- `evidencia/01-red-crearTarea.png`: prueba fallando (RED).
- `evidencia/02-green-crearTarea.png`: prueba pasando (GREEN).

---

## Reflexión de pareja

El cambio que más aumentó la mantenibilidad fue pasar de un array de strings a un array de objetos (`{ id, titulo, completada }`) y mover toda la lógica a `taskService.js`. Antes, `legacy.js` mezclaba los datos con el DOM: `mostrarTareas()` recorría el array y escribía directamente en `lista.innerHTML`, así que cualquier regla nueva obligaba a tocar la interfaz. Con objetos, cada tarea tiene identidad propia y estado, y las funciones de dominio reciben datos y devuelven datos sin tocar el navegador. Eso permitió que `crearTarea`, `agregarTarea`, `buscarTarea`, `obtenerPendientes`, `cambiarEstado` y `eliminarTarea` se probaran de forma aislada y que `app.js` quedara solo como adaptador entre eventos y lógica.

La prueba que más confianza nos dio fue la de `cambiarEstado`, porque verifica que `map()` produce una colección nueva sin mutar el objeto original: cambia el estado de la tarea correcta, no altera las demás y, si el `id` no existe, conserva el contenido. Esa prueba protege una regla central (inmutabilidad) y nos dio una red de seguridad real: si un refactor rompía el comportamiento, la suite lo detectaba de inmediato.

---

## Pair Programming

Registra por misión quién fue **Driver** y quién **Navigator**. Intercambien roles con frecuencia y no hagan commit hasta que ambos puedan explicar el código y la prueba.

| Misión | Driver | Navigator |
|---|---|---|
| 0 · Comprender antes de cambiar | Laura Beatriz Ruiz Oros | Oliver |
| 1 · Cambiar el modelo (string → objeto) | Oliver | Laura Beatriz Ruiz Oros |
| 2 · `crearTarea` + primera prueba | Laura Beatriz Ruiz Oros | Oliver |
| 3 · `agregarTarea` | Oliver | Laura Beatriz Ruiz Oros |
| 4 · `buscarTarea` (`find`) | Laura Beatriz Ruiz Oros | Oliver |
| 5 · `obtenerPendientes` / `obtenerTerminadas` (`filter`) | Oliver | Laura Beatriz Ruiz Oros |
| 6 · `cambiarEstado` (`map` + spread) | Laura Beatriz Ruiz Oros | Oliver |
| 7 · `eliminarTarea` | Oliver | Laura Beatriz Ruiz Oros |
| 8 · `obtenerResumen` | Laura Beatriz Ruiz Oros | Oliver |
| 9 · Integrar con la interfaz | Oliver | Laura Beatriz Ruiz Oros |
| 10 · Refactor final | Laura Beatriz Ruiz Oros | Oliver |
| 11 · Nuevo requerimiento | Oliver | Laura Beatriz Ruiz Oros |