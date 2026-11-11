# Estudio 3D general

## Versión 11: cualquier película, sin primera persona

El estudio ya no está enfocado en el terror. Sirve para cualquier película o corto: comedia, acción, romance, ciencia ficción, cuento infantil, documental, drama.

- **«Generar video» configura todo solo.** Con IA, la IA elige género, luz, color, hora del día, música, cámara, subtítulos y duración según la idea. Sin IA (motor local), el texto decide el género y el ambiente.
- **Sin primera persona.** Se quitaron la cámara en primera persona, el modo «Caminar yo», la escuela explorable y sus efectos (manos, sangre en la lente, pantalla que late, cordura, párpados).
- **Sin herramientas de terror en la interfaz.** Se quitaron los presets, las recetas de terror de la IA, los instrumentos de muerte, el corto de las 3:33 y los cortos de muestra «La vigilia» y «La escuela».
- **Nuevos géneros:** acción, romance y documental (se suman a aventura, ciencia ficción, comedia, cuento infantil y drama).

Las secciones de abajo describen funciones de la versión anterior. Varias ya no aparecen en la app; se conservan como historial.
La biblioteca de personajes, objetos y sonidos sigue siendo la misma. La IA puede usar las piezas macabras si la idea las pide.

## Sonidos

La carpeta `sonidos/` contiene 12 efectos WAV que la IA puede usar en cada plano (campo `sfx` en `shots`). El catálogo (id, descripción y cuándo usarlo) está en `js/app.js`, en la sección «Biblioteca de sonidos».

Para que los efectos suenen, el proyecto debe abrirse desde un servidor local, porque el navegador no permite cargar archivos de la carpeta si abres `index.html` con doble clic. Por ejemplo, desde esta carpeta: `python3 -m http.server 8000` y luego abre http://localhost:8000.

El motor local (sin IA) todavía no usa estos efectos; solo los usan los motores con IA.


## Villanos (v2)

Monstruo, zombi, esqueleto, payaso, Slender, muñeca, araña, fantasma, espantapájaros, tentáculos y cultista tienen modelos nuevos (articulaciones, cabeza que sigue al héroe, mandíbula, desgaste) y un movimiento propio:

- La marcha sigue la velocidad real de la criatura (no patina) y se inclina al avanzar y al girar.
- Cada una avanza a su ritmo: el zombi arrastra una pierna a tirones, el payaso se detiene y da saltitos, la araña da arrancones, el monstruo acecha y se agazapa antes de saltar.
- Slender, la muñeca y el espantapájaros se quedan quietos cuando la cámara los mira; el zombi y el fantasma ignoran la cámara.


## Gore (ambiente y restos)

- Con «Sangre y charcos» activado, cada escena se tiñe: luces rojas junto a vísceras y reses, niebla y fondo con un tinte de sangre.
- Vísceras y reses llevan moscas y vapor; el colgado (`hanged`) gotea sangre al suelo.
- Acciones de personaje nuevas: `drag` (cuerpo arrastrado, deja estela) y `haul` (quien lo arrastra). La víctima (`person` con `moves`) deja charco creciente, manchas y salpicaduras; el atacante queda con sangre en las manos y cuchillo al apuñalar.


## Personajes (v3, por tandas)

Se les da más forma de tres en tres. Mismos pivotes (hombro, codo, cadera, rodilla, cola), así que marcha, ataques, caídas, sangre y cuchillo siguen funcionando.

