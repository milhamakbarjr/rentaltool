"use client";

import { useMemo, useState } from "react";
import { parseDate } from "@internationalized/date";
import type { SortDescriptor } from "react-aria-components";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { MetricChangeIndicator, MetricsChart04 } from "@/components/application/metrics/metrics";
import { PaginationCardMinimal } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { useDashboardStats, useRevenueByDate, useTopItems, useMetricsComparison } from "../hooks/use-analytics";
import { formatCurrency } from "@/lib/utils";

// Helper function for formatting date timestamp
const formatDate = (timestamp: string | number): string => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

// Helper for short date format (chart axis)
const formatShortDate = (timestamp: string | number): string => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

// Generate date range based on selected period
const generateDateRange = (period: string) => {
    const end = new Date();
    const start = new Date();

    switch (period) {
        case "7days":
            start.setDate(start.getDate() - 6);
            break;
        case "24hours":
            start.setHours(start.getHours() - 24);
            break;
        case "90days":
            start.setDate(start.getDate() - 89);
            break;
        case "12months":
            start.setMonth(start.getMonth() - 12);
            break;
        case "30days":
        default:
            start.setDate(start.getDate() - 29);
            break;
    }

    return {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0]
    };
};

interface AnalyticsMainProps {
    userName: string;
    userEmail: string;
    userAvatarUrl?: string;
}

