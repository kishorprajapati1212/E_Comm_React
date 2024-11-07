import Header from "../../S-Comp/Header"
import { Box, Button, Typography, useTheme } from "@mui/material"
import { mockTransactions } from "../../Data/data"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
// import EmailIcon from "@mui/icons-material/Email";
import TrafficIcon from "@mui/icons-material/Traffic";
// import Linechart from "../../chart/Linechart";
// import BarChart from "../../chart/Barchart";
import Statebox from "../../chart/Statebox";
import { Theme } from "../../Theme";
import Bar from "../../S-Comp/bar";
import Line from "../../S-Comp/Line";
import Campaign from "./Campaign";
import ProfitDashbord from "./ProfitDashbord";
import Emailcount from "./Emailcount";
import Sellobtain from "./Sellobtain";
import Newuser from "./Newuser";
import Transactions from "./Transtions";


const Dashboard = () => {
  const theme = useTheme()
  const colors = Theme(theme.palette.mode);

  return <Box m="20px">

    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="DASHBOARD" subtitle="Welcome To Your Dashboard" />

      <Box>
        <Button sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "14px", fontWeight: "bold", padding: "10px 20px" }}>
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>
    </Box>

    {/* GRID & CHARTS */}

    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px" mt="10px">

      {/* ROW 1 */}

      <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
       <Emailcount />   {/* --------------------- Email_COUNT -------------------------    */}

      </Box>

      <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
       <Sellobtain />        {/* --------------------- SELL_OBTAIN -------------------------    */}
      </Box>

      <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
        <Newuser />  {/* --------------------- NEW_USER_OF_WEBSITE -------------------------    */}

      </Box>

      <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
        <Statebox title="130" subtitle="Traffic Inbound" progress="0.80" increase="+43%"
          icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />} />

      </Box>

      {/* ROW 2 */}

      <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]}>

        <ProfitDashbord />   {/* --------------------- PROFIT_DASHBOARD -------------------------    */}

        <Box height="250px" ml="-20px">
          <Line isDashboard={true} />  {/* --------------------- LINE_CHART -------------------------    */}
          {/* <Linechart isDashboard={true} /> */}
        </Box>
      </Box>

      {/* TRANSACTIONS */}

      <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
        <Transactions />
      </Box>

      {/* ROW 3 */}
      <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} p="30px" >
        <Campaign />  {/* --------------------- CAMPAIGN -------------------------    */}
      </Box>

      {/* BARCHAR */}
      <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} >
        <Typography variant="h5" fontWeight="600" sx={{ p: "30px 30px 0 30px" }}>
          Sales/Order Quality
        </Typography>
        <Box height="250px" mt="-20px" >
          <Bar isDashboard={true} />  {/* --------------------- BARCHART -------------------------    */}
          {/* <BarChart isDashboard={true} /> */}
        </Box>
      </Box>

      <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
        <Typography variant="h5" fontWeight="600" sx={{ mb: "15px" }}>
          GeoGrphy Based Traffic Comming Soon
        </Typography>
        <Box height="250px" mt="-20px" p="90px" fontSize="30px">
          Comming Soon...
          {/* <BarChart isDashboard={true} /> */}
        </Box>
      </Box>

    </Box>
  </Box>
}

export default Dashboard;