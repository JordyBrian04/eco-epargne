

export const checkConnection = async () => {

}

export function transformDateToSpecificDateTime(inputDate: string): string {
    // Convertir la chaîne en un objet Date
    const date = new Date(inputDate);

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
        throw new Error("La date fournie est invalide.");
    }

    // Options de formatage
    const options:any = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };

    // Retourner la date formatée en français
    return date.toLocaleString("fr-FR", options);
}

export function formatFrenchDate(dateString: string): string {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    return new Intl.DateTimeFormat('fr-FR', options).format(date);
}