# Generador de imágenes Ace Attorney

**Programa creado para incrementar la velocidad haciendo imágenes para el juego de Nintendo 3DS "Ace Attorney Trilogy".**

Leer en otros idiomas: [Português do Brasil](README.pt-br.md), [English](README.md).*

[Enlace](https://leomontenegro6.github.io/aaig/)

[Enlace - Mirror](http://www.romhacking.net.br/tools/aaig/)

"Ace Attorney Trilogy" es un juego muy grande, con muchas imágenes a editar:

*   Botones blancos con texto en color rojo vino;

![alt tag](images/button_bg_filled.png)
*   Nombres de pruebas / perfiles, con fondo gris oscuro y texto en color naranja;

![alt tag](images/proof_profile_title_bg_filled.png)
*   Subtítulos de pruebas / perfiles, con fondo verde y texto en color gris oscuro;

![alt tag](images/proof_profile_subtitle_bg_filled.png)
*   Descripciones de pruebas / perfiles, con fondo gris oscuro y texto en color blanco;

![alt tag](images/proof_profile_description_bg_brown.png)

La manera tradicional de editar estas imágenes es a través de archivos .PSD en Adobe Photoshop, que acaba siendo una tarea muy pesada y repetitiva. Esa es la principal razón por la que este software fue creado.

"Generador de imágenes Ace Attorney" es un programa que puede generar imágenes para el juego "Ace Attorney Trilogy". Para su creación, fue usado:

*   Web Version
    *   HTML5, para la creación de la web;
    *   CSS3, para el estilo del texto en la imagen;
    *   JavaScript y [jQuery](https://jquery.com/), para campo' y botones' en cuestiones de programación;
    *   [Html2canvas](http://html2canvas.hertzen.com/), para la conversión de elementos HTML a PNG;
    *   [Bootstrap](http://getbootstrap.com/), para hacer la web adaptativa;
    *   [Bootstrap Slider](https://github.com/seiyria/bootstrap-slider), para los campos de margen;
    *   [Select2](https://select2.org/), para instanciar campos select adaptables, con suport a la interpretación HTML y búsqueda en ajax;
    *   [stash](http://rezitech.github.io/stash/), para el almacenamiento de configuraciones locales del usuario, como tema e idioma;
    *   [JSZip](https://stuk.github.io/jszip/), para crear archivos comprimidos con imágenes;
    *   [FileSaver.js](https://github.com/eligrey/FileSaver.js/), para guardar archivos en el lado del cliente, necesarios para la generación de imágenes por lotes;
*   Versão Desktop
    *   [Electron.js](https://electronjs.org/), para la conversión del contenido web del programa a una aplicación de escritorio multiplataforma;
    *   [system-font-families](https://github.com/rBurgett/system-font-families), para leer las fuentes instaladas en la PC del usuario y montar un campo selector de fuente (APENAS DESKTOP).

#### Requisitos

*   Un navegador moderno. Google Chrome es recomendado, ya que hay algunas diferencias en el comportamiento del CSS en algunos navegadores como Firefox, Safari o IE;
*   La fuente "Arial" instalada en el ordenador. Es necesaria para la correcta creación de imágenes, así como los botones (Si usas algún SO de Windows puedes omitir esto);
*   La fuente "Vaud Book" instalada en el ordenador. Es necesaria para la correcta creación de imágenes, así como descripciones de pruebas / perfiles;
*   APENAS SERVIDRO WEB: Un servidro web. El software no funcionará si no se cumple el requisito¹.

¹ Si se aloja de manera local, la creación de imágenes (conversión de elementos HTML &lt;canvas&gt; a imágenes PNG) puede desencadenar un [error de seguridad no capturado de cuadros contaminados], rechazando cualquier intento de exportación de datos (http://stackoverflow.com/questions/22710627/tainted-canvases-may-not-be-exported) .Por lo tanto, recomendamos ejecutar este software a través de un servidor web (Apache2, por ejemplo), aunque sólo sea para servir archivos a clientes.

#### ¿Como usar?

1.  Selecciona tipo de imagen, pinchando en "Botones", "Pruebas / nombres", etc;
2.  En el campo de texto, escribe para que se muestre en la imagen;
3.  Opcional: Si es posible, cambiar variables de plataforma, escala, fuente y márgenes para el texto escrito;
4.  Opcional: Si es necesario usar fuentes externas, realizar lo siguiente:
    *   En el campo "Fuente", elegir "Otra";
    *   En el campo de texto de la derecha, escribir el nombre de la fuente;
    *   Una vez escrita, el navegador comenzará a usarla y a mostrar el resultado abajo;
5.  Después de cambiar los valores de los campos de cualquier formulario, la imagen se actualiza automáticamente en la vista previa. Cambie los campos de formulario como desee y compruebe si la vista previa coincide con sus necesidades;
6.  Recomendado: deshaga cualquier configuración de zoom personalizado en su navegador web, ya que esto puede resultar en imágenes generadas erróneamente. Mantenga los ajustes de zoom siempre en los valores predeterminados (100%);
7.  Haga clic en el botón "Generar" y la imagen se generará y guardará automáticamente en formato PNG. El nombre de archivo se ajustará al texto que escribió en los campos del formulario;
8.  Opcional: Si se estropea todos los valores predeterminados, haga clic en el botón "Resetear" y todos ellos se restablecerán a sus valores predeterminados.

#### Imágenes Generadas

![alt tag](images/sample_1.png)
![alt tag](images/sample_2.png)
![alt tag](images/sample_3.png)

#### Feedback

Si se encuentra algún error, contactar a:

*   [Foro de romhacking y traducción brasileño (Fórum Unificado de Romhacking e Tradução - FURT)](http://www.romhacking.net.br/)
*   [Chat de FURT en Discord](https://discord.gg/0V2rK6RK47Okravl)