- **Tanda 1:** `person` (cuello, mandíbula, nariz, orejas, pelo, hombros, codos, manos con pulgar, cinturón, zapatos con suela), `robot` (cabeza ovalada con visor y orejas, núcleo luminoso, rejillas, hombros y articulaciones esféricas, antebrazos y manos con dedos, pies) y `dog` (pecho, ancas, cuello, cráneo, hocico, orejas caídas, mancha del lomo, patas con almohadillas, cola con punta clara).
- **Tanda 2:** `cultist` (capucha con borde y punta, capa sobre los hombros, mangas acampanadas con puños rojos, manos, banda y cuerdas, medallón y dobladillo rasgado), `zombie` (camisa hecha jirones, vientre abierto con costillas, pelo a mechones, cuencas, cejas, nariz y mejillas hundidas, oreja arrancada, hueso a la vista, pies descalzos) y `skeleton` (huesos largos con articulaciones, clavículas, caja torácica de 6 costillas, pelvis con alas y sacro, cráneo con pómulos, maxilar y mentón).
- **Tanda 3:** `monster` (cráneo con hocico y ceja marcada, cuernos de dos tramos, orejas, púas en mejillas y frente, mandíbula con colmillos y boca incandescente, hombros con pelaje y púas, grietas de brasa, columna de espinas, taparrabos rasgado, antebrazos con pinchos, manos con nudillos y garras, pies con garras y espolón), `clown` (peluca verde con mechones, ojos con rombos y lágrimas pintadas, mejillas, sonrisa con dientes, sombrero con ala y pompón, gorguera de volantes, lunares, remiendos, manchas de sangre, mangas con volantes, guantes con dedos, zapatones con suela y puntera roja, ahora con rodillas) y `slender` (cuello, cara sin rasgos con huecos sutiles, traje con solapas, corbata, camisa, botones, hombreras, pañuelo, faldón, brazos con codos, puños blancos y manos de cinco dedos, zapatos de punta, rodillas y seis tentáculos de dos tramos).
- **Tanda 4:** `doll` (vestido con tres volantes y puntilla, corpiño con faja y lazo, cuello con gorguera, mangas abullonadas, manos con dedos, peluca con rizos y bandas, lazo en el pelo, ojo vacío y ojo rojo con pestañas, grietas de porcelana, mejillas, boca cosida con dientes, zapatitos), `spider` (patas con cadera, fémur, rodilla clara, tibia, cerdas y garra con punta; abdomen con cerdas e hilanderas, caparazón, quelíceros con base, pedipalpos, boca y 8 ojos) y `scarecrow` (poste y travesaño, camisa con parches, remiendos y costuras, soga en la cintura, paja que asoma por cuello, vientre, mangas y pantalones, sombrero con ala rota, cara de saco con ojos cosidos en X, nariz y boca cosida, cuervo posado en el travesaño, botas con suela).
- **Tanda 5:** `ghost` (sábana en capas con hombros y capucha, agujeros de polilla, 9 jirones con colas difusas, ojos huecos con brillo, cejas, lágrimas, boca con luz, cadena rota colgando, puños con grilletes y manos de cinco dedos, mechones flotando), `tentacle` (base de roca con baba, 8 colmillos, ojo grande con párpados y venas, dos ojos pequeños, 7 tentáculos con anillos, ventosas en dos filas, puntas brillantes con púas) y `bird` (cuerpo con pecho claro, cuello, cabeza con cresta y mejillas, pico de dos piezas, ojos con brillo, alas con plumas primarias y secundarias, cola de 5 plumas, patas con dedos).

## Personaje nuevo: doctor de la peste (`plague`)

Verdugo silencioso de 2.3 de alto: máscara de pico de hueso con lentes rojos incandescentes y mandíbula que se mueve, sombrero de ala ancha con pluma, capucha, abrigo largo rasgado en el dobladillo, delantal de cuero manchado de sangre, esclavina con tachuelas, cinturón con bolsa, frascos verdes y hierbas, guantes negros. Lleva una **sierra ensangrentada** (gotea) en la mano derecha y un **farol verde** que pulsa en la izquierda.

- Se desliza bajo el abrigo como el cultista (mismos pivotes), así que marcha, ataques, `stab`, `punch`, giros de cabeza y sangre funcionan igual.
- Está en el menú («Doctor de la peste»), en el catálogo de la IA, en la lista de villanos de terror y se detecta al escribir «doctor de la peste», «médico de la peste» o «máscara de pico».


## Entorno vivo (v4, por tandas)

Requiere «Interacción con el entorno» activado. Se mejora de dos en dos; los personajes que aún no están en su tanda se mueven exactamente como antes.

