/* prettier-ignore */

// here are all linking words for chunk dividing for specific languages
const linkingWords = {
  romanian: 
  [
    "și", "se", "dar", "ori", "sau", "deci", "că", "ci", "însă", "ba", "nici", "din", "la", "pe", "cu", "are",
    "sub", "până", "spre", "prin", "fără", "despre", "în", "între", "lângă", "după", "pentru", "mai",
    "către", "încât", "deoarece", "fiindcă", "dacă", "decât", "atât", "când", "o", "să", "îți"
  ],
  english:
  [
    "and", "but", "or", "so", "because", "although", "while", "if", "nor", "therefore", 
    "however", "thus", "yet", "for", "either", "neither", "as", "since", "unless", 
    "until", "before", "after", "despite", "with", "without", "among", "between", "during", 
    "amongst", "within", "along", "through", "upon", "on", "off", "by", "about", "like", "as", 
    "except", "even", "whether", "that", "which", "who", "whom", "whose", "when", "where"
  ],
  chinese:
  [
    "和", "但是", "或者", "所以", "因为", "虽然", "然而", "如果", "当", "直到", 
    "即使", "在", "对", "通过", "例如", "在此之后", "此外", "因为", "尽管", "而且",
    "而", "如果", "那么", "此外", "有时", "然后"
  ],
  spanish:
  [
    "y", "pero", "o", "sin embargo", "porque", "aunque", "por lo tanto", "si", "mientras", "hasta",
    "antes", "después", "durante", "con", "en", "sobre", "para", "además", "por", "en cambio",
    "así que", "como", "aunque", "cuando", "siempre que"
  ],
  french:
  [
    "et", "mais", "ou", "car", "donc", "parce que", "bien que", "pourtant", "si", "tandis que",
    "avant", "après", "pendant", "avec", "sur", "contre", "en", "par", "comme", "lorsque", "aussi",
    "puisque", "par exemple", "cependant", "en outre", "même si"
  ],
  german:
  [
    "und", "aber", "oder", "weil", "obwohl", "denn", "trotzdem", "wenn", "während", "bis", 
    "vor", "nach", "während", "mit", "gegen", "durch", "außerdem", "weil", "obwohl", "wenn auch",
    "da", "damit", "sobald", "also", "zum Beispiel", "tatsächlich"
  ],
  arabic:
  [
    "و", "لكن", "أو", "لأن", "إلا أن", "ولكن", "إذا", "بينما", "حتى", "قبل", 
    "بعد", "خلال", "مع", "على", "عن", "من", "إلى", "في", "مع ذلك", "من أجل", "كما",
    "إذا كان", "لكن أيضا", "على الرغم من", "لذلك"
  ],
  portuguese:
  [
    "e", "mas", "ou", "porque", "embora", "portanto", "se", "enquanto", "até", "antes",
    "depois", "durante", "com", "em", "sobre", "para", "além disso", "apesar de", "ou seja",
    "como", "quando", "porque", "caso", "no entanto", "ainda"
  ],
  russian:
  [
    "и", "но", "или", "потому что", "хотя", "если", "когда", "пока", "до", "после", 
    "во время", "с", "на", "для", "через", "так как", "тем не менее", "поэтому", "как", "так",
    "например", "тем временем"
  ],
  japanese:
  [
    "そして", "しかし", "または", "だから", "なぜなら", "だけど", "もし", "あっても", "けれども", "それでも", 
    "その後", "前に", "後で", "中で", "とともに", "について", "例えば", "そのため", "すなわち", "その上", "もしも"
  ],
  italian:
  [
    "e", "ma", "oppure", "perché", "sebbene", "quindi", "se", "mentre", "fino a", "prima",
    "dopo", "durante", "con", "su", "per", "adesso", "come", "per esempio", "tuttavia", "così", 
    "perché", "infatti", "anche", "piuttosto"
  ]
};

export default linkingWords;
