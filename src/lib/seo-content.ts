export const SITE_URL = "https://yiwu-index.com";

export function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return SITE_URL;
  try {
    return new URL(raw).origin;
  } catch {
    return SITE_URL;
  }
}

export type SupplierCategorySeo = {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  products: string[];
  checks: string[];
  risks: string[];
};

export const supplierCategories: SupplierCategorySeo[] = [
  {
    slug: "vetements",
    name: "Vêtements & chaussures",
    title: "Fournisseurs de vêtements en Chine - Yiwu Index",
    description: "Trouvez des fournisseurs chinois de vêtements, chaussures et textile à Yiwu. Comparez les profils et débloquez les contacts directs avec Yiwu Index.",
    h1: "Fournisseurs de vêtements en Chine",
    intro: "Yiwu est une zone clé pour sourcer des vêtements, accessoires textile, chaussures et produits de mode à prix compétitifs. Yiwu Index vous aide à identifier les fournisseurs utiles sans partir de zéro.",
    products: ["T-shirts", "sweats", "chaussures", "sacs textile", "casquettes", "accessoires de mode"],
    checks: ["Demander un échantillon avant toute commande", "Comparer le MOQ et les tailles disponibles", "Vérifier les finitions, coutures et emballages", "Confirmer les délais de production par écrit"],
    risks: ["Tailles non conformes au marché européen", "Qualité différente entre l'échantillon et la série", "Matières mal décrites", "Délais de production sous-estimés"],
  },
  {
    slug: "electronique",
    name: "Électronique & accessoires",
    title: "Fournisseurs d'électronique en Chine - Yiwu Index",
    description: "Accédez à des fournisseurs chinois d'accessoires électroniques, gadgets, coques, câbles et petits produits tech depuis Yiwu.",
    h1: "Fournisseurs d'électronique en Chine",
    intro: "Les accessoires électroniques font partie des catégories les plus recherchées par les e-commerçants. Yiwu Index permet de repérer des fournisseurs et de filtrer les profils avant de prendre contact.",
    products: ["coques téléphone", "câbles", "chargeurs", "LED", "gadgets", "accessoires audio"],
    checks: ["Demander les certifications nécessaires", "Tester plusieurs échantillons", "Vérifier la compatibilité UE", "Confirmer les conditions SAV"],
    risks: ["Certificats incomplets", "Produits non conformes", "Taux de défaut élevé", "Descriptions techniques floues"],
  },
  {
    slug: "bijoux-accessoires",
    name: "Bijoux & accessoires",
    title: "Fournisseurs de bijoux fantaisie à Yiwu - Yiwu Index",
    description: "Trouvez des fournisseurs de bijoux fantaisie, accessoires de mode, montres et petits articles tendance au marché de Yiwu.",
    h1: "Fournisseurs de bijoux fantaisie à Yiwu",
    intro: "Yiwu est connu pour les bijoux fantaisie, accessoires de mode et petits articles à forte rotation. Cette catégorie peut être rentable si la qualité, le packaging et les marges sont bien contrôlés.",
    products: ["colliers", "bracelets", "bagues", "boucles d'oreilles", "montres", "accessoires cheveux"],
    checks: ["Contrôler la finition et la tenue couleur", "Demander photos réelles et échantillons", "Vérifier les matériaux annoncés", "Tester le packaging"],
    risks: ["Oxydation rapide", "Allergènes ou matériaux mal déclarés", "Photos trop retouchées", "Packaging insuffisant"],
  },
  {
    slug: "emballage",
    name: "Emballage & packaging",
    title: "Fournisseurs d'emballage en Chine - Yiwu Index",
    description: "Sourcing de fournisseurs chinois pour emballages, boîtes, sachets, packaging e-commerce et personnalisation de marque.",
    h1: "Fournisseurs d'emballage en Chine",
    intro: "Le packaging influence directement la perception client et la marge. Yiwu Index aide à trouver des fournisseurs d'emballages standards ou personnalisés pour e-commerce et retail.",
    products: ["boîtes carton", "sachets", "étiquettes", "packaging cadeau", "pochettes", "présentoirs"],
    checks: ["Valider dimensions et grammage", "Tester l'impression logo", "Vérifier le conditionnement par carton", "Demander un BAT avant production"],
    risks: ["Couleurs différentes à l'impression", "Carton trop léger", "MOQ élevé", "Frais de transport sous-estimés"],
  },
  {
    slug: "maison-decoration",
    name: "Maison & décoration",
    title: "Fournisseurs maison et décoration en Chine - Yiwu Index",
    description: "Découvrez des fournisseurs pour articles maison, décoration, rangement et petits produits lifestyle en Chine.",
    h1: "Fournisseurs maison et décoration en Chine",
    intro: "Les produits maison et décoration couvrent un large choix de références. Le bon sourcing consiste à comparer la qualité perçue, le poids, les frais de transport et la différenciation produit.",
    products: ["articles déco", "rangement", "cuisine", "bougies", "petite déco", "accessoires maison"],
    checks: ["Comparer le coût produit + transport", "Vérifier la casse possible", "Demander emballage renforcé", "Contrôler les dimensions exactes"],
    risks: ["Produits fragiles", "Volume CBM élevé", "Photos trompeuses", "Packaging insuffisant"],
  },
  {
    slug: "jouets",
    name: "Jouets & cadeaux",
    title: "Fournisseurs de jouets en Chine - Yiwu Index",
    description: "Trouvez des fournisseurs chinois de jouets, cadeaux, articles saisonniers et produits enfants à Yiwu.",
    h1: "Fournisseurs de jouets en Chine",
    intro: "Les jouets et cadeaux peuvent générer de bons volumes, mais demandent une vigilance forte sur les normes, l'âge recommandé, l'emballage et la conformité.",
    products: ["jouets", "cadeaux", "articles saisonniers", "peluches", "petits jeux", "produits événementiels"],
    checks: ["Vérifier les normes applicables", "Demander certificats et rapports de test", "Contrôler l'âge recommandé", "Commander un échantillon"],
    risks: ["Normes européennes non respectées", "Petites pièces dangereuses", "Qualité irrégulière", "Saisonnalité forte"],
  },
  {
    slug: "beaute",
    name: "Beauté & accessoires",
    title: "Fournisseurs beauté et accessoires en Chine - Yiwu Index",
    description: "Sourcing de fournisseurs chinois pour accessoires beauté, coiffure, maquillage non réglementé et petits équipements salon.",
    h1: "Fournisseurs beauté et accessoires en Chine",
    intro: "La beauté est une catégorie attractive, mais il faut distinguer les accessoires simples des produits cosmétiques soumis à réglementation. Yiwu Index aide à cibler les fournisseurs pertinents.",
    products: ["accessoires coiffure", "pinceaux", "trousses", "miroirs", "onglerie", "petits outils beauté"],
    checks: ["Identifier les produits réglementés", "Contrôler matériaux et finitions", "Tester l'emballage", "Vérifier les déclarations marketing"],
    risks: ["Produits cosmétiques mal déclarés", "Normes non respectées", "Qualité variable", "Claims marketing risqués"],
  },
  {
    slug: "bagagerie",
    name: "Sacs & bagagerie",
    title: "Fournisseurs de sacs et bagagerie en Chine - Yiwu Index",
    description: "Trouvez des fournisseurs chinois de sacs, valises, sacs à dos, pochettes et accessoires de voyage.",
    h1: "Fournisseurs de sacs et bagagerie en Chine",
    intro: "Les sacs et articles de bagagerie se prêtent bien à la personnalisation, mais il faut bien contrôler matières, fermetures, coutures et volume logistique.",
    products: ["sacs à dos", "sacs à main", "valises", "pochettes", "sacs shopping", "accessoires voyage"],
    checks: ["Tester fermetures et coutures", "Valider les matériaux", "Comparer options de personnalisation", "Calculer le volume transport"],
    risks: ["Fermetures fragiles", "Matières différentes des photos", "Logo mal imprimé", "CBM élevé"],
  },
];