**Capa común** (en `js/app.js`, «Percepción del entorno»): al armar cada escena se construye un mapa del decorado que reconoce
- **sólidos**: árboles, rocas, casas, coches, graneros, restos de coche, barcas, cohetes, altares, colgados… y también **todo lo armado a mano** (muros, cajas, columnas, barriles; cajas giradas incluidas). Se ignoran alfombras bajas, techos y objetos flotantes;
- **manchas y restos** en el suelo (charcos, vísceras, reses, miembros, cabezas, pentagramas);
- **puntos de interés** (restos, velas, calabazas, tumbas, lámparas, altares), **luces** y **límites del suelo** (el plano más grande);
- **cuerpos tendidos** y **puertas que se abren**.

**Tanda 1: `person` y `plague`**
- **Rodeos planificados**: antes de rodar se revisan sus `moves`; si un tramo cruza un muro o un obstáculo se inserta el camino más corto por las esquinas. Los tiempos de llegada y las acciones (`stab`, `drag`, `face`…) no cambian, así que la escena sigue sincronizada. Si no hay rodeo posible, se detienen en la cara por la que llegaron en vez de atravesar.
- **Esquiva en vivo**: rodean por un solo lado (sin dudar), no se pisan entre sí y no salen del suelo. La persona además **no pisa charcos ni restos**; el doctor sí los cruza. Nada de esto se aplica mientras hay una acción de escena (`stab`, `punch`, `drag`, `haul`, `fall`, `beaten`, `brutal`).
- **Mirada**: la cabeza de la persona (nuevo `envlook`) y la máscara del doctor siguen lo que atiende: criaturas y verdugos, cuerpos tendidos, restos, puertas que se abren, compañeros. El doctor vigila a su presa, pero un cuerpo a menos de ~3 m le roba la mirada.
- **Gestos**: ante un cuerpo o unas vísceras, la persona se lleva las manos al pecho y se echa atrás; el doctor alza el farol y se inclina para examinarlo.
- **Reconocimiento de amenazas**: la persona ahora también reacciona al doctor de la peste y al cultista (con más suavidad que ante una criatura: se detiene, lo mira y retrocede un poco, salvo que ya esté actuando la escena). Si se acerca una criatura, huye hacia la luz más cercana (farola, vela, calabaza) en lugar de en línea recta.
- El héroe, además, inspecciona cabezas, miembros, altares y restos de coche (`INS`).

**Siguientes tandas:** basta añadir el personaje a `PERC` (y, si hace falta, un perfil en `envGaze`). Propuesta: cultista y zombi (comparten pivotes con el doctor).



## Físicas (v5)

No hay un motor de físicas externo: todo se calcula en `js/app.js` y cada fotograma sale solo del tiempo `t` (así el vídeo se graba igual siempre). Esta tanda mejora tres cosas:

**Modo «Caminar yo» (primera persona en vivo)**
- **Choques**: ya no se atraviesan muros, cajas, columnas, árboles, casas ni tumbas. El jugador (radio 0,34 m) se desliza por la superficie en lugar de quedarse pegado. Usa el mismo mapa del decorado que el entorno vivo (`envMap`) y funciona aunque «Interacción con el entorno» esté apagada.
- **Inercia**: acelera y frena con suavidad; en el aire conserva el impulso. En diagonal con teclado ya no va más rápido (antes ×1,41).
- **Salto y gravedad**: Espacio salta (9,8 m/s², apogeo ≈ 0,94 m). Se puede saltar sobre cajas y muros bajos y subirse encima. Al aterrizar la cabeza cae sobre un muelle amortiguado y suena un golpe sordo.
- **Cámara**: el balanceo de los pasos depende de la velocidad real, se ladea un poco al desplazarse de lado y el campo de visión se abre al correr.

**Criaturas que acechan** (payaso, zombi, esqueleto, hombre alto, monstruo, muñeca, araña, espantapájaros, fantasma): al acercarse al héroe ya no atraviesan árboles, rocas, casas ni muros; los rodean y se deslizan. Si empiezan dentro de un sólido no los expulsa de golpe. Los personajes con `moves` y las criaturas guionizadas no cambian.

**Clima**
- **Lluvia**: cae inclinada y, al tocar el suelo, cada gota deja un anillo que se abre con una gotita que rebota.
- **Nieve, polvo, brasas, niebla y luciérnagas**: viento en ráfagas. Las partículas ligeras se dejan llevar más y reaparecen por el lado contrario al salir del área.

Código común (reutilizable por otros personajes): `solidPush`, `solidInit`, `groundAt`.