export const AnalyticsMain = ({ userName, userEmail, userAvatarUrl }: AnalyticsMainProps) => {
    const t = useTranslations("analytics");
    const [selectedPeriod, setSelectedPeriod] = useState<string>("30days");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();

    // Fetch analytics data
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const dateRange = useMemo(() => generateDateRange(selectedPeriod), [selectedPeriod]);
    const { data: revenueData } = useRevenueByDate(dateRange.start, dateRange.end);
    const { data: topItems } = useTopItems(10);
    const { data: metricsComparison } = useMetricsComparison(30);

    // Format revenue data for chart
    const chartData = useMemo(() => {
        if (!revenueData || revenueData.length === 0) {
            return [];
        }

        return revenueData.map((item) => ({
            date: item.date,
            revenue: item.amount,
        }));
    }, [revenueData]);

    // Calculate total revenue from chart data
    const totalRevenue = useMemo(() => {
        return revenueData?.reduce((sum, item) => sum + item.amount, 0) || 0;
    }, [revenueData]);

    // Calculate average revenue
    const averageRevenue = useMemo(() => {
        if (!revenueData || revenueData.length === 0) return 0;
        return totalRevenue / revenueData.length;
    }, [revenueData, totalRevenue]);

    // Sort top items
    const sortedTopItems = useMemo(() => {
        if (!topItems) return [];
        if (!sortDescriptor) return topItems;

        return [...topItems].sort((a, b) => {
            let first = a[sortDescriptor.column as keyof typeof a];
            let second = b[sortDescriptor.column as keyof typeof b];

            // Handle numbers
            if (typeof first === "number" && typeof second === "number") {
                return sortDescriptor.direction === "ascending" ? first - second : second - first;
            }

            // Handle strings
            if (typeof first === "string" && typeof second === "string") {
                const result = first.localeCompare(second);
                return sortDescriptor.direction === "ascending" ? result : -result;
            }

            return 0;
        });
    }, [topItems, sortDescriptor]);

    // Calculate inventory utilization rate
    const utilizationRate = useMemo(() => {
        if (!stats || stats.total_items === 0) return 0;
        return Math.round((stats.total_items - stats.available_items) / stats.total_items * 100);
    }, [stats]);

    return (
        <div className="flex flex-col gap-8">
            {/* Date Range Filter */}
            <div className="flex justify-between gap-6">
                <Tabs
                    selectedKey={selectedPeriod}
                    onSelectionChange={(value) => setSelectedPeriod(value as string)}
                    className="w-auto"
                >
                    <TabList
                        type="button-minimal"
                        items={[
                            {
                                id: "24hours",
                                label: (
                                    <>
                                        <span className="max-md:hidden">24 hours</span>
                                        <span className="md:hidden">24h</span>
                                    </>
                                ),
                            },
                            {
                                id: "7days",
                                label: (
                                    <>
                                        <span className="max-md:hidden">7 days</span>
                                        <span className="md:hidden">7d</span>
                                    </>
                                ),
                            },
                            {
                                id: "30days",
                                label: (
                                    <>
                                        <span className="max-md:hidden">30 days</span>
                                        <span className="md:hidden">30d</span>
                                    </>
                                ),
                            },
                            {
                                id: "90days",
                                label: (
                                    <>
                                        <span className="max-md:hidden">90 days</span>
                                        <span className="md:hidden">90d</span>
                                    </>
                                ),
                            },
                            {
                                id: "12months",
                                label: (
                                    <>
                                        <span className="max-md:hidden">12 months</span>
                                        <span className="md:hidden">12m</span>
                                    </>
                                ),
                            },
                        ]}
                    />
                </Tabs>

                <div className="max-lg:hidden">
                    <DateRangePicker
                        defaultValue={{
                            start: parseDate(dateRange.start),
                            end: parseDate(dateRange.end),
                        }}
                    />
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="flex w-full flex-col gap-5 md:flex-row md:flex-wrap lg:gap-6">
                <MetricsChart04
                    title={formatCurrency(totalRevenue)}
                    subtitle={t("totalRevenue")}
                    className="flex-1 md:min-w-[320px]"
                    type="simple"
                    change={metricsComparison?.revenue.trend !== 'neutral' ? metricsComparison?.revenue.value || "0%" : "0%"}
                    changeTrend={metricsComparison?.revenue.trend !== 'neutral' ? (metricsComparison?.revenue.trend as 'positive' | 'negative') : "positive"}
                    chartColor="text-fg-brand-secondary"
                    chartAreaFill="none"
                    chartData={[]}
                />
                <MetricsChart04
                    title={String(stats?.active_rentals || 0)}
                    subtitle={t("activeRentals")}
                    className="flex-1 md:min-w-[320px]"
                    type="simple"
                    change={metricsComparison?.activeRentals.trend !== 'neutral' ? metricsComparison?.activeRentals.value || "0%" : "0%"}
                    changeTrend={metricsComparison?.activeRentals.trend !== 'neutral' ? (metricsComparison?.activeRentals.trend as 'positive' | 'negative') : "positive"}
                    chartColor="text-fg-brand-secondary"
                    chartAreaFill="none"
                    chartData={[]}
                />
                <MetricsChart04
                    title={String(stats?.total_customers || 0)}
                    subtitle={t("totalCustomers")}
                    className="flex-1 md:min-w-[320px]"
                    type="simple"
                    change={metricsComparison?.customers.trend !== 'neutral' ? metricsComparison?.customers.value || "0%" : "0%"}
                    changeTrend={metricsComparison?.customers.trend !== 'neutral' ? (metricsComparison?.customers.trend as 'positive' | 'negative') : "positive"}
                    chartColor="text-fg-brand-secondary"
                    chartAreaFill="none"
                    chartData={[]}
                />
                <MetricsChart04
                    title={`${utilizationRate}%`}
                    subtitle={t("inventoryUtilization")}
                    className="flex-1 md:min-w-[320px]"
                    type="simple"
                    change="0%"
                    changeTrend="positive"
                    chartColor="text-fg-brand-secondary"
                    chartAreaFill="none"
                    chartData={[]}
                />
            </div>

            {/* Revenue Chart */}
            <div className="flex flex-col gap-0.5 rounded-xl bg-secondary_subtle shadow-xs ring-1 ring-secondary ring-inset">
                <div className="flex gap-4 px-5 pt-3 pb-2">
                    <p className="text-sm font-semibold text-primary">{t("revenueTrends")}</p>
                </div>
                <div className="flex flex-col gap-5 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-3">
                            <p className="text-display-sm font-semibold text-primary">
                                {formatCurrency(totalRevenue)}
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex gap-2">
                                    <MetricChangeIndicator value="3.2%" trend="positive" type="simple" />
                                    <p className="text-sm font-medium text-tertiary">vs previous period</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="text-sm font-medium text-tertiary">
                                        Avg: {formatCurrency(averageRevenue)}/day
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex h-54 w-full flex-col gap-2 lg:h-72">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer className="h-full">
                                <AreaChart data={chartData} className="text-tertiary [&_.recharts-text]:text-xs">
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="currentColor"
                                                className="text-utility-gray-500"
                                                stopOpacity="0.7"
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="currentColor"
                                                className="text-utility-gray-500"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />

                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatShortDate}
                                        stroke="currentColor"
                                        className="text-tertiary"
                                    />

                                    <YAxis
                                        tickFormatter={(value) => formatCurrency(value, true)}
                                        stroke="currentColor"
                                        className="text-tertiary"
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--color-bg-primary)',
                                            border: '1px solid var(--color-border-secondary)',
                                            borderRadius: '8px',
                                        }}
                                        labelFormatter={(label) => formatDate(label)}
                                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                                    />

                                    <Area
                                        isAnimationActive={false}
                                        className="text-utility-brand-600 [&_.recharts-area-area]:translate-y-[6px] [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]"
                                        dataKey="revenue"
                                        name="Revenue"
                                        type="monotone"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        fill="url(#gradient)"
                                        fillOpacity={0.05}
                                        activeDot={{
                                            className: "fill-bg-primary stroke-utility-brand-600 stroke-2",
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-tertiary">
                                <p className="text-sm">No revenue data available for this period</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Performing Items Table */}
            <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-xl">
                <div className="flex gap-4 px-5 pt-3 pb-2.5">
                    <p className="text-sm font-semibold text-primary">Top Performing Items</p>
                </div>

                <div className="flex flex-col items-start gap-4 rounded-t-xl border-b border-secondary bg-primary p-5 ring-1 ring-secondary lg:flex-row">
                    <div className="flex flex-1 flex-col gap-3">
                        <p className="text-display-sm font-semibold text-primary">
                            {topItems?.length || 0}
                        </p>
                        <p className="text-sm font-medium text-tertiary">
                            Items generating revenue
                        </p>
                    </div>

                    <Tabs defaultSelectedKey="revenue" className="w-auto">
                        <TabList
                            type="button-minimal"
                            items={[
                                { id: "revenue", label: "By Revenue" },
                                { id: "frequency", label: "By Frequency" },
                            ]}
                        />
                    </Tabs>
                </div>

                {sortedTopItems && sortedTopItems.length > 0 ? (
                    <>
                        <Table
                            aria-label="Top performing items"
                            selectionMode="none"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            className="bg-primary"
                        >
                            <Table.Header className="bg-primary">
                                <Table.Head id="name" label="Item Name" allowsSorting isRowHeader className="w-full" />
                                <Table.Head id="rental_count" label="Rentals" allowsSorting className="max-md:hidden" />
                                <Table.Head id="total_revenue" label="Revenue" allowsSorting />
                                <Table.Head id="performance" label="Performance" className="max-md:hidden" />
                            </Table.Header>

                            <Table.Body items={sortedTopItems}>
                                {(item) => (
                                    <Table.Row id={item.id}>
                                        <Table.Cell className="font-medium! text-primary">
                                            {item.name}
                                        </Table.Cell>
                                        <Table.Cell className="text-nowrap max-md:hidden">
                                            {item.rental_count} times
                                        </Table.Cell>
                                        <Table.Cell className="text-nowrap font-medium">
                                            {formatCurrency(item.total_revenue || 0)}
                                        </Table.Cell>
                                        <Table.Cell className="max-md:hidden">
                                            <BadgeWithDot
                                                color={
                                                    item.total_revenue > 500000
                                                        ? "success"
                                                        : item.total_revenue > 100000
                                                          ? "warning"
                                                          : "gray"
                                                }
                                                type="modern"
                                                size="sm"
                                            >
                                                {item.total_revenue > 500000
                                                    ? "Excellent"
                                                    : item.total_revenue > 100000
                                                      ? "Good"
                                                      : "Average"}
                                            </BadgeWithDot>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                        <PaginationCardMinimal align="right" page={1} total={1} className="bg-primary" />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center bg-primary px-5 py-12">
                        <p className="text-sm text-tertiary">No rental data available yet</p>
                    </div>
                )}
            </TableCard.Root>

            {/* Additional Metrics Summary */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                <div className="flex flex-col gap-3 rounded-xl bg-secondary_subtle p-5 shadow-xs ring-1 ring-secondary ring-inset">
                    <p className="text-sm font-medium text-tertiary">Average Rental Value</p>
                    <p className="text-display-xs font-semibold text-primary">
                        {formatCurrency(stats?.total_rentals ? totalRevenue / stats.total_rentals : 0)}
                    </p>
                    <div className="flex gap-2">
                        <MetricChangeIndicator value="4.1%" trend="positive" type="simple" />
                        <p className="text-xs text-tertiary">vs previous period</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl bg-secondary_subtle p-5 shadow-xs ring-1 ring-secondary ring-inset">
                    <p className="text-sm font-medium text-tertiary">Total Rentals</p>
                    <p className="text-display-xs font-semibold text-primary">
                        {stats?.total_rentals || 0}
                    </p>
                    <div className="flex gap-2">
                        <MetricChangeIndicator value="8.6%" trend="positive" type="simple" />
                        <p className="text-xs text-tertiary">vs previous period</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl bg-secondary_subtle p-5 shadow-xs ring-1 ring-secondary ring-inset">
                    <p className="text-sm font-medium text-tertiary">Available Items</p>
                    <p className="text-display-xs font-semibold text-primary">
                        {stats?.available_items || 0} <span className="text-sm text-tertiary">of {stats?.total_items || 0}</span>
                    </p>
                    <div className="flex gap-2">
                        <MetricChangeIndicator value="2.3%" trend="negative" type="simple" />
                        <p className="text-xs text-tertiary">vs previous period</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
