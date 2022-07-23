import { SxProps, Theme } from '@mui/system';
import {waitFor, screen, getByRole} from '@testing-library/react'
import * as React from 'react';
import { render, fireEvent, testSnapshot } from '../../test/TestUtils';
import { Image } from "./Image"

testSnapshot(<Image src="url" alt="alt" sx={{color:"red"}}/>)

describe("initializing",() => {
    it('should use img tag', async () => {
        // When
        render(<Image />);
        
        // Then
        expect(screen.getByRole("img")).not.toBeUndefined();
    })

    it('should forward props to img tag', async () => {
        // Given
        const src:string = "imageSrc";
        const alt:string = "imageAlt";
        const sx:SxProps<Theme> = {background:"red"};
        
        // When
        render(<Image src={src} alt={alt} sx={sx} />);
        
        // Then
        const image = screen.getByRole("img");
        expect(image.getAttribute("src")).toBe(src);
        expect(image.getAttribute("alt")).toBe(alt);
        expect(window.getComputedStyle(image).background).toBe("red");
    })
})