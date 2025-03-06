# Dashboard de Datos Financieros

Este proyecto es un Dashboard de Datos Financieros desarrollado con **React** y **TypeScript**. La aplicación simula la visualización de precios de acciones y permite al usuario:

- Filtrar datos por rango de fechas.
- Seleccionar acciones específicas para visualizar en un gráfico de líneas interactivo.
- Consultar tarjetas informativas con el precio actual y la variación (con indicadores de subida/bajada).
- Visualizar los datos en dos modos: **histórico** y **en vivo**.
- Conservar las preferencias del usuario (rango de fechas, selección de acciones y visibilidad de las series en el gráfico) mediante persistencia local.

## Instalación

1. **Descomprima el .Zip**
2. **Instalar las dependencias**
   -npm install --legacy-peer-deps

   o, si usas Yarn:

   -yarn install

3. **Inicialice el proyecto**
   -npm run dev

   o, si usas Yarn:

   -yarn dev

## Decisiones de Diseño

### Composición y Modularidad

- **Componentes Reutilizables:**  
  La aplicación se compone de varios componentes modulares:

  - **DashboardLayout:** Contenedor principal del Dashboard.
  - **FinancialCard:** Tarjeta que muestra el precio actual, la variación y el símbolo de la acción.
  - **TemporalFilter:** Permite seleccionar un rango de fechas a través de opciones predefinidas ("Últimos 7 días", "Último mes", "En vivo") y el modo "Personalizado".
    - Se implementó persistencia separada para el rango personalizado (almacenado en `customDateRange`) y el modo activo (almacenado en `filterMode`), de modo que el rango personalizado se conserve entre cambios de filtro.
  - **FinancialChart:** Componente combinado reutilizable que muestra el gráfico en dos modos:
    - **Histórico:** Se genera a partir de los datos filtrados.
    - **En Vivo:** Utiliza el hook personalizado `useLiveFilterChartData` para simular actualizaciones en tiempo real, con persistencia local para mantener la visualización tras recargar la página.
  - **ChartLegend:** Componente de leyenda personalizado que permite alternar la visibilidad de cada línea en el gráfico de forma persistente.

- **Hooks Personalizados:**  
  Se crearon hooks como:
  - `useMinMaxDates`: Determina la fecha mínima y máxima de los datos financieros.
  - `useFilteredFinancialData`: Filtra la data en función del rango de fechas y la selección de acciones.
  - `useLiveFilterChartData`: Simula actualizaciones en vivo del gráfico, aplicando la misma lógica que en las tarjetas (selección aleatoria de precios) y guardando el estado en localStorage.
  - `useLocalStorage`: Gestiona la persistencia de estados en el navegador.

### Optimización

- **Memorización y Callbacks:**  
  Se utiliza `useMemo` para evitar cálculos innecesarios y `useCallback` para memorizar funciones (por ejemplo, `handleRangeChange` y `toggleSymbol`).
- **Separación de Lógica de Actualización y Persistencia:**  
  En el hook `useLiveFilterChartData` se separa la actualización interna (cada segundo) de la escritura en localStorage, asegurando que el intervalo de actualización se mantenga constante y que el estado se persista sin bloquear el render.
- **Eficiencia en el Renderizado:**  
  La lógica para mostrar el gráfico en vivo se encapsula en un único componente (`FinancialChart`), que decide qué modo mostrar (en vivo o histórico) según una prop, evitando duplicación de código.

### Accesibilidad y Diseño Responsivo

- **Etiquetas Semánticas y ARIA:**  
  Se utilizan etiquetas semánticas como `<figure>` y `<figcaption>` para el gráfico, junto con atributos `aria-label` y `aria-live` para mejorar la accesibilidad.
- **Diseño Responsivo:**  
  Los controles y botones (por ejemplo, en el TemporalFilter) están diseñados con TailwindCSS para adaptarse a diferentes tamaños de pantalla, asegurando una experiencia óptima en dispositivos móviles y de escritorio.

### Gestión de Estados y Persistencia

- **Persistencia Local:**  
  Se utiliza el hook `useLocalStorage` para guardar y recuperar:
  - El rango de fechas seleccionado y el rango personalizado (almacenados por separado).
  - La selección de acciones a visualizar.
  - La visibilidad de las series en el gráfico (por ejemplo, qué líneas están ocultas).
- **Manejo de Datos Asíncronos:**  
  La obtención de datos se realiza mediante una función asíncrona en un `useEffect`, que actualiza estados de carga (`isLoading`) y de error (`fetchError`), mostrando mensajes y un spinner en la interfaz cuando es necesario.

### Actualización en Tiempo Real (Simulada)

- **Hook de Actualización en Vivo:**  
  El hook `useLiveFilterChartData` simula actualizaciones en vivo:
  - Actualiza el gráfico cada segundo (o según el intervalo definido) usando `setInterval`.
  - Selecciona aleatoriamente algunos símbolos para actualizar su precio (usando funciones como `pickRandomSymbols` y `pickRandomPrice`), replicando la lógica de las tarjetas.
  - Recorta de golpe los datos excedentes para limitar el eje X a un máximo (por ejemplo, 20 puntos).
  - Guarda el estado del gráfico en localStorage, permitiendo que la visualización se mantenga tras recargar la página.

### Implementación de WebSockets (Opcional)

- **Conexión en Tiempo Real:**  
  Para una actualización en tiempo real más robusta se podría:
  - Establecer una conexión WebSocket para recibir datos actualizados en tiempo real.
  - Actualizar el estado global o local en función de los mensajes recibidos, sincronizando la visualización en tarjetas y gráfico.
  - Mejorar la eficiencia y la sincronización de los datos sin depender de intervalos fijos.

## Conclusión

El proyecto sigue buenas prácticas en cuanto a:

- **Modularidad y Reutilización:**  
  Componentes y hooks personalizados que facilitan el mantenimiento y escalabilidad del código.
- **Optimización:**  
  Uso de `useMemo` y `useCallback` para evitar renders innecesarios y separación clara entre la lógica de actualización y la persistencia.
- **Accesibilidad y Responsividad:**  
  Inclusión de etiquetas semánticas, atributos ARIA y diseño adaptativo con TailwindCSS.
- **Gestión de Estados y Persistencia:**  
  Uso de `useState` y `useLocalStorage` para mantener las preferencias del usuario entre sesiones.
- **Actualización en Tiempo Real (Simulada):**  
  Un hook específico que simula la actualización de precios en vivo, manteniendo la visualización consistente tras recargar la página.

Esta arquitectura permite un código limpio, modular y escalable, adaptándose a futuras mejoras como la integración de WebSockets o la incorporación de pruebas unitarias.
