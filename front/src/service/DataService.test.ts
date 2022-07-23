import { findById } from "./DataService";

interface ObjectWithId {
    id: string,
    value: string
}

describe('parseElementId',() => {
    it('should return element with the right id', () => {
        // Given
        const searchedId = "searched";
        const searchedObject: ObjectWithId = {id: searchedId, value: "searchedValue"};
        const objects: ObjectWithId[] = [
            {id: "wrong1", value: "wrongA"},
            searchedObject,
            {id: "wrong2", value: "wrongB"},
        ]

        // When
        const foundElement = findById(searchedId, objects);
        
        // Then
        expect(foundElement).toBe(searchedObject);
    })

    it('should return nothing if no ids are matching ', () => {
        // Given
        const searchedId = "searched";
        const searchedObject: ObjectWithId = {id: searchedId, value: "searchedValue"};
        const objects: ObjectWithId[] = [
            {id: "wrong1", value: "wrongA"},
            {id: "wrong2", value: "wrongB"},
        ]

        // When
        const foundElement = findById(searchedId, objects);
        
        // Then
        expect(foundElement).toBeUndefined();
    })
})