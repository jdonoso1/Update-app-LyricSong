export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  language: string;
  genre: string;
  releaseDate: string;
  lyrics: string;
  duration: string;
  albumArt: string;
}

export const mockSongs: Song[] = [
  {
    id: "1",
    title: "Volar",
    artist: "Álvaro Soler",
    album: "Eterno Agosto",
    language: "Spanish",
    genre: "Pop",
    releaseDate: "2021-08-13",
    lyrics: "Quiero volar contigo, ver el mundo desde arriba. Soñar sin límites, vivir cada momento. El cielo es nuestro destino, las nubes son mi camino.",
    duration: "3:24",
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
  },
  {
    id: "2",
    title: "Lumière",
    artist: "Claire Dubois",
    album: "Aurore",
    language: "French",
    genre: "Pop",
    releaseDate: "2022-03-15",
    lyrics: "Dans la lumière du matin, je trouve ma liberté. Chaque rayon de soleil illumine mon chemin. L'espoir brille dans mes yeux.",
    duration: "3:45",
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
  },
  {
    id: "3",
    title: "Libertad",
    artist: "María González",
    album: "Corazón Libre",
    language: "Spanish",
    genre: "Latin",
    releaseDate: "2020-11-20",
    lyrics: "La libertad es mi canción, mi corazón late con pasión. Volar alto sin miedo, soñar despierta. Nadie puede detenerme ahora.",
    duration: "4:10",
    albumArt: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop"
  },
  {
    id: "4",
    title: "Rêver",
    artist: "Antoine Martin",
    album: "Nuit Étoilée",
    language: "French",
    genre: "Indie",
    releaseDate: "2023-01-10",
    lyrics: "Je veux rêver sous les étoiles, danser avec la lune. La nuit m'appartient, mes pensées vagabondent. L'univers est mon terrain de jeu.",
    duration: "3:52",
    albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop"
  },
  {
    id: "5",
    title: "Amor Eterno",
    artist: "Los Románticos",
    album: "Sentimientos",
    language: "Spanish",
    genre: "Ballad",
    releaseDate: "2019-05-14",
    lyrics: "Tu amor es eterno como el mar, profundo y sin final. Mi corazón late por ti, cada momento es un regalo. Juntos para siempre.",
    duration: "4:30",
    albumArt: "https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=400&h=400&fit=crop"
  },
  {
    id: "6",
    title: "Océan",
    artist: "Sophie Bernard",
    album: "Horizon Bleu",
    language: "French",
    genre: "Acoustic",
    releaseDate: "2021-07-22",
    lyrics: "L'océan m'appelle, ses vagues me bercent. Je me perds dans l'immensité bleue. La mer est ma maison, mon refuge éternel.",
    duration: "3:18",
    albumArt: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&h=400&fit=crop"
  },
  {
    id: "7",
    title: "Bailar",
    artist: "Carlos Vega",
    album: "Ritmo Caliente",
    language: "Spanish",
    genre: "Reggaeton",
    releaseDate: "2022-09-05",
    lyrics: "Quiero bailar toda la noche, sentir el ritmo en mi cuerpo. La música me libera, me hace volar. Esta fiesta nunca termina.",
    duration: "3:35",
    albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop"
  },
  {
    id: "8",
    title: "Étoile",
    artist: "Camille Petit",
    album: "Constellation",
    language: "French",
    genre: "Electronic",
    releaseDate: "2023-02-28",
    lyrics: "Tu es mon étoile dans la nuit sombre. Ta lumière guide mes pas. Ensemble nous brillons dans l'obscurité.",
    duration: "4:05",
    albumArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
  },
  {
    id: "9",
    title: "Corazón",
    artist: "Diego Rivera",
    album: "Alma Latina",
    language: "Spanish",
    genre: "Salsa",
    releaseDate: "2020-06-18",
    lyrics: "Mi corazón late al ritmo de la salsa, con pasión y alegría. Bailamos juntos bajo el sol caribeño. La vida es una fiesta.",
    duration: "3:50",
    albumArt: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop"
  },
  {
    id: "10",
    title: "Soleil",
    artist: "Lucas Rousseau",
    album: "Été Sans Fin",
    language: "French",
    genre: "Pop",
    releaseDate: "2022-06-12",
    lyrics: "Le soleil brille sur ma peau, je me sens vivant. Chaque rayon est une caresse. L'été ne finira jamais dans mon cœur.",
    duration: "3:28",
    albumArt: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop"
  },
  {
    id: "11",
    title: "Esperanza",
    artist: "Ana Flores",
    album: "Nuevo Día",
    language: "Spanish",
    genre: "Folk",
    releaseDate: "2021-04-07",
    lyrics: "La esperanza vive en mi alma, brillando como el amanecer. Cada día es una nueva oportunidad. Creo en un futuro mejor.",
    duration: "4:15",
    albumArt: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400&h=400&fit=crop"
  },
  {
    id: "12",
    title: "Voyage",
    artist: "Emma Laurent",
    album: "Destinations",
    language: "French",
    genre: "World",
    releaseDate: "2023-03-20",
    lyrics: "Mon voyage commence maintenant, découvrir le monde pas à pas. Chaque destination est une aventure. Je suis libre de partir où je veux.",
    duration: "3:55",
    albumArt: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop"
  },
  {
    id: "13",
    title: "Noche",
    artist: "Pablo Morales",
    album: "Oscuridad",
    language: "Spanish",
    genre: "Rock",
    releaseDate: "2019-10-31",
    lyrics: "La noche es mi compañera, en la oscuridad encuentro paz. Las estrellas son testigos de mis sueños. Hasta que amanezca.",
    duration: "4:20",
    albumArt: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&h=400&fit=crop"
  },
  {
    id: "14",
    title: "Bonheur",
    artist: "Julie Moreau",
    album: "Joie de Vivre",
    language: "French",
    genre: "Jazz",
    releaseDate: "2022-01-25",
    lyrics: "Le bonheur est simple, il suffit de regarder autour. Chaque sourire est précieux. Je savoure chaque instant de ma vie.",
    duration: "3:40",
    albumArt: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop"
  },
  {
    id: "15",
    title: "Vida",
    artist: "Roberto Sánchez",
    album: "Celebración",
    language: "Spanish",
    genre: "Cumbia",
    releaseDate: "2020-12-10",
    lyrics: "La vida es para celebrar, bailar y cantar. Cada momento es único e irrepetible. Vivimos con alegría y gratitud.",
    duration: "3:48",
    albumArt: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&h=400&fit=crop"
  }
];
