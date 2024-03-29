export const findById: <T extends { id: string }>(id: string, elements: T[]) => T = (
    id,
    elements,
) => elements.find((element) => element.id === id);
