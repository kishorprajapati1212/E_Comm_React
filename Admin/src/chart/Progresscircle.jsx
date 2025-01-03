import { Box, useTheme } from "@mui/material";
import { Theme } from "../Theme";

const ProgressCircle = ({ progress = "0.75", size = "40" }) => {
    const theme = useTheme();
    const colors = Theme(theme.palette.mode);

    const currentmonths = new Date().getMonth() + 1;
    const yearprogress = currentmonths/12;
    const angle = yearprogress  * 360;

    return (
        <Box sx={{
            background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
                conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
                ${colors.greenAccent[500]} `,
            borderRadius : "50%",
            width: `${size}px`,
            height: `${size}px`,
        }}
        />
    );
}

export default ProgressCircle;