**Entorno**
- **Puertas**: se abren con un muelle amortiguado (arrancan con inercia, se pasan un poco y se asientan) en lugar de un movimiento lineal.
- **Árboles, pinos y flores**: se mecen con la misma ráfaga de viento que mueve la nieve, el polvo y las brasas (`gust(t)`), así decorado y clima van a la par.

## Detalles macabros (v6)

Siete decorados nuevos en la biblioteca (menú «Formas de terror», catálogo de la IA y modo local). Todos se construyen con piezas pequeñas y subgrupos, y el menú «Sangre y charcos» y «Restos y vísceras» los reparten solos:

- `skullpile`: pila de calaveras (con cuencas, mandíbula y dientes) y huesos sueltos sobre un charco.
- `chains`: viga con cadenas oxidadas y grilletes ensangrentados que se mecen y gotean.
- `cobweb`: telaraña grande (8 radios y 3 anillos con comba) con una araña colgando.
- `rats`: cuatro ratas de ojos rojos royendo carne y huesos; se crispan.
- `bloodwall`: muro con cinco manos sangrientas (palma, dedos y pulgar) y churretes que bajan.
- `cage`: jaula colgante de hierro con una calavera y huesos dentro; se mece.
- `jars`: estantería con frascos de líquido verde con ojos que laten, cerebros y dientes.

`skullpile`, `bloodwall` y `jars` son sólidos (no se atraviesan ni se esquivan en vivo) y los personajes los miran al pasar. En «Terror extremo: macabro» la IA los usa en rituales y tumbas.

## Lo que te mira (v7)

Siete decorados más, centrados en el miedo a ser observado. Nueva animación `blink` (parpadeo):

- `dolls`: tres muñecas de porcelana ahorcadas del techo que se mecen; una tiene un ojo rojo brillante y vestido manchado.
- `wallfaces`: muro del que surgen cuatro rostros con la mandíbula abierta que se mueve, y manos que empujan desde dentro.
- `eyewall`: muro cubierto de ojos que parpadean cada uno a su ritmo, con venas sangrientas.
- `mirror`: espejo agrietado con una silueta oscura de ojos rojos detrás del cristal y una mano sangrienta.
- `eyetree`: árbol muerto con ocho ojos que parpadean y una boca de dientes que gotea sangre.
- `crows`: poste con un cuerpo atado y cuatro cuervos que picotean y se crispan.
- `saltcircle`: círculo de sal con runas de sangre, seis velas negras con llama que parpadea y una calavera en el centro.

Reparto automático: con «Sangre y charcos» o «Restos y vísceras» cada escena recibe una selección al azar de los 14 detalles macabros (2 normalmente, 5 con «Escena sangrienta»), así cada plano trae los suyos y no se agota el límite de 900 piezas por escena. Los de pared van al fondo y los demás por el suelo. `eyetree`, `eyewall`, `wallfaces` y `mirror` son sólidos.


## Escuela abandonada (modo exploración)

Escribe «escuela», «colegio», «instituto» o «aula» en la idea y pulsa «Generar video»: se monta, sin IA y sin clave, un edificio oscuro de 30 x 30 m que se recorre en primera persona (W A S D, ratón o dedos; Espacio salta; «Terminar» guarda el vídeo). Fuerza el modo «Caminar yo» y enciende la linterna si estaba apagada.

- **Planta:** pasillo principal con taquillas, pasillo transversal con el techo derrumbado (haz de luz azul), 4 aulas con pupitres volcados y pizarras con garabatos de sangre, baño, despacho, biblioteca con círculo ritual y salón de actos con escenario y altar. Las puertas están entreabiertas y todo tiene choques.
- **Macabro:** ahorcado en el pasillo, muñecas colgadas, rostros en la pared, muro de manos, muro de ojos, espejo, tarros, ratas, cadenas, calaveras y charcos; luces roja de emergencia, verde enfermiza y de velas.
- Funciona junto con «Detalles macabros en primera persona» (voces, párpados, sangre en la lente).


## Movimientos macabros (v8)

