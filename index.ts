export const headerLinks = [
    {
        route: "#",
        label: "electronics",
    },
    {
        route: "#",
        label: "mobiles",
    },
    {
        route: "#",
        label: "ladies",
    },
    {
        route: "#",
        label: "men",
    },
    {
        route: "#",
        label: "groceries",
    },
];

export const calculateAverageRating = (reviews) => {
    if (reviews.length == 0) return 0;
    const totalStars = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalStars / reviews.length).toFixed(1).toString(); // Rounds to 1 decimal and converts to string
};
