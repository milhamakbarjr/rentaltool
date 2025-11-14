"use client";

import { useMemo, useState } from "react";
import { parseDate } from "@internationalized/date";
import { SearchLg } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer } from "recharts";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { MetricChangeIndicator, MetricsChart04 } from "@/components/application/metrics/metrics";
import { PaginationCardMinimal } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Input } from "@/components/base/input/input";
import { useDashboardStats, useRecentRentals, useRevenueByDate } from "../hooks/use-analytics";
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

// Helper to get initials from name
const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
    }
    return name.substring(0, 2).toUpperCase();
};

// Generate date range for chart (last 30 days)
const generateDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29);
    return { start: start.toISOString().split("T")[0], end: end.toISOString().split("T")[0] };
};

interface DashboardMainProps {
    userName: string;
    userEmail: string;
    userAvatarUrl?: string;
}

export const DashboardMain = ({ userName, userEmail, userAvatarUrl }: DashboardMainProps) => {
    const [selectedTab, setSelectedTab] = useState<string>("30days");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch dashboard data
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const dateRange = useMemo(() => generateDateRange(), []);
    const { data: revenueData } = useRevenueByDate(dateRange.start, dateRange.end);
    const { data: recentRentals } = useRecentRentals(10);

    // Format revenue data for chart
    const chartData = useMemo(() => {
        if (!revenueData || revenueData.length === 0) {
            return [];
        }

        return revenueData.map((item) => ({
            date: new Date(item.date),
            revenue: item.amount,
        }));
    }, [revenueData]);

    // Calculate total revenue from chart data
    const totalRevenue = useMemo(() => {
        return revenueData?.reduce((sum, item) => sum + item.amount, 0) || 0;
    }, [revenueData]);

    // Sort rentals
    const sortedRentals = useMemo(() => {
        if (!recentRentals) return [];
        if (!sortDescriptor) return recentRentals;

        return [...recentRentals].sort((a, b) => {
            let first = a[sortDescriptor.column as keyof typeof a];
            let second = b[sortDescriptor.column as keyof typeof b];

            // Handle nested customer object
            if (sortDescriptor.column === "customer" && typeof first === "object" && typeof second === "object") {
                first = (first as any)?.name;
                second = (second as any)?.name;
            }

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
    }, [recentRentals, sortDescriptor]);

    // Calculate metrics changes (mock percentages for now)
    const totalRevenueChange = "12.5%";
    const activeRentalsChange = "8.2%";
    const availableItemsChange = "-3.1%";

    // Generate simple chart data for metrics
    const generateMetricChartData = (points: number) => {
        return Array.from({ length: points }, (_, i) => ({
            value: Math.floor(Math.random() * 5) + 3,
        }));
    };

    const today = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="bg-primary">
            <main className="bg-primary pt-8 pb-12 lg:pt-12 lg:pb-24">
                <div className="flex flex-col gap-8">
                    <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-4 lg:px-8">
                        {/* Page header with avatar */}
                        <div className="relative flex flex-col gap-5 bg-primary">
                            <div className="flex flex-col gap-4 lg:flex-row">
                                <div className="flex flex-1 items-center gap-3 lg:gap-4">
                                    <Avatar
                                        size="xl"
                                        src={userAvatarUrl}
                                        alt={userName}
                                        initials={getInitials(userName)}
                                    />
                                    <div>
                                        <h1 className="text-xl font-semibold text-primary">
                                            Welcome back, {userName.split(" ")[0]}
                                        </h1>
                                        <p className="text-md text-tertiary">{today}</p>
                                    </div>
                                </div>
                                <Input
                                    className="md:w-80"
                                    size="sm"
                                    shortcut
                                    aria-label="Search"
                                    placeholder="Search"
                                    icon={SearchLg}
                                    value={searchQuery}
                                    onChange={(value) => setSearchQuery(value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between gap-6">
                            <Tabs
                                selectedKey={selectedTab}
                                onSelectionChange={(value) => setSelectedTab(value as string)}
                                className="w-auto"
                            >
                                <TabList
                                    type="button-minimal"
                                    items={[
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
                                            id: "7days",
                                            label: (
                                                <>
                                                    <span className="max-md:hidden">7 days</span>
                                                    <span className="md:hidden">7d</span>
                                                </>
                                            ),
                                        },
                                        {
                                            id: "24hours",
                                            label: (
                                                <>
                                                    <span className="max-md:hidden">24 hours</span>
                                                    <span className="md:hidden">24h</span>
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
                    </div>

                    {/* Metrics Cards */}
                    <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-4 md:flex-row md:flex-wrap lg:gap-6 lg:px-8">
                        <MetricsChart04
                            title={formatCurrency(stats?.total_revenue || 0)}
                            subtitle="Total Revenue"
                            className="flex-1 md:min-w-[320px]"
                            type="simple"
                            change={totalRevenueChange}
                            changeTrend="positive"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(7)}
                        />
                        <MetricsChart04
                            title={String(stats?.active_rentals || 0)}
                            subtitle="Active Rentals"
                            className="flex-1 md:min-w-[320px]"
                            type="simple"
                            change={activeRentalsChange}
                            changeTrend="positive"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(9)}
                        />
                        <MetricsChart04
                            title={String(stats?.available_items || 0)}
                            subtitle="Available Items"
                            className="flex-1 md:min-w-[320px]"
                            type="simple"
                            change={availableItemsChange}
                            changeTrend="negative"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(7)}
                        />
                    </div>

                    {/* Revenue Chart */}
                    <div className="mx-auto w-full max-w-container px-4 lg:px-8">
                        <div className="flex flex-col gap-0.5 rounded-xl bg-secondary_subtle shadow-xs ring-1 ring-secondary ring-inset">
                            <div className="flex gap-4 px-5 pt-3 pb-2">
                                <p className="text-sm font-semibold text-primary">Revenue</p>
                            </div>
                            <div className="flex flex-col gap-5 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                                <div className="flex flex-col items-start gap-4 lg:flex-row">
                                    <div className="flex flex-1 flex-col gap-3">
                                        <p className="text-display-sm font-semibold text-primary">
                                            {formatCurrency(totalRevenue)}
                                        </p>
                                        <div className="flex gap-2">
                                            <MetricChangeIndicator value="3.2%" trend="positive" type="simple" />
                                            <p className="text-sm font-medium text-tertiary">vs last 30 days</p>
                                        </div>
                                    </div>

                                    <Tabs defaultSelectedKey="30days" className="w-auto">
                                        <TabList
                                            type="button-minimal"
                                            items={[
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
                                                    id: "7days",
                                                    label: (
                                                        <>
                                                            <span className="max-md:hidden">7 days</span>
                                                            <span className="md:hidden">7d</span>
                                                        </>
                                                    ),
                                                },
                                                {
                                                    id: "24hours",
                                                    label: (
                                                        <>
                                                            <span className="max-md:hidden">24 hours</span>
                                                            <span className="md:hidden">24h</span>
                                                        </>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </Tabs>
                                </div>

                                <div className="flex h-54 w-full flex-col gap-2 lg:h-60">
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
                                            <p className="text-sm">No revenue data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Rentals Table */}
                    <div className="mx-auto flex w-full max-w-container flex-col gap-6 px-4 lg:px-8">
                        <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-xl">
                            <div className="flex gap-4 px-5 pt-3 pb-2.5">
                                <p className="text-sm font-semibold text-primary">Recent Rentals</p>
                            </div>

                            <div className="flex flex-col items-start gap-4 rounded-t-xl border-b border-secondary bg-primary p-5 ring-1 ring-secondary lg:flex-row">
                                <div className="flex flex-1 flex-col gap-3">
                                    <p className="text-display-sm font-semibold text-primary">
                                        {stats?.total_rentals || 0}
                                    </p>
                                    <div className="flex gap-2">
                                        <MetricChangeIndicator value="8.6%" trend="positive" type="simple" />
                                        <p className="text-sm font-medium text-tertiary">vs last 30 days</p>
                                    </div>
                                </div>

                                <Tabs defaultSelectedKey="all" className="w-auto">
                                    <TabList
                                        type="button-minimal"
                                        items={[
                                            { id: "all", label: "All rentals" },
                                            { id: "active", label: "Active" },
                                            { id: "completed", label: "Completed" },
                                        ]}
                                    />
                                </Tabs>
                            </div>

                            {sortedRentals && sortedRentals.length > 0 ? (
                                <>
                                    <Table
                                        aria-label="Recent rentals"
                                        selectionMode="multiple"
                                        sortDescriptor={sortDescriptor}
                                        onSortChange={setSortDescriptor}
                                        className="bg-primary"
                                    >
                                        <Table.Header className="bg-primary">
                                            <Table.Head id="rental_number" label="Rental #" allowsSorting isRowHeader className="w-full" />
                                            <Table.Head id="start_date" label="Start Date" allowsSorting />
                                            <Table.Head id="status" label="Status" allowsSorting className="max-md:hidden" />
                                            <Table.Head id="total_amount" label="Amount" allowsSorting className="max-md:hidden" />
                                            <Table.Head id="customer" label="Customer" allowsSorting className="max-md:hidden" />
                                        </Table.Header>

                                        <Table.Body items={sortedRentals}>
                                            {(rental) => (
                                                <Table.Row id={rental.id}>
                                                    <Table.Cell className="font-medium! text-primary">
                                                        {rental.rental_number || `#${rental.id.slice(0, 8)}`}
                                                    </Table.Cell>
                                                    <Table.Cell className="text-nowrap">
                                                        {formatDate(rental.start_date)}
                                                    </Table.Cell>
                                                    <Table.Cell className="max-md:hidden">
                                                        <BadgeWithDot
                                                            color={
                                                                rental.status === "active"
                                                                    ? "success"
                                                                    : rental.status === "completed"
                                                                      ? "gray"
                                                                      : rental.status === "overdue"
                                                                        ? "error"
                                                                        : "warning"
                                                            }
                                                            type="modern"
                                                            size="sm"
                                                            className="capitalize"
                                                        >
                                                            {rental.status}
                                                        </BadgeWithDot>
                                                    </Table.Cell>
                                                    <Table.Cell className="max-md:hidden">
                                                        {formatCurrency(rental.total_amount || 0)}
                                                    </Table.Cell>
                                                    <Table.Cell className="text-nowrap max-md:hidden">
                                                        <div className="flex w-max items-center gap-3">
                                                            <Avatar
                                                                initials={getInitials(rental.customer?.name || "NA")}
                                                                alt={rental.customer?.name || "Unknown"}
                                                                size="md"
                                                            />
                                                            <div>
                                                                <p className="text-sm font-medium text-primary">
                                                                    {rental.customer?.name || "Unknown"}
                                                                </p>
                                                                <p className="text-sm text-tertiary">
                                                                    {rental.customer?.email || ""}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table>
                                    <PaginationCardMinimal align="right" page={1} total={1} className="bg-primary" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center bg-primary px-5 py-12">
                                    <p className="text-sm text-tertiary">No rentals found</p>
                                </div>
                            )}
                        </TableCard.Root>
                    </div>
                </div>
            </main>
        </div>
    );
};
