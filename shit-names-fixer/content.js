const nameMap = {
  "Cultura Judia Iii 5": "Cultura de JEWS",
  "Filosofia 5": "Filosofia",
  "Quimica 5": "Quimica",
  "Educacion Fisica 5": "Edu fisica",
  "Historia": "Sistemas operativos",
  "Estructura Y Funcionamiento De Sistemas": "-----",
  "Seminario De": "Marketing",
  "Desarrollo De Aplicaciones": "Desarrollo Apps",
  "Desarrollo De Proyectos": "Proyecto",
  "Tecnologia De La Informaci": "Startapp",
  "Educacion Judia": "Educacion de JEWS",
  "Sistemas Embebidos": "UX/UI",
  "Eduardo": "YO"
};

function renameWithMap() {
  const spans = document.querySelectorAll('.contenidoConURLVisualizado a span');
  
  spans.forEach(span => {
    for (const [oldName, newName] of Object.entries(nameMap)) {
      if (span.textContent.includes(oldName)) {
        span.textContent = newName;
      }
    }
  });
}

renameWithMap();
setTimeout(renameWithMap, 1000);