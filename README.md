# Taleteller

Proyecto de investigación para Seminario de Tecnologia I-II Universidad Caece

Alumnos: Dri Emiliano-Rodriguez Facundo

Para que funcione el skill se debe tener una base de datos DynamoDB enlazada con el lambda (Modificar las varaibles de entorno)

La base de datos tiene la siguiente estructura:

2 Tablas: genreTable y storyDB

Estructura genreTable:
  4 Elementos de 2 variables:
        genreID(Primary Key-Int)-genreName(String)
        1                         Love
        2                         Comedy
        3                         Terror
        4                         Drama
        
Estructura storyDB:

  21 elementos de 4 variables:
    storyID(Primary Key-Int)-genreID(Int que va del 1-4)-storyLink(String)-storyName(String)
    
    X                         1-4 (Puede ser cualquiera) X(Link del s3)     Nombre del cuento
