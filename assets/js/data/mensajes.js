// Cada mensaje se convierte automáticamente en una estrella en el cielo.
// Para agregar uno nuevo, copia un bloque y cambia el id y el texto.
// El id debe ser único (nunca repetido): con él se calcula dónde queda la
// estrella, de qué color es, y se recuerda si ya fue visitada.
//
// Los saltos de línea (\n) se respetan, así que los poemas conservan su forma.
//
// "especial: true" es opcional: esas notas se muestran con un marco dorado,
// para las cartas que pesan más que las demás.

const mensajes = [
  {
    id: "nota-001",
    fecha: "",
    texto:
      "Dicen que los ojos claros son los más hermosos, pero sus ojos son oscuros, grandes, profundos y llenos de vida, sus ojos son como el mar y yo seré quien se pierda y navegue en ellos...",
  },
  {
    id: "nota-002",
    fecha: "",
    texto:
      "Todas las mujeres son hermosas, pero ella... ella parecía una diosa descendida de la hornacina de algún templo con la única intención de robarme en cuerpo y alma...",
  },
  {
    id: "nota-003",
    fecha: "",
    texto:
      "A veces me asusta un poco ser el adulto responsable de la casa y tener tanta responsabilidad.",
  },
  {
    id: "nota-004",
    fecha: "",
    texto:
      "Afortunado aquel que la observó y le bastó para perderse en ella,\naquel que tuvo el valor de traerla al mundo real, sin promesas, sin planearlo, sin la falsa calma al despertar...",
  },
  {
    id: "nota-005",
    fecha: "",
    texto: "Basta con verla y sentirse atrapado por tan bellísimo ser...",
  },
  {
    id: "nota-006",
    fecha: "",
    texto:
      "Irónico es que enamorada de las palabras solamente creyera en los actos...",
  },
  {
    id: "nota-007",
    fecha: "",
    texto:
      "Navegar en su mirada, olvidar el horizonte y descubrirla como nadie más, enseñarle qué es amar por amar y ayudarle a enamorarse de sus defectos, hacer que la pasión reemplace sus temores...",
  },
  {
    id: "nota-008",
    fecha: "",
    texto:
      "Y cómo no pensar en aquellos ojos en los que te pierdes, esos ojos que aunque no quieras te enamoran, esos ojos que sin ser claros son como dos soles...",
  },
  {
    id: "nota-009",
    fecha: "",
    texto:
      "Somos un conjunto de desarmonías que se juntan para crear algo mejor que lo sublime...",
  },
  {
    id: "nota-010",
    fecha: "",
    texto:
      "Amar en los tiempos difíciles y el malograr de los buenos deseos...\nPobre todo aquel que pierde lo que ama, mas peor aún es quien no encuentra qué amar...",
  },
  {
    id: "nota-011",
    fecha: "",
    texto:
      "Las paredes de cristal interiores y las ventanas crean un jardín de reflejos caleidoscópicos de árboles y plantas que se posan sobre tu piel canela y crean así el más bello de los komorebis...",
  },
  {
    id: "nota-012",
    fecha: "",
    texto: "Es muy humano sentir que eres un rehén de tus temores...",
  },
  {
    id: "nota-013",
    fecha: "",
    texto:
      "Surgen las estrellas y cae la lluvia fundiéndose con el llanto del observador, que desde las sombras contempla el alborecer de tu nuevo amor, llevándote a nuevos horizontes, lugares donde no podría seguirte, aun cuando fuese un simple contemplador...",
  },
  {
    id: "nota-014",
    fecha: "",
    texto:
      "Yo sé que puedes, mi pequeño pollito de colores con alma de Terreneitor.",
  },
  {
    id: "nota-015",
    fecha: "",
    texto:
      "No se trata de idealizarte, se trata de reconocer lo mucho que vales.",
  },
  {
    id: "nota-016",
    fecha: "",
    texto: "Estoy muy orgulloso de ti.",
  },
  {
    id: "nota-017",
    fecha: "",
    texto:
      "Tan sabia, segura y firme, con su propia convicción, para su gozo y regocijo personal, está segura que supo amar, razona, piensa y entonces comprende que ella no escondió su esencia; ella, tan sabia, reconoce entonces de forma orgullosa que en todo momento en el que supo y se atrevió a amar lo hizo con todos y cada uno de sus sentidos...",
  },
  {
    id: "nota-018",
    fecha: "",
    texto: "Mi corazón late y late como burro sin mecate...",
  },
  {
    id: "nota-019",
    fecha: "",
    texto:
      "Capaz no fue el universo, ni alguna de sus dimensiones, ni alguno de sus habitantes. Capaz fue el león que rugió en agosto, capaz fui yo, yo que antes de conocerte creí en el amor y que luego de ti lo sigo haciendo...",
  },
  {
    id: "nota-020",
    fecha: "",
    texto:
      "Yo maravillado me siento cuando la admiro en la cumbre de su belleza, godible, lozana, perfecta en todo sentido, parece la diosa misma del amor, una Venus renacida a cuyos pies caerían todos los hombres...",
  },
  {
    id: "nota-021",
    fecha: "",
    texto:
      "Y si la vieras ella no se daría cuenta. De seguro estaría observando el cielo como si en él se encontraran todas las respuestas que nunca nadie le ofreció acá en la Tierra...",
  },
  {
    id: "nota-022",
    fecha: "",
    texto:
      "Se creía etérea como las alas de un avión. Le gustaba la lluvia, mas detestaba el frío que le producía y la falsa calma que la envolvía cuando con tanto anhelo se aferraba a mí...",
  },
  {
    id: "nota-023",
    fecha: "",
    texto:
      "En la ciudad donde no se producen encuentros, este simple mortal esperaba la tormenta a punto de ser desatada en las nubes negras de sus prietos ojos...",
  },
  {
    id: "nota-024",
    fecha: "",
    texto:
      "Rásgame la piel con tus temores,\nenvenena mi aliento con tus complejos,\nenloquéceme con tus delirios,\nbebe de mí hasta que sacies tu sed,\nhazme tuyo y déjame rogando por más...",
  },
  {
    id: "nota-025",
    fecha: "",
    texto:
      "Cuando el amanecer se eleva y tus ojos aún están dormidos,\nla luz del sol entra silenciosa y sus rayitos te aprietan las mejillas.\nDesde tu almohada perezosa lanzas manojos dulces al cielo,\nicástica muchacha del sol mañanero e hija de la luna caramelo.",
  },
  {
    id: "nota-026",
    fecha: "",
    texto:
      "Se iluminó la estancia de una venusta gracia\ncuando acerqué a tu boca la mía temblorosa,\nmientras por tierra y cielo relampagueó mi audacia\ncortándole a la vida su más intacta rosa...",
  },
  {
    id: "nota-027",
    fecha: "",
    texto:
      "Sentía mi vida peligrar, y aun así mendigaba por cada segundo que tus pestañas me dejaban ver esos dos agujeros negros que sorbían mi vida entera como un arácnido que, insaciable de fuerza vital, se roba también la mía.",
  },
  {
    id: "nota-028",
    fecha: "",
    texto:
      "Y ahí estabas tú, gentilmente devorando mi cuerpo, mente y alma con la única intención de dejarme rogando por más...",
  },
  {
    id: "nota-029",
    fecha: "",
    texto:
      "Hay lugares a los que no regresé, hay cosas que no volví a hacer. Simplemente, sin ti no es lo mismo.",
  },
  {
    id: "nota-030",
    fecha: "",
    texto:
      "Sin conocerla supe que era un suspiro de abril,\npiel canela, un lienzo para el sol,\nsu cabello, la aurora de mi faro.\nSu esencia, una canción en la brisa,\ncada mirada suya, una melodía inquieta.\nMujer coqueta, el misterio de la luna,\nsu encanto es un juego que deslumbra.\nSu seducción, un baile sobre un campo minado.\nUn enigma infinito, un libro en reverso.",
  },
  {
    id: "nota-031",
    fecha: "",
    texto:
      "Entre el verdor de follajes, musgos y helechos, te dibujo como un girasol de forma disuelta en el aire y en los deseos del sol.\nConocerte fue el hallazgo con el que sueña el explorador, es la nota en el interior de la botella que rescatará al náufrago, es la savia que recorre el pensamiento de los árboles, es el fermento que le da cuerpo a la fruta, la embriaguez de mis días y el sueño de mi insomnio.",
  },
  {
    id: "nota-032",
    fecha: "",
    texto:
      "Bajo el ébano de su piel canela,\ndonde el sol se sonroja ante su encanto,\nun juego de miradas, seducción que enreda,\nes la chispa ardiente en este instante.\n\nSu cabello, como serpientes seductoras,\nserpenteando en la danza de la noche,\ncada gesto, un verso lleno de auroras,\nun abismo de deseo, un océano de derroche.\n\nElla es el fuego, la llama en la penumbra,\ncoquetea con la luna y desafía al viento,\npeligrosamente excitante, mi rima y mi cumbre.",
  },
  {
    id: "nota-033",
    fecha: "",
    texto:
      "Deseo que encuentres tu ser en el reflejo de las flores, en el silencio del ciclón, en la memoria de las nubes, en la sed de las abejas, en el espejo en el cual contemplas todos los días tu fantástico ser...",
  },
  {
    id: "nota-034",
    fecha: "",
    texto:
      "En medio del tormento que el mundo trajo consigo,\nuna mujer, única y especial, enfrenta su abrigo.\nHermosa como ninguna, pero con el alma en desgaste,\nsu luz interna oculta, es su mayor contraste.\n\nLas marcas del tiempo y las heridas del camino\nhan dejado cicatrices en su rostro divino.\nA pesar del dolor, aún resplandece en su interior,\ncomo un faro que guía en la noche sin temor.\n\nQue no se apague esa luz que lleva en su ser,\ncomo un tesoro oculto que nadie debe conocer.\nEres especial, en un mundo que no entiende tu valor;\ndeja que tu esencia brille con su propio resplandor.",
  },
  {
    id: "nota-035",
    fecha: "",
    texto:
      "Eres un poema de emociones, mujer hecha metáfora, una cálida sinfonía, con la dulzura de un lirio y la firmeza de un roble. Como un río tranquilo que destila encanto.\nTu ser como un remolino de naturaleza salvaje, una danza del viento en un bosque intocado. Eres el frescor del agua y la profundidad del azul de mi cielo...",
  },
  {
    id: "nota-036",
    fecha: "",
    texto: "Tú eres mi 11:11.",
  },
  {
    id: "nota-037",
    fecha: "",
    texto: "Apaga la luz, hay verdades que solo se pueden decir a oscuras.",
  },
  {
    id: "nota-038",
    fecha: "",
    texto:
      "En el azul del cielo brilla tu esencia,\ncomo un girasol que siempre busca la luz,\neres la marea serena de mis días,\nel reflejo del sol en cada atardecer.\n\nTu risa es la ola que besa la playa,\ntu voz, el susurro del viento en verano,\ntus ojos, vivos y profundos como el mar,\nen cada mirada encuentro mi lugar.\n\nAmarillo es el color de tu alegría,\nel rayo de sol en mi vida,\ny por eso hoy celebro tu existencia,\nmi amor, mi cielo...",
  },
  {
    id: "nota-039",
    fecha: "",
    texto:
      "Extrañarte no es raro, pero hay días en los que lo único que quiero es encajar en tus brazos y olvidarme de todo.",
  },
  {
    id: "nota-040",
    fecha: "",
    texto: "¿Por qué tu sonrisa me gusta tanto?",
  },
  {
    id: "nota-041",
    fecha: "",
    texto:
      "Aventura, Nuquí, noche, solos, brindis, charla, humo, playa, agua, olas, juegos, risas, sensaciones, pasión, momento, calma, cielo, estrellas, colores, infinito, mirada, ojos, conexión, cámara lenta, mágico, plenitud, sueño, vida, amalgama, uno, básico, Quark.",
  },
  {
    id: "nota-042",
    fecha: "2025-08-11",
    texto:
      "Todos los días son importantes, cada día es único y especial, pero no todos los días marcan un antes y un después. El 11 de agosto sí lo hizo: no es solo una fecha en el calendario, es el día que todo cambió. Ese instante en que nuestras miradas se cruzaron y, sin saberlo, empezamos a escribir algo que todavía me emociona cada vez que lo pienso. No sé si fue casualidad o destino, pero sí sé que desde entonces no quiero que faltes en mi historia.",
  },
  {
    id: "nota-043",
    fecha: "2025-08-11",
    texto:
      "Hay muchas velas, hay muchas playas, hay muchos momentos, hay muchos 11 de agosto, pero FELYN solo hay uno, y somos nosotros. Quiero que lo recuerdes cada vez que veas esta vela, que sirva como recordatorio de lo único que es lo nuestro, único como esta vela que fue hecha especialmente para ti; que te recuerde que me enamoré de la playa contigo, que te recuerde que ese 11 de agosto conocí al amor de mi vida.",
  },
  {
    id: "nota-044",
    fecha: "",
    texto:
      "Muchos momentos únicos, recuerdos que me hacen feliz, que me hacen reafirmar que la vida es bella, e irónicamente en la mayoría está ella: siempre sonriente, siempre tan bella, tan brillante. Mujer que me hace feliz, mujer que me permite ser feliz, mujer que me recuerda la playa y me calienta como el sol, me asusta y fascina como el mar y me deslumbra con su belleza. Ella representa mucho de lo mejor de mí, lo más lindo, lo más inocente, ese sentimiento de sentirme pleno con solamente su presencia. Es raro que siempre que separo mis espacios de reflexión y desconexión ella llegue a mi mente. ¿Tal vez será porque ya es parte de mí?",
  },
  {
    id: "nota-045",
    fecha: "",
    texto:
      "Prometo que te veré viajando mucho por todas partes, con esa sonrisa de oreja a oreja tuya que tanto me fascina.",
  },
  {
    id: "nota-046",
    fecha: "",
    texto:
      "Llegar nervioso a su casa con flores y regalos, y que salga a recibirme en pijama y me atrape con su enorme sonrisa... No te imaginas cuánto extraño esa sensación.",
  },
  {
    id: "nota-047",
    fecha: "",
    texto:
      "Tú eres mi sonrisa sin razón, mi alegría en los detalles, mi caos, mi paz, mi amor sin fin.",
  },
  {
    id: "nota-048",
    fecha: "",
    texto:
      "Amo usar el canibalismo como metáfora del amor. Amar tanto a alguien que te den ganas de comértelo; no literal, sino como de absorberlo, de mezclarte con su piel, su voz, su forma de respirar.\nEs como querer tragarte lo que dice y beberte su corazón: no quiero tu cuerpo, quiero ser tu cuerpo.",
  },
  {
    id: "nota-049",
    fecha: "",
    texto:
      'Una vez me dijeron "por lo menos no tuvieron hijos" y realmente me dolió. Nunca me he visto a mí mismo como padre, pero yo sí quería tenerlos contigo.',
  },
  {
    id: "nota-050",
    fecha: "",
    texto: "Hueles a que en otra vida prometí encontrarte... y lo hice.",
  },
  {
    id: "nota-051",
    fecha: "",
    texto:
      "Me voy a convertir en el hombre que quiero ser, y me encargaré de que te enamores de mí todas las veces que sea necesario.",
  },
  {
    id: "nota-052",
    fecha: "",
    texto:
      "Tuve un sueño horrible, de esos que se sienten reales. No sé por qué me imaginé entrando a tus redes sociales y estaban llenas de fotos con él: fotos calientes, fotos lindas, fotos en nuestros lugares. Habías hecho con él todo lo que no habías hecho conmigo, y fue increíble lo triste, enojado e impotente que me sentí.",
  },
  {
    id: "nota-053",
    fecha: "",
    texto:
      "Sé que estoy rompiendo mis propias reglas, pero quiero que sepas que te perdoné, te agradezco y te amaré.\nFeliz año, mi niña linda.",
  },
  {
    id: "nota-054",
    fecha: "",
    texto:
      "Sinceramente, hay veces que no sé si este universo es un regalo más para ti o para mí.",
  },
  {
    id: "nota-055",
    fecha: "",
    texto:
      "No sé por qué, pero hoy particularmente no queda más que pensar en ti. Puse mi playlist y era imposible escuchar música tranquilo, porque había demasiadas canciones que me hacían pensar en ti.",
  },
  {
    id: "nota-056",
    fecha: "",
    texto: "Mis firmamentos más bellos te los he dedicado a ti.",
  },
  {
    id: "nota-057",
    fecha: "",
    texto: "Todos mis yo te añoran.",
  },
  {
    id: "nota-058",
    fecha: "",
    texto: "Obirin to ni ewa.",
  },
  {
    id: "nota-059",
    fecha: "",
    especial: true,
    texto:
      "Si un día despiertas y ya no sabes cómo sonaba mi risa, ni cómo se sentía mi nombre en tu boca... no pasa nada.\n\nCon que te quede, aunque sea difuso, que hubo alguien que te miró sin medida, como si el mundo empezara y terminara en ti... con eso me basta.\n\nY si la vida, con su manera tan suya de borrar huellas, decide también arrancarte de mi memoria, entonces que así sea... porque olvidar también es parte de haber sentido.\n\nPero quiero que quede escrito —no en el papel, sino en ese lugar invisible donde viven las verdades que no mueren— que hubo un instante en el tiempo donde tú y yo no fuimos duda, no fuimos intento, no fuimos casi...\n\nFuimos certeza.\n\nNo éramos eternos, pero fuimos reales. Y a veces, eso pesa más que cualquier para siempre.\n\nPorque existir juntos, aunque haya sido breve, es una forma de infinito.\nPorque coincidir en este caos de mundos y tiempos no es casualidad... es milagro.\n\nY en todo lo vivido, entre capítulos que se cierran y nombres que se diluyen, queda una página intacta, inviolable, donde tú y yo seguimos ahí... mirándonos sin miedo, sonriendo al mismo tiempo, creyendo, aunque sea por un latido, que éramos hogar.\n\nY eso... eso no se borra.",
  },
  {
    id: "nota-060",
    fecha: "",
    especial: true,
    texto:
      "Acabo de pensar en ella. ¿Nostalgia, tal vez? ¿Una fantasía? ¿Algo que de verdad espero que pase?\n\nNos veo volviendo a cruzar nuestro camino, mayores, con muchos éxitos, con vidas plenas, ya somos señores. ¿Quizá ese sería el momento? ¿Ese sería el final? ¿Sería ese el que nos haría felices por siempre? ¿O sería más bien una nostalgia de lo que nunca pudo ser?\n\nSiendo sincero, quiero volver a verla, que nos miremos a los ojos mientras reconocemos una vez más lo mucho que nos amamos, recordarle que siempre ha sido y que siempre será ella: mi reina, el amor de mi vida, mi niña hermosa, FELYN.",
  },
  {
    // OJO: esto es un mensaje cifrado, no lo "corrijas". Cambiar una sola
    // letra o un espacio rompería la clave.
    id: "nota-061",
    fecha: "",
    especial: true,
    texto:
      "Cifrado FELYN 2.0\n\nXmrsr qe sgfyscgn ii lohjpwmf isd nvskfganxzq,\ndzi lj pfpzp qj wfq nqed rrrtwyetr dsf qeegqtw...\nOcfhympvjvzl dzi pj nrsc lb jw fl vsqplft qlp ujplbb,\nxmym hs jfctt myrrswz ohj rflpf wp fn riyehfhz...\n\nFbd cl lb ympkoqey yy wsnc zfw dcahmwjb...\nuypq stvuyetr nma hscywj c osyeycy fz fcgyqs...\nLnejrogrwsy br xm j aejgtcetr dga uvtqn,\nuywgrwsy qhx ewknx  c ccpztppnwsy qh wmdy.\n\nRq ttltzmyggt yy 23 jn iium vw, gccljrom dzi ppn qs nmewinrb,\nxmy qngic ohj idc nimzq qjnlpvf wf khshz gahsxnyjxz.\nNrswz ohj edg rqpl fnqplpvf yy avjpz knx gwyet,\ntppb xmy qh umyehnrtrn, ysom yj wfnb fqlptt.\n\nLzw, hs rfcit 23 pwctf gzl byvl trwhlb:\nat ufgrwi xyf mypjyfw dga xy nmzuptavieo.\nWn ss eczj ew dhyycm an wp cfhsybr iiw ohjvpp,\nctvbsr ftccaimz ohj exye jw eyzgmpl cjvxyajgpp...\n\nRq ttltzmyggt esmef rz ohnicc itpgce f wzjgfv,\namevyp cayiybvt ufc yf ttltzmyggf id qh qyrye.\nFqmmf hvpavjvzl, itplpbs c dc itpggrwsy y ufpwye,\nd esmef iw nvskfganxz jr vytcej tcctzreye...",
  },
  {
    id: "nota-062",
    fecha: "",
    especial: true,
    texto:
      "FELYN\n\nYo, Felipe Moreno, de corazón inquieto pero intenciones claras, declaro que ya no quiero seguir así: quiero que hoy sea el fin de un ciclo y el inicio de otro.\n\nAsí que, sin más rodeos ni discursos ensayados, te propongo oficialmente algo que suena simple, pero que para mí lo significa todo: Josselyn, quiero que seas mi novia.\n\nQuiero estar ahí, no solo en los días fáciles, sino también en los que el mundo se te ponga en contra.\n\nDeclaro que mi plan a largo plazo es simple: que el mundo vuelva a sentir envidia de lo nuestro, y te prometo que tomaré acciones para lograrlo. Quiero escuchar, cuidar, acompañar y crecer juntos, sin prisa, pero con constancia y con propósito.\n\nEn resumen, quiero morir de amor por ti cada día como si fuera el último.\n\nY entonces, oficialmente, seremos dos personas que decidieron dejar de jugar con la suerte y empezar a escribir su historia a propósito. Seremos ese conjunto de desarmonías que se juntan para crear algo mejor que lo sublime.\n\nHoy y siempre.\nAquí y en todas las dimensiones posibles.",
  },
  {
    id: "nota-063",
    fecha: "",
    especial: true,
    texto:
      "Érase una vez un pingüinito y una pingüinita que se conocieron por casualidad,\ny que contra todo pronóstico se empezaron a gustar...\n\nMientras más se conocían más se enloquecían,\ny aunque muy diferentes eran, estar juntos querían...\n\nHabía muchas cosas que se interponían entre los dos,\npero eso no los detenía; ellos sabían que no.\n\nAunque en un inicio enamorarse no querían,\nllegó un momento en el que retractarse no podían.\n\nResulta que juntos querían estar,\ny aunque lejos vivían, no se dejaban de hablar...\n\nEl pingüinito poco a poco sentía que se enamoraba,\ny mientras más pasaba el tiempo, ella cada vez más lo embrujaba...\n\nLlegó un punto en el que él sabía que la pingüinita muy hechizado lo tenía,\nporque era la razón más lógica para lo que él sentía.\n\nEra muy extraño, porque el pingüinito era uno más del montón,\npero aquella pingüinita... Ufffff, era el más exquisito bombón...\n\nLa belleza de la pingüinita cada día crecía más,\ny la muy descarada al pingüinito quería matar.\n\nAunque ella lo negaba, el pingüinito sabía que embrujado estaba,\ny siempre discutían como locos porque muy locos estaban.\n\nLo mejor de la historia es que cada vez más lo disfrutaban,\ny aunque no lo parezca, esto aún no acaba.",
  },
  {
    id: "nota-064",
    fecha: "",
    especial: true,
    texto:
      "Confieso algo que no he dicho en voz alta: me pone nervioso volver a verte.\n\nNo nervioso de miedo. Nervioso de esos en los que uno ensaya mil veces lo que va a decir y después, llegado el momento, se le olvida todo. Llevo tanto tiempo imaginando ese día que ya ni sé cómo voy a reaccionar cuando por fin llegue.\n\nMe da vueltas la idea de quedarme callado justo cuando más quiero hablar. De que se me note demasiado. Y al mismo tiempo me aterra que se me note menos de lo que en realidad es.\n\nUno esperaría que después de tanto tiempo la cosa se calmara, que la costumbre hiciera lo suyo. Pues no. Sigue intacto, como el primer día.\n\nSupongo que uno solo se pone así por lo que de verdad le importa. Y tú me importas de una forma que todavía no aprendí a disimular.",
  },
];
