export interface Characters {
    id: number,
    name: string,
    status: string,
    species: string,
    image: string,
    origin: {
        name: string
    }
}
export interface CharactersList {
    info: [
        count: number,
        pages: number,
        next: string,
        prev: string
    ],
    results: Characters[]
}