export type GuideSeo = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
  faq: { question: string; answer: string }[];
  related?: [string, string][];
};

export const guides: GuideSeo[] = [
  {
    slug: "importer-de-chine",
    title: "Importer de Chine : étapes, coûts et erreurs à éviter - Yiwu Index",
    description: "Guide simple pour importer de Chine : choix fournisseur, échantillon, MOQ, transport, douane, coût au débarquement et erreurs fréquentes.",
    h1: "Importer de Chine : les étapes essentielles",
    intro: "Importer de Chine peut être rentable, mais seulement si vous contrôlez le fournisseur, le coût réel et la logistique. Voici une méthode simple pour avancer sans brûler votre budget.",
    sections: [
      { heading: "1. Définir le produit et la marge cible", body: ["Avant de contacter un fournisseur, fixez votre prix de vente, votre coût maximum, votre marge minimale et vos contraintes produit.", "Le piège classique est de regarder uniquement le prix usine. Le vrai coût inclut transport, douane, TVA import, emballage, échantillons et éventuels contrôles qualité."] },
      { heading: "2. Comparer plusieurs fournisseurs", body: ["Contactez plusieurs fournisseurs, pas un seul. Comparez le MOQ, le délai, les options de personnalisation, les conditions de paiement et la clarté des réponses.", "Un fournisseur sérieux répond précisément, accepte les questions techniques et peut envoyer photos, vidéos ou échantillons."] },
      { heading: "3. Commander un échantillon", body: ["L'échantillon est obligatoire avant une grosse commande. Vérifiez finitions, dimensions, matériaux, emballage et conformité au besoin client.", "Gardez des photos et notes pour comparer ensuite avec la production finale."] },
      { heading: "4. Calculer le coût au débarquement", body: ["Le coût au débarquement correspond au coût produit rendu chez vous. Il inclut produit, transport, droits, TVA import et frais annexes.", "Utilisez ce coût pour savoir si le produit est vraiment rentable avant de lancer la commande."] },
      { heading: "5. Sécuriser paiement, production et transport", body: ["Évitez de payer 100% trop tôt. Clarifiez acompte, solde, inspection, incoterm et mode de transport.", "Pour une première importation, faites-vous accompagner sur la logistique et le dédouanement."] },
    ],
    faq: [
      { question: "Peut-on importer de Chine sans aller sur place ?", answer: "Oui, mais il faut vérifier le fournisseur, commander un échantillon et sécuriser la logistique." },
      { question: "Quel est le plus gros risque ?", answer: "Le plus gros risque est de sous-estimer le coût total ou de commander sans échantillon." },
    ],
  },
  {
    slug: "trouver-un-fournisseur-a-yiwu",
    title: "Trouver un fournisseur à Yiwu - Méthode simple - Yiwu Index",
    description: "Comment trouver un fournisseur fiable à Yiwu : catégories, stand, MOQ, contact direct, vérifications et première commande.",
    h1: "Comment trouver un fournisseur à Yiwu",
    intro: "Yiwu concentre des milliers de fournisseurs et grossistes. Le problème n'est pas de trouver quelqu'un qui vend : c'est de trouver le bon contact, au bon prix, avec les bonnes informations.",
    sections: [
      { heading: "Comprendre le marché de Yiwu", body: ["Yiwu est organisé par zones, districts et catégories. Chaque fournisseur peut avoir un stand, une spécialité et des conditions différentes.", "Un bon sourcing commence par une catégorie claire : vêtements, bijoux, électronique, maison, packaging, jouets, etc."] },
      { heading: "Comparer les fournisseurs", body: ["Demandez MOQ, prix par quantité, délai, personnalisation possible, photos réelles et conditions d'échantillon.", "Ne choisissez pas uniquement le prix le plus bas. Un prix trop bas cache souvent une qualité faible, des frais ou une mauvaise communication."] },
      { heading: "Utiliser Yiwu Index", body: ["Yiwu Index vous permet de parcourir des profils fournisseurs et de débloquer les coordonnées directes selon votre abonnement.", "La partie descriptive reste utile pour comparer ; les contacts directs sont réservés aux membres payants."] },
    ],
    faq: [
      { question: "Yiwu convient-il aux petites commandes ?", answer: "Oui, beaucoup de fournisseurs ou traders acceptent des volumes plus flexibles que certaines usines." },
      { question: "Faut-il parler chinois ?", answer: "Ce n'est pas obligatoire, mais une communication claire en anglais simple aide beaucoup." },
    ],
  },
  {
    slug: "verifier-un-fournisseur-chinois",
    title: "Vérifier un fournisseur chinois avant commande - Yiwu Index",
    description: "Checklist pour vérifier un fournisseur chinois : informations, échantillons, certificats, paiement, production et contrôle qualité.",
    h1: "Comment vérifier un fournisseur chinois",
    intro: "Un fournisseur peut paraître sérieux en ligne et décevoir en production. La vérification sert à limiter les risques avant d'envoyer de l'argent ou de lancer une commande.",
    sections: [
      { heading: "Vérifier l'identité et la cohérence", body: ["Contrôlez le nom, l'adresse, le type d'activité, les produits réellement proposés et la cohérence entre photos, catalogue et discours commercial.", "Un fournisseur qui change souvent d'informations ou refuse les détails doit vous alerter."] },
      { heading: "Demander des preuves concrètes", body: ["Demandez vidéos, photos récentes, emballages, certificats si nécessaires et conditions exactes de production.", "Pour les produits réglementés, les certificats doivent être lus avec prudence et vérifiés selon le marché cible."] },
      { heading: "Tester avec une petite commande", body: ["L'échantillon et la petite commande test permettent de vérifier la qualité réelle, le délai et la communication.", "Ne passez pas directement une grosse commande sur la base d'un catalogue ou d'une promesse commerciale."] },
    ],
    faq: [
      { question: "Un fournisseur vérifié garantit-il la qualité ?", answer: "Non. Cela réduit le risque, mais un échantillon et un contrôle qualité restent nécessaires." },
      { question: "Que vérifier en premier ?", answer: "Vérifiez le produit, le MOQ, le délai, les coordonnées et la capacité à fournir des preuves concrètes." },
    ],
  },
  {
    slug: "eviter-arnaques-fournisseurs-chine",
    title: "Éviter les arnaques fournisseurs en Chine - Yiwu Index",
    description: "Les arnaques fréquentes en sourcing Chine : faux fournisseurs, faux certificats, prix d'appel, qualité différente et paiement risqué.",
    h1: "Éviter les arnaques fournisseurs en Chine",
    intro: "La plupart des erreurs coûtent cher parce qu'elles arrivent avant même la première vraie commande : mauvais fournisseur, mauvais coût, mauvais niveau de contrôle.",
    sections: [
      { heading: "Prix trop beau pour être vrai", body: ["Un prix très inférieur au marché peut cacher une qualité faible, une autre matière, des frais oubliés ou un fournisseur peu fiable.", "Comparez toujours plusieurs devis et demandez le prix à différents volumes."] },
      { heading: "Bon échantillon, mauvaise production", body: ["Le fournisseur peut envoyer un bon échantillon puis livrer une série inférieure. C'est pour cela qu'un contrôle avant expédition est utile.", "Définissez vos critères qualité par écrit avant la production."] },
      { heading: "Paiement mal sécurisé", body: ["Évitez les paiements complets trop tôt. Clarifiez acompte, solde, preuve de production et documents d'expédition.", "Gardez toutes les discussions importantes par écrit."] },
    ],
    faq: [
      { question: "Comment réduire le risque rapidement ?", answer: "Comparer plusieurs fournisseurs, demander un échantillon et ne jamais commander gros sans contrôle." },
      { question: "Yiwu Index remplace-t-il un contrôle qualité ?", answer: "Non. Yiwu Index aide au sourcing, mais le contrôle qualité reste recommandé avant expédition." },
    ],
  },
  {
    slug: "alibaba-vs-yiwu",
    title: "Alibaba vs Yiwu : quelles différences pour sourcer ? - Yiwu Index",
    description: "Comparaison Alibaba vs Yiwu : accès fournisseurs, MOQ, prix, contact direct, marché physique et stratégie de sourcing.",
    h1: "Alibaba vs Yiwu : quelle différence ?",
    intro: "Alibaba et Yiwu peuvent tous les deux servir à trouver des fournisseurs, mais ils ne répondent pas exactement au même besoin. Le bon choix dépend de votre produit, volume et niveau d'expérience.",
    sections: [
      { heading: "Alibaba : plateforme globale", body: ["Alibaba donne accès à beaucoup de fournisseurs en ligne, souvent avec une interface simple, des catalogues et des outils intégrés.", "C'est pratique pour explorer un marché, mais il faut filtrer fortement les résultats et comparer les profils."] },
      { heading: "Yiwu : marché physique et réseau fournisseurs", body: ["Yiwu est un énorme marché de petites marchandises avec des stands, grossistes, traders et fournisseurs spécialisés.", "L'intérêt est d'accéder à des contacts plus directs et à des catégories très variées."] },
      { heading: "Quelle approche choisir ?", body: ["Pour explorer vite, Alibaba peut aider. Pour construire une base de fournisseurs ciblée autour de Yiwu, un annuaire spécialisé comme Yiwu Index peut faire gagner du temps.", "Dans les deux cas, échantillon, comparaison et calcul du coût complet restent indispensables."] },
    ],
    faq: [
      { question: "Yiwu est-il moins cher qu'Alibaba ?", answer: "Pas toujours. Le prix dépend du produit, du volume, du fournisseur et du transport." },
      { question: "Peut-on utiliser les deux ?", answer: "Oui. Comparer Alibaba et des contacts Yiwu permet souvent d'avoir une meilleure vision du marché." },
    ],
  },
  {
    slug: "importer-de-yiwu",
    title: "Importer de Yiwu : étapes, fournisseurs, transport et pièges",
    description: "Guide pratique pour importer de Yiwu : trouver un fournisseur, vérifier les contacts, organiser le transport et éviter les erreurs courantes.",
    h1: "Comment importer de Yiwu ?",
    intro: "Yiwu abrite le plus grand marché de gros de petites marchandises au monde : des dizaines de milliers de stands répartis en districts, couvrant les jouets, les accessoires, la maison, la papeterie, le textile ou l'électronique. Importer de Yiwu vers la France ou l'Europe est accessible même à une petite structure, à condition de suivre une méthode : définir le produit, identifier les bons fournisseurs, vérifier les interlocuteurs, cadrer les prix et le MOQ, puis organiser un transport adapté au volume. Ce guide détaille chaque étape, avec les pièges classiques à éviter pour ne pas transformer une bonne opportunité en mauvaise surprise.",
    sections: [
      { heading: "Étape 1 : définir le produit à sourcer", body: [
        "Avant même de chercher un fournisseur, verrouillez le produit : à qui vous le vendez, à quel prix, avec quelle marge cible. Fixez un coût rendu maximum (produit + transport + droits + TVA import + emballage) au-delà duquel l'opération n'est plus rentable.",
        "Précisez ensuite les caractéristiques indispensables : matière, dimensions, coloris, packaging, normes applicables (jouets, produits en contact avec la peau, électronique…). Plus votre cahier des charges est clair, plus les échanges avec les fournisseurs de Yiwu seront rapides et fiables.",
        "Enfin, restez réaliste sur le volume de départ. Un premier import raisonnable permet de tester la qualité, la logistique et la demande réelle avant d'engager un budget important."
      ] },
      { heading: "Étape 2 : trouver des fournisseurs à Yiwu", body: [
        "Le marché de Yiwu (Yiwu International Trade City) est organisé en districts spécialisés. Sur place, on avance stand par stand ; à distance, la difficulté est d'obtenir des contacts directs fiables sans intermédiaires opaques.",
        "C'est précisément le rôle d'un annuaire spécialisé comme Yiwu Index : parcourir des fournisseurs classés par catégorie, comparer les gammes de produits, puis débloquer les coordonnées directes (WeChat, e-mail, téléphone, numéro de stand) pour les contacter sans détour.",
        "Contactez toujours plusieurs fournisseurs pour un même produit. Comparer trois à cinq réponses vous donne immédiatement une fourchette de prix crédible, une idée des MOQ pratiqués et un aperçu du sérieux de chacun."
      ] },
      { heading: "Étape 3 : vérifier le fournisseur", body: [
        "À distance, la vérification repose sur des signaux concrets : réponses précises et cohérentes, photos et vidéos réelles du produit et du stand, licence commerciale communiquée sans réticence, conditions écrites claires.",
        "Un stand localisé au marché de Yiwu est un premier repère utile — c'est le sens du badge « Stand localisé » sur Yiwu Index — mais ce n'est pas une garantie de qualité produit. Complétez toujours par un échantillon et, pour les commandes importantes, par une inspection avant expédition.",
        "Méfiez-vous des prix anormalement bas, des demandes de paiement intégral immédiat vers des comptes personnels, et des interlocuteurs qui changent de conditions en cours de discussion."
      ] },
      { heading: "Étape 4 : demander échantillons, prix et MOQ", body: [
        "L'échantillon est non négociable avant toute commande sérieuse. Il permet de juger la qualité réelle, les finitions, le packaging et la conformité à votre cahier des charges. Conservez photos et mesures pour comparer avec la production finale.",
        "Négociez ensuite le trio prix / MOQ / délai. À Yiwu, les MOQ sont souvent plus accessibles que chez les usines classiques, ce qui permet de composer un premier conteneur ou groupage avec plusieurs références.",
        "Faites tout confirmer par écrit : prix unitaire, devise, incoterm (EXW, FOB…), délai de production, conditions de paiement (acompte/solde) et emballage. Un fournisseur sérieux n'a aucun problème à formaliser."
      ] },
      { heading: "Étape 5 : organiser le transport", body: [
        "Depuis Yiwu, trois grandes options : l'express (rapide, adapté aux petits colis et échantillons), l'aérien (délai court, coût au kilo élevé) et le maritime (le plus économique dès que le volume dépasse ~1 à 2 m³, en groupage LCL ou conteneur complet).",
        "Le rail Chine–Europe constitue parfois un compromis intéressant entre délai et coût. Dans tous les cas, comparez les offres en coût rendu, dédouanement inclus, et clarifiez qui gère la déclaration en douane et la TVA à l'import.",
        "Anticipez les pics saisonniers (avant le Nouvel An chinois notamment) : les délais s'allongent et les tarifs montent. Prévoyez de la marge dans votre planning de réassort."
      ] },
      { heading: "Erreurs fréquentes à éviter", body: [
        "Commander sans échantillon, sous-estimer le coût rendu (droits et TVA import oubliés), payer 100 % à la commande, ou se fier uniquement à des photos retouchées : ce sont les quatre erreurs qui coûtent le plus cher aux nouveaux importateurs.",
        "Ajoutez-y le manque de traçabilité des échanges (tout doit être écrit), l'absence de contrôle qualité avant expédition sur les volumes importants, et le choix d'un mode de transport inadapté au ratio poids/volume du produit.",
        "En résumé : petit volume test, fournisseurs comparés, échantillons validés, conditions écrites, transport dimensionné. Cette discipline simple élimine l'essentiel des mauvaises surprises."
      ] },
    ],
    faq: [
      { question: "Faut-il aller sur place pour importer de Yiwu ?", answer: "Non. Avec des contacts directs fiables, des échantillons et un partenaire logistique, tout peut se faire à distance. Se déplacer reste utile pour les gros volumes ou les gammes complexes." },
      { question: "Quel budget pour un premier import depuis Yiwu ?", answer: "Cela dépend du produit, mais un premier test cohérent se situe souvent entre quelques centaines et quelques milliers d'euros, transport et taxes inclus. L'essentiel est de calculer le coût rendu avant de commander." },
      { question: "Quels sont les délais moyens ?", answer: "Comptez la production (souvent 1 à 4 semaines selon le produit) plus le transport : quelques jours en express ou aérien, 4 à 7 semaines environ en maritime vers l'Europe." },
    ],
    related: [["Organiser mon transport", "/transport"]],
  },
  {
    slug: "societe-import-export-yiwu",
    title: "Société import export à Yiwu : choisir le bon partenaire",
    description: "Découvrez comment choisir une société import export à Yiwu, vérifier un partenaire et utiliser Yiwu Index pour trouver des fournisseurs chinois.",
    h1: "Société import export à Yiwu : comment choisir ?",
    intro: "Autour du marché de Yiwu gravite tout un écosystème de sociétés d'import-export, d'agents de sourcing et de bureaux d'achat. Leur promesse : vous accompagner pour trouver les produits, consolider les commandes de plusieurs stands, contrôler la qualité et expédier vers la France ou l'Europe. Certaines apportent une vraie valeur ; d'autres empilent les commissions sans transparence. Ce guide explique le rôle réel de ces partenaires, la différence entre fournisseur, agent et société d'import-export, les points à vérifier avant de signer, et la façon dont un annuaire de contacts directs comme Yiwu Index complète — ou remplace — ce type d'intermédiaire.",
    sections: [
      { heading: "Le rôle d'une société import export à Yiwu", body: [
        "Une société d'import-export basée à Yiwu sert d'interface entre vous et le marché : repérage des produits, négociation en chinois, regroupement des achats effectués auprès de plusieurs stands, contrôle qualité basique, consolidation en entrepôt, puis organisation du transport et des formalités export.",
        "Pour un importateur qui ne parle pas chinois, qui achète de petites quantités auprès de nombreux stands ou qui veut un point de contact unique, ce service a une vraie utilité : il transforme des dizaines de micro-commandes en une seule expédition gérée.",
        "La contrepartie est le coût : commission sur les achats (souvent 3 à 10 %), frais d'entrepôt et marges éventuelles sur le transport. Ce coût doit être connu, écrit et intégré à votre calcul de rentabilité."
      ] },
      { heading: "Différence entre fournisseur, agent et société import export", body: [
        "Le fournisseur (le stand ou l'usine) fabrique ou distribue le produit : c'est lui qui fixe le prix de base, le MOQ et le délai. Traiter en direct avec lui donne le meilleur prix, mais suppose d'avoir son contact et de gérer soi-même la coordination.",
        "L'agent de sourcing travaille pour vous, généralement à la commission : il cherche les produits, négocie, suit la production et vous représente sur place. Sa valeur dépend entièrement de sa transparence — un bon agent vous communique les vrais prix fournisseurs.",
        "La société d'import-export, elle, achète et revend souvent en son nom : votre contrat est avec elle, pas avec le stand. C'est plus simple administrativement, mais vous connaissez rarement le prix d'origine et vous dépendez de sa sélection de fournisseurs."
      ] },
      { heading: "Points à vérifier avant de travailler avec un partenaire", body: [
        "Exigez la transparence sur la rémunération : commission exacte, frais d'entrepôt, marge transport. Un partenaire fiable détaille ses coûts ; un partenaire flou les dilue dans des prix produits gonflés.",
        "Vérifiez l'existence légale (licence commerciale chinoise, ancienneté, adresse réelle à Yiwu), demandez des références clients en Europe, et testez la réactivité et la précision des réponses sur un petit dossier avant de confier un volume important.",
        "Cadrez le contrôle qualité : que vérifie-t-il exactement avant expédition (quantités, références, état, photos) ? Qui est responsable en cas d'erreur ? Un rapport de contrôle photo avant chargement devrait être un standard."
      ] },
      { heading: "Risques fréquents", body: [
        "Le risque principal est l'opacité tarifaire : commissions cachées dans les prix produits, doubles marges sur le transport, frais d'entrepôt qui gonflent. Sans prix d'origine, impossible de savoir ce que vous payez réellement.",
        "Autres risques classiques : dépendance totale à un intermédiaire unique (si la relation se dégrade, vous perdez vos fournisseurs), contrôle qualité superficiel, et responsabilités mal définies en cas de produits non conformes ou manquants.",
        "Enfin, méfiez-vous des « agents » improvisés rencontrés sur les réseaux sociaux, sans structure légale vérifiable, qui demandent des paiements sur des comptes personnels. C'est le profil type des arnaques au sourcing."
      ] },
      { heading: "Comment Yiwu Index peut compléter votre recherche", body: [
        "Yiwu Index vous redonne l'accès direct : un annuaire de plus de 1 500 fournisseurs du marché de Yiwu, classés par catégorie, avec les coordonnées directes (WeChat, e-mail, téléphone, numéro de stand) débloquées selon votre abonnement.",
        "Concrètement, vous pouvez soit traiter en direct avec les stands et ne mobiliser un prestataire que pour la consolidation et le transport, soit utiliser les contacts directs pour vérifier les prix qu'un intermédiaire vous propose — un excellent test de transparence.",
        "Cette approche hybride — contacts directs pour le sourcing, partenaire logistique pour l'expédition — combine le meilleur prix produit et la simplicité opérationnelle, tout en gardant votre carnet de fournisseurs sous votre contrôle."
      ] },
    ],
    faq: [
      { question: "Une société import export est-elle obligatoire pour acheter à Yiwu ?", answer: "Non. Avec les contacts directs des fournisseurs et un transitaire pour la logistique, vous pouvez acheter sans intermédiaire d'achat. L'intermédiaire devient utile surtout pour consolider de nombreux petits achats." },
      { question: "Quelle commission demande un agent à Yiwu ?", answer: "Généralement entre 3 % et 10 % du montant des achats, selon le volume et les services inclus. L'important est que cette commission soit explicite et contractuelle." },
      { question: "Comment tester un partenaire avant de s'engager ?", answer: "Confiez-lui un petit dossier : quelques références, un budget limité. Jugez la transparence des prix, la qualité du contrôle avant expédition et le respect des délais avant d'augmenter les volumes." },
    ],
    related: [["Guide : importer de Yiwu", "/guides/importer-de-yiwu"]],
  },
];

export function getSupplierCategory(slug: string) {
  return supplierCategories.find((category) => category.slug === slug);
}

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