Doce acciones nuevas para `moves` (campo `act`), pensadas para que las escenas de terror se *muevan* como cine y no como maniquíes. Funcionan en `person`, `cultist`, `plague`, `zombie` y `skeleton` (los que tienen brazos con pivote); los brazos y el cuerpo se mezclan con suavidad con la acción anterior, igual que `stab` o `fall`. Cada una trae su propio sonido (gritos, jadeos, huesos) sin que la IA tenga que pedirlo.

| Acción | Quién | Qué hace |
|---|---|---|
| `plead` | víctima | de rodillas, manos juntas temblando, sollozo que sube y baja |
| `sob` | cualquiera | encorvado, cara entre las manos, hombros que se sacuden |
| `scream` | cualquiera | cabeza atrás, manos en la cabeza, temblor, grito |
| `choke` | víctima | agarrada del cuello: forcejea, patalea, se eleva un palmo y se va apagando hasta quedar con los brazos caídos (6 s; sigue con `fall`) |
| `strangle` | atacante | a un metro de la víctima, ambos brazos al frente a la altura del cuello, se inclina empujando |
| `convulse` | víctima tendida | espasmos con arqueo que se espacian y se apagan; sangra y salpica |
| `rise` | cuerpo tendido | tras `fall` o `convulse`, se incorpora a sacudidas, sin plegar las rodillas: el muerto que despierta |
| `possess` | cualquiera | rígido, flota un palmo y se sacude a tirones secos (cada ~0,3 s, al azar pero repetible) |
| `worship` | cultista, doctor | brazos en alto, balanceo lento y canto; en grupo, al unísono |
| `peek` | protagonista | se asoma de lado, espía y se retira |
| `creep` | protagonista | **andando**: agachado, silencioso, mirando al frente |
| `limp` | herido | **andando**: se aprieta el vientre y cojea |

`creep` y `limp` se usan en un paso que *camina*; las demás, en un paso quieto (repetir la posición).

**Cámara nueva:** `creep` (acecho lento: se acerca despacio con un leve vaivén) y `vertigo` (travelling con zoom contrario, para el instante en que el protagonista comprende). Ambas están en la lista de movimientos del editor.

**Guion de cine para la IA** (en la caja de herramientas de terror): una muerte tiene tres tiempos (`strangle`+`choke` → `fall` → `convulse` → silencio y plano de detalle); un despertar es `fall`/`convulse` → varios segundos de quietud → `rise` → `possess` mirando al protagonista; el ritual canta con `worship` mientras ocurre el sacrificio.

### Cortometraje de muestra, sin IA

Escribe «vigilia», «velatorio» o «corto de muestra» en la idea y pulsa «Generar video»: se monta *La vigilia* (36 s, 2 escenas, 9 planos) sin clave de API. Una mujer entra con `creep` a una capilla donde un culto vela un ataúd, se asoma con `peek`, ve una muerte completa (`plead` → `choke`/`strangle` → `fall` → `convulse`), reacciona (`horror`, `recoil`, `sob`) y el muerto se levanta (`rise` → `possess`) mientras el doctor y los cultistas cantan con `worship`. Usa las dos cámaras nuevas. Sirve también como guion de referencia para escribir los tuyos.


## Carretera de noche (muestra sin IA)

Escribe en la idea algo como «vamos en auto por una ruta muy fea y chocamos» (necesita «auto» o «coche» junto a «ruta», «carretera», «camino» o «choque») y pulsa «Generar video»: se monta, sin IA y sin clave, *La ruta del norte* (unos 17 s, 3 escenas). Un coche avanza de noche por una carretera de tierra con baches, piedras, árboles muertos y lluvia; choca contra un árbol en mitad de la calzada, con golpe de sonido y sacudida de cámara; y después la cámara se queda con los restos y con alguien que camina hacia el coche.


## La IA con todas las herramientas («✨ Automático»)

En «Automático» la IA ya no se limita a los ajustes de terror: también decide la pantalla de cámara de seguridad (`cam`, `nights`, `wake`), el congelado final (`frz`, `fzs`), los subtítulos (`subs`, `subsz`), los créditos (`cred`), el desenfoque de movimiento (`blur`), la interacción con el entorno (`env`) y el combate (`atk`). Además puede pedir el corto de la persona que se levanta a las 3:33 con `corto333`, que prepara la plantilla entera y la apaga al terminar para no ignorar tus siguientes ideas.

