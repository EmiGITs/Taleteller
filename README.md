# Taleteller Version 2
Alexa Skill (Proyecto)



Skill Alexa
Contador de cuentos/Taleteller
Prueba 2


Alcanzado en esta versión
En esta versión del lambda se omite usar el _getText para recibir el texto del cuento ya que el KeyValue para obtener el link no es especificado por el usuario al faltar un intent en que el usuario nombre la opción que desee (Hay un concepto más adelante en el texto).

Se realizó la base para el próximo prototipo en que el usuario tiene que interactuar con el skill para elegir que opción desea, de momento el usuario no es capaz de continuar el skill y seleccionar la opción ya que no hay un intent dedicado a ello, de todas formas, el skill ya nombra al usuario de forma aleatoria los cuentos disponibles

 
Para esto se sigue la siguiente estructura  
La base de datos comprende la siguiente estructura (Importante que se añadieron más atributos respecto a la versión anterior)

 
La función _getName funciona de la misma forma que _getLink (Tambien omitido en esta versión), el KeyValue (que en la base de datos de arriba seria storyID) es buscado en cada pasada en el array result ya que se generó de forma aleatoria, luego busca con ProjectionExpression el nombre, siendo este storyName, una vez encontrado devuelve esto por medio de promise en la variable result, este result es almacenado en Array en cada pasada.

Cómo funcionan las mayorías de funciones se encuentra en los comentarios del código.


Lo que se tiene que completar
Como se dijo falta realizar un intent que permita decidir al usuario decidir que opción quiere de las mostradas, se podría seguir la siguiente estructura. 

Como se dice en la estructura se tiene que añadir un .reprompt en StoryIntent ya que el skill no finaliza, sino que sigue esperando input del usuario (Se dejó comentado en el StoryIntent donde se podría añadir esta opción), para poder lograr que el usuario elija múltiples opciones se pueden usar intents + slots (Antes de realizar esto crear un intent con slot que simplemente muestre la opción elegida en consola, como demostración)

Estos intents+slots se hacen igual que todos los intents desde la página en que se configura y prueba el skill de Alexa, luego se refiere a este en la función lambda.

