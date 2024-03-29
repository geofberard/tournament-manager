import { Box, SxProps, Theme } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { getStaticURL } from "../../service/PromiseService";

export interface ImageProps {
    src?: string;
    alt?: string;
    sx?: SxProps<Theme>;
}

export const Image: FC<ImageProps> = ({ src = "", alt = "", sx = {} }: ImageProps) => {
    return <Box component="img" sx={sx} alt={alt} src={getStaticURL(src)} />;
};
