// components/AdminDashboard.jsx
"use client";

import { getSuits } from "@/lib/data-service";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";

function AdminDashboard() {
    const [suits, setSuits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSuits = async () => {
            const data = await getSuits();
            setSuits(data);
            setLoading(false);
        };
        loadSuits();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    const categoryCount = {};
    suits.forEach((suit) => {
        const cat = suit.category;
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const pieData = Object.keys(categoryCount).map((key) => ({
        name: key === "male" ? "Men" : key === "female" ? "Women" : key,
        value: categoryCount[key],
    }));

    const COLORS = ["#97c7c7", "#80d6d6", "#00a6a6", "#007a7a", "#004d4d"];

    // آماده‌سازی داده‌ها برای نمودار میله‌ای (قیمت محصولات)
    const barData = suits.slice(0, 10).map((suit) => ({
        name:
            suit.name.length > 20 ? suit.name.slice(0, 20) + "..." : suit.name,
        price: suit.price,
        discount: suit.discount,
    }));

    // آمار کلی
    const totalProducts = suits.length;
    const totalValue = suits.reduce((sum, s) => sum + s.price, 0).toFixed(0);
    const avgPrice = (totalValue / totalProducts).toFixed(0);
    const discountedProducts = suits.filter((s) => s.discount > 0).length;

    return (
        <div>
            <div className="inline-block mb-8">
                <span className="subHeading">&bull; Admin dashboard</span>
                <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
            </div>

            {/* Cart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <ScrollReveal
                    direction="left"
                    delay={0}
                    className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow text-center"
                >
                    <div>
                        <p className="font-comic text-2xl font-bold text-amber-600">
                            {totalProducts}
                        </p>
                        <p className="paragraph mb-0">Total Products</p>
                    </div>
                </ScrollReveal>
                <ScrollReveal
                    direction="right"
                    delay={0}
                    className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow text-center"
                >
                    <div>
                        <p className="font-comic text-2xl font-bold text-amber-600">
                            ${totalValue}
                        </p>
                        <p className="paragraph mb-0">Total Value</p>
                    </div>
                </ScrollReveal>
                <ScrollReveal
                    direction="left"
                    delay={0}
                    className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow text-center"
                >
                    <div>
                        <p className="font-comic text-2xl font-bold text-amber-600">
                            ${avgPrice}
                        </p>
                        <p className="paragraph mb-0">Average Price</p>
                    </div>
                </ScrollReveal>
                <ScrollReveal
                    direction="right"
                    delay={0}
                    className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow text-center"
                >
                    <div>
                        <p className="font-comic text-2xl font-bold text-amber-600">
                            {discountedProducts}
                        </p>
                        <p className="paragraph mb-0">Discounted Products</p>
                    </div>
                </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ScrollReveal
                    direction="left"
                    delay={0}
                    className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow"
                >
                    <div>
                        <h4 className="paragraph mb-0 text-center">
                            Products by Category
                        </h4>
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(
                                            0,
                                        )}%`
                                    }
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>{" "}
                </ScrollReveal>

                {/* نمودار میله‌ای - قیمت محصولات */}
                <ScrollReveal
                    direction="right"
                    delay={0}
                    className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow"
                >
                    <div>
                        <h4 className="paragraph mb-8 text-center">
                            Top Products by Price
                        </h4>
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    fontSize={10}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="price"
                                    fill="#004d4d"
                                    name="Price ($)"
                                />
                                <Bar
                                    dataKey="discount"
                                    fill="#00a6a6"
                                    name="Discount (%)"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}

export default AdminDashboard;