Se queda en tus manos lo que depende de tu equipo o de tu gusto: resolución, volumen de la música, nombre del director, clave y modelo.

La caja de herramientas del director de IA (género «Terror») incluye ahora **accidentes y choques** (coche por carretera de tierra, golpe de sonido, sacudida de cámara y `wreck` con sangre en la escena siguiente), y «Automático» tiene una receta de **accidente de carretera**. El motor local también la reconoce al escribir «choque», «accidente» o «volcó».


## Más herramientas macabras (v9)

Seis decorados nuevos y cuatro herramientas en Configuración (puntos 52 a 55). Todo funciona con o sin IA, y «✨ Automático» también puede activarlas.

**Instrumentos de muerte** (menú «Forma», catálogo de la IA y punto 52)
- `guillotine`: guillotina con la cuchilla en alto y ensangrentada, bascula y cesta con una cabeza.
- `gallows`: horca con trampilla, escalones, taburete caído y una soga con nudo que se mece.
- `ironmaiden`: dama de hierro con las puertas abiertas, púas por dentro y regueros de sangre.
- `operating`: mesa de operaciones con un cuerpo bajo una sábana manchada, lámpara y bandeja con sierra y bisturís.
- `stakes`: cuatro estacas con calaveras empaladas y sangre que baja.
- `well`: pozo con manos pálidas aferradas al borde, ojos rojos en el fondo y un cubo que se mece.

Son sólidos los que bloquean el paso (guillotina, horca, dama de hierro, mesa y pozo) y los personajes los miran al pasar. En el punto 52, «Uno por escena» o «Tres por escena» reparte los instrumentos al azar (mismo resultado cada vez que grabas).

**53 · Mensaje escrito con sangre:** HUYE, NO MIRES ATRÁS, ESTÁ AQUÍ, AYÚDAME o YA ES TARDE. Aparece al 55 % de la película, parpadea y gotea durante 2,6 s.

**54 · Sonidos macabros** (casillas): cadenas que se arrastran a lo lejos, risa de niño lejana con eco y goteo constante con eco.

**55 · Párpados pesados:** dos párpados negros bajan y suben cada vez más seguido; en el último segundo y medio se cierran del todo (salvo que congeles el final).

**Automático:** la IA y el motor local también deciden estas herramientas (por ejemplo «guillotina» o «ejecución» activa los instrumentos y las cadenas; «hospital» o «quirófano», la mesa de operaciones y los párpados).


## Conciencia del actor (v10)

Nuevo ajuste «Conciencia del actor» (Normal / Intensa / Apagada), dentro de «Interacción con el entorno» (que debe estar activada). Amplía lo que la persona y el héroe perciben del entorno; el doctor de la peste y el resto de personajes no cambian. Todo sale del tiempo `t`, así que el vídeo se graba igual siempre.

| Lo que percibe | Cómo reacciona |
|---|---|
| **Oscuridad** (escena de terror o de noche, lejos de farolas, velas o calabazas y sin linterna) | camina encogido y ligeramente inclinado, con los brazos algo adelantados, tanteando |
| **Paredes y sólidos cercanos a oscuras** | apoya una mano en ellos (el brazo del lado de la pared); si la pared está de frente, extiende los dos brazos |
| **Lluvia** | se encorva y se cubre la cabeza con un brazo |
| **Nieve o niebla** | se abraza y tiembla (la niebla, la mitad) |
| **Decorado macabro cerca** (horca, guillotina, colgados, muros de ojos o de manos, dama de hierro, estacas…) | le tiembla el cuerpo según lo cerca que esté; si es alto y lo tiene delante, se tapa la boca |
| **Susto y apagón** | se echa atrás y se protege con los brazos al frente, con un sobresalto que se apaga en unos 1,5 s |

Si está en pleno ataque, caída o cualquier acción de escena, no añade nada. Lo macabro bajo (vísceras, cuerpos) sigue provocando las manos al pecho de siempre, que tienen prioridad. «Intensa» multiplica las reacciones por 1,6.

La IA conoce estas reacciones y puede colocar muros cerca en escenas oscuras o darle un susto o un apagón al héroe en plano medio.
