// Genres

export enum SeedGenre {
  ACTION = "action",
  ADVENTURE = "adventure",
  SCIFI = "sci-fi",
  COMEDY = "comedy",
  DRAMA = "drama",
}

// Persons

export const seedPersons = {
  MatthewMcConaughey: {
    firstName: "Matthew",
    familyName: "McConaughey",
    birthday: new Date(1969, 11, 4, 0, 0, 0, 0),
  },
  AnneHathaway: {
    firstName: "Anne",
    familyName: "Hathaway",
    birthday: new Date(1982, 11, 12, 0, 0, 0, 0),
  },
  DiCaprio: {
    firstName: "Leonardo",
    familyName: "DiCaprio",
    birthday: new Date(1974, 11, 11, 0, 0, 0, 0),
  },
  ElliotPage: {
    firstName: "Elliot",
    familyName: "Page",
    birthday: new Date(1987, 2, 21, 0, 0, 0, 0),
  },
  JosephLevitt: {
    firstName: "Joseph",
    familyName: "Gordon-Levitt",
    birthday: new Date(1981, 2, 17, 0, 0, 0, 0),
  },
  ElizabethDebicki: {
    firstName: "Elizabeth",
    familyName: "Debicki",
    birthday: new Date(1990, 8, 24, 0, 0, 0, 0),
  },
  RobertPattinson: {
    firstName: "Robert",
    familyName: "Pattinson",
    birthday: new Date(1986, 5, 13, 0, 0, 0, 0),
  },
  JordanBelfort: {
    firstName: "Jordan",
    familyName: "Belfort",
    birthday: new Date(1962, 7, 9, 0, 0, 0, 0),
  },
};

// Movies

export const seedMovies = {
  Interstellar: {
    title: "Interstellar",
    rating: 80,
    releaseDate: new Date(2016, 11, 7, 0, 0, 0, 0),
    genres: [SeedGenre.ADVENTURE, SeedGenre.SCIFI],
    cast: [seedPersons.MatthewMcConaughey, seedPersons.AnneHathaway],
  },
  Inception: {
    title: "Inception",
    rating: 80,
    releaseDate: new Date(2016, 11, 7, 0, 0, 0, 0),
    genres: [SeedGenre.ACTION, SeedGenre.SCIFI],
    cast: [seedPersons.ElliotPage, seedPersons.JosephLevitt],
  },
  Tenet: {
    title: "Tenet",
    rating: 80,
    releaseDate: new Date(2016, 11, 7, 0, 0, 0, 0),
    genres: [SeedGenre.ACTION, SeedGenre.SCIFI],
    cast: [
      seedPersons.DiCaprio,
      seedPersons.ElizabethDebicki,
      seedPersons.RobertPattinson,
    ],
  },
  ThwWolfOfWallStreet: {
    title: "The Wolf of Wall Street",
    rating: 82,
    releaseDate: new Date(2016, 11, 7, 0, 0, 0, 0),
    genres: [SeedGenre.COMEDY, SeedGenre.DRAMA],
    cast: [seedPersons.DiCaprio, seedPersons.JordanBelfort],
  },
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function seed(): Promise<void> {}
