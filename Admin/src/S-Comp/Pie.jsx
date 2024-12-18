import { Box } from "@mui/material";
import Header from "./Header";

import Piechart from "../chart/PieChart";

const Pie = () => {
        return (
            <Box m="20px">
                <Header title="Pie Chart" subtitle="Simple Pie Chart" />
                <Box height="75vh">
                    <Piechart />
                </Box>
            </Box>
        )
    }

export default Pie;