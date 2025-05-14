// // src/components/Dashboard.tsx

// import { Card, CardContent, Grid, Typography } from "@mui/material";
// import React from "react";
// import {
//     Bar,
//     BarChart,
//     Cell,
//     Legend,
//     Pie,
//     PieChart,
//     Tooltip,
//     XAxis,
//     YAxis,
// } from "recharts";

// const Dashboard: React.FC = () => {
//     const dataOrders = [
//         { name: "Total Orders", value: 400 },
//         { name: "Transit Orders", value: 300 },
//         { name: "Returned Orders", value: 100 },
//         { name: "Pending Orders", value: 200 },
//     ];

//     const dataSales = [{ name: "Total Sales", value: 5000 }];

//     const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//     return (
//         <Grid container spacing={3}>
//             {/* Total Orders Chart */}
//             <Grid item xs={12} md={6}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6">Total Orders</Typography>
//                         <PieChart width={400} height={400}>
//                             <Pie
//                                 data={dataOrders}
//                                 cx={200}
//                                 cy={200}
//                                 labelLine={false}
//                                 outerRadius={80}
//                                 fill="#8884d8"
//                                 dataKey="value"
//                             >
//                                 {dataOrders.map((index) => (
//                                     <Cell
//                                         key={`cell-${index}`}
//                                         /* @ts-ignore */
//                                         fill={COLORS[index]}
//                                     />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                         </PieChart>
//                     </CardContent>
//                 </Card>
//             </Grid>

//             {/* Transit Orders Chart */}
//             <Grid item xs={12} md={6}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6">Transit Orders</Typography>
//                         <BarChart
//                             width={400}
//                             height={300}
//                             data={[{ name: "Transit Orders", value: 300 }]}
//                         >
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="value" fill="#82ca9d" />
//                         </BarChart>
//                     </CardContent>
//                 </Card>
//             </Grid>

//             {/* Returned Orders Chart */}
//             <Grid item xs={12} md={6}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6">Returned Orders</Typography>
//                         <BarChart
//                             width={400}
//                             height={300}
//                             data={[{ name: "Returned Orders", value: 100 }]}
//                         >
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="value" fill="#ffbb28" />
//                         </BarChart>
//                     </CardContent>
//                 </Card>
//             </Grid>

//             {/* Pending Orders Chart */}
//             <Grid item xs={12} md={6}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6">Pending Orders</Typography>
//                         <BarChart
//                             width={400}
//                             height={300}
//                             data={[{ name: "Pending Orders", value: 200 }]}
//                         >
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="value" fill="#ff8042" />
//                         </BarChart>
//                     </CardContent>
//                 </Card>
//             </Grid>

//             {/* Total Sales Chart */}
//             <Grid item xs={12}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6">Total Sales</Typography>
//                         <BarChart width={400} height={300} data={dataSales}>
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="value" fill="#0088FE" />
//                         </BarChart>
//                     </CardContent>
//                 </Card>
//             </Grid>
//         </Grid>
//     );
// };

// export default Dashboard;
// src/components/Dashboard.tsx

import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const Dashboard: React.FC = () => {
    const dataOrders = [
        { name: "Total Orders", value: 400 },
        { name: "Transit Orders", value: 300 },
        { name: "Returned Orders", value: 100 },
        { name: "Pending Orders", value: 200 },
    ];

    const dataSales = [{ name: "Total Sales", value: 5000 }];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <Grid container spacing={3}>
            {/* Total Orders Chart */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Orders</Typography>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={dataOrders}
                                cx={200}
                                cy={200}
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {dataOrders.map((index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        /* @ts-ignore */
                                        fill={COLORS[index]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </CardContent>
                </Card>
            </Grid>

            {/* Transit Orders Chart */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Transit Orders</Typography>
                        <BarChart
                            width={400}
                            height={300}
                            data={[{ name: "Transit Orders", value: 300 }]}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                    </CardContent>
                </Card>
            </Grid>

            {/* Returned Orders Chart */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Returned Orders</Typography>
                        <BarChart
                            width={400}
                            height={300}
                            data={[{ name: "Returned Orders", value: 100 }]}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#ffbb28" />
                        </BarChart>
                    </CardContent>
                </Card>
            </Grid>

            {/* Pending Orders Chart */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Pending Orders</Typography>
                        <BarChart
                            width={400}
                            height={300}
                            data={[{ name: "Pending Orders", value: 200 }]}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#ff8042" />
                        </BarChart>
                    </CardContent>
                </Card>
            </Grid>

            {/* Total Sales Chart */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Sales</Typography>
                        <BarChart width={400} height={300} data={dataSales}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#0088FE" />
                        </BarChart>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Dashboard;