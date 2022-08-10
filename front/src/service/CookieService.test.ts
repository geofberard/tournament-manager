import { getCookie, setCookie } from "./CookieService";

const cookieId = "CookieId";

describe("getCookie", () => {
    it("should return nothing when the cookie is not set ", () => {
        // When
        const cookieValue = getCookie(cookieId);

        // Then
        expect(cookieValue).toBeUndefined();
    });

    it("should return value when the cookie is set ", () => {
        // Given
        const mockedCookieValue = "MockedCookieValue";
        Object.defineProperty(document, "cookie", {
            writable: true,
            value: `${cookieId}=${mockedCookieValue}`,
        });

        // When
        const cookieValue = getCookie(cookieId);

        // Then
        expect(cookieValue).toBe(mockedCookieValue);
    });
});

describe("setCookie", () => {
    it("should set cookie value ", () => {
        // Given
        const cookieValue = "CookieValue";

        // When
        setCookie(cookieId, cookieValue, 30);

        // Then
        expect(document.cookie).toContain(`${cookieId}=${cookieValue}`);
    });
});
