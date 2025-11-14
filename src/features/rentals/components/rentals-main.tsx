"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, SearchLg } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { MetricChangeIndicator, MetricsChart04 } from "@/components/application/metrics/metrics";
import { PaginationCardMinimal } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { formatCurrency } from "@/lib/utils";
import { RENTAL_STATUSES, ROUTES } from "@/utils/constants";
import { useRentals } from "../hooks/use-rentals";
import type { RentalFilterData } from "../schemas/rental-schema";

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

// Generate simple chart data for metrics
const generateMetricChartData = (points: number) => {
    return Array.from({ length: points }, (_, i) => ({
        value: Math.floor(Math.random() * 5) + 3,
    }));
};

export const RentalsMain = () => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
    const [searchQuery, setSearchQuery] = useState("");

    // Build filters based on selected tab and search
    const filters = useMemo<RentalFilterData>(() => {
        const baseFilters: RentalFilterData = {
            sort_by: "created_at",
            sort_order: "desc",
        };

        if (searchQuery) {
            baseFilters.search = searchQuery;
        }

        if (selectedTab !== "all") {
            baseFilters.status = selectedTab as any;
        }

        return baseFilters;
    }, [selectedTab, searchQuery]);

    // Fetch rentals data
    const { data: rentals, isLoading } = useRentals(filters);

    // Calculate metrics
    const metrics = useMemo(() => {
        if (!rentals) {
            return {
                totalRentals: 0,
                activeRentals: 0,
                totalRevenue: 0,
                overdueRentals: 0,
            };
        }

        return {
            totalRentals: rentals.length,
            activeRentals: rentals.filter((r) => r.status === RENTAL_STATUSES.ACTIVE).length,
            totalRevenue: rentals.reduce((sum, r) => sum + (r.total_amount || 0), 0),
            overdueRentals: rentals.filter((r) => r.status === RENTAL_STATUSES.OVERDUE).length,
        };
    }, [rentals]);

    // Sort rentals
    const sortedRentals = useMemo(() => {
        if (!rentals) return [];
        if (!sortDescriptor) return rentals;

        return [...rentals].sort((a, b) => {
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
    }, [rentals, sortDescriptor]);

    const handleCreateRental = () => {
        router.push(`${ROUTES.RENTALS}/new`);
    };

    const handleRowAction = (id: string | number) => {
        router.push(`${ROUTES.RENTALS}/${id}`);
    };

    return (
        <div className="bg-primary">
            <main className="bg-primary pt-8 pb-12 lg:pt-12 lg:pb-24">
                <div className="flex flex-col gap-8">
                    <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-4 lg:px-8">
                        {/* Page header */}
                        <div className="relative flex flex-col gap-5 bg-primary">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h1 className="text-display-xs font-semibold text-primary lg:text-display-sm">Rentals</h1>
                                    <p className="mt-1 text-md text-tertiary">Manage and track all your rental transactions</p>
                                </div>
                                <Button size="md" color="primary" iconLeading={Plus} onClick={handleCreateRental}>
                                    New Rental
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4 lg:flex-row">
                                <Input
                                    className="flex-1 lg:max-w-80"
                                    size="sm"
                                    shortcut
                                    aria-label="Search"
                                    placeholder="Search rentals..."
                                    icon={SearchLg}
                                    value={searchQuery}
                                    onChange={(value) => setSearchQuery(value)}
                                />
                            </div>
                        </div>

                        {/* Tabs for status filtering */}
                        <div className="flex justify-between gap-6">
                            <Tabs selectedKey={selectedTab} onSelectionChange={(value) => setSelectedTab(value as string)} className="w-auto">
                                <TabList
                                    type="button-minimal"
                                    items={[
                                        { id: "all", label: "All rentals" },
                                        { id: RENTAL_STATUSES.ACTIVE, label: "Active" },
                                        { id: RENTAL_STATUSES.UPCOMING, label: "Upcoming" },
                                        { id: RENTAL_STATUSES.COMPLETED, label: "Completed" },
                                        { id: RENTAL_STATUSES.OVERDUE, label: "Overdue" },
                                    ]}
                                />
                            </Tabs>
                        </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-4 md:flex-row md:flex-wrap lg:gap-6 lg:px-8">
                        <MetricsChart04
                            title={String(metrics.totalRentals)}
                            subtitle="Total Rentals"
                            className="flex-1 md:min-w-[280px]"
                            type="simple"
                            change="12.5%"
                            changeTrend="positive"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(7)}
                        />
                        <MetricsChart04
                            title={String(metrics.activeRentals)}
                            subtitle="Active Rentals"
                            className="flex-1 md:min-w-[280px]"
                            type="simple"
                            change="8.2%"
                            changeTrend="positive"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(9)}
                        />
                        <MetricsChart04
                            title={formatCurrency(metrics.totalRevenue)}
                            subtitle="Total Revenue"
                            className="flex-1 md:min-w-[280px]"
                            type="simple"
                            change="15.3%"
                            changeTrend="positive"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(7)}
                        />
                    </div>

                    {/* Rentals Table */}
                    <div className="mx-auto flex w-full max-w-container flex-col gap-6 px-4 lg:px-8">
                        <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-xl">
                            <div className="flex gap-4 px-5 pt-3 pb-2.5">
                                <p className="text-sm font-semibold text-primary">All Rentals</p>
                            </div>

                            <div className="flex flex-col items-start gap-4 rounded-t-xl border-b border-secondary bg-primary p-5 ring-1 ring-secondary lg:flex-row">
                                <div className="flex flex-1 flex-col gap-3">
                                    <p className="text-display-sm font-semibold text-primary">{metrics.totalRentals}</p>
                                    <div className="flex gap-2">
                                        <MetricChangeIndicator value="12.5%" trend="positive" type="simple" />
                                        <p className="text-sm font-medium text-tertiary">vs last month</p>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center bg-primary px-5 py-12">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-solid border-t-transparent" />
                                </div>
                            ) : sortedRentals && sortedRentals.length > 0 ? (
                                <>
                                    <Table
                                        aria-label="Rentals"
                                        selectionMode="multiple"
                                        sortDescriptor={sortDescriptor}
                                        onSortChange={setSortDescriptor}
                                        onRowAction={handleRowAction}
                                        className="bg-primary"
                                    >
                                        <Table.Header className="bg-primary">
                                            <Table.Head id="rental_number" label="Rental #" allowsSorting isRowHeader className="w-full" />
                                            <Table.Head id="customer" label="Customer" allowsSorting className="max-md:hidden" />
                                            <Table.Head id="start_date" label="Start Date" allowsSorting />
                                            <Table.Head id="end_date" label="End Date" allowsSorting className="max-lg:hidden" />
                                            <Table.Head id="status" label="Status" allowsSorting />
                                            <Table.Head id="total_amount" label="Amount" allowsSorting className="max-md:hidden" />
                                        </Table.Header>

                                        <Table.Body items={sortedRentals}>
                                            {(rental) => (
                                                <Table.Row id={rental.id}>
                                                    <Table.Cell className="font-medium! text-primary">
                                                        {rental.rental_number || `#${rental.id.slice(0, 8)}`}
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
                                                                <p className="text-sm text-tertiary">{rental.customer?.email || ""}</p>
                                                            </div>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell className="text-nowrap">{formatDate(rental.start_date)}</Table.Cell>
                                                    <Table.Cell className="text-nowrap max-lg:hidden">{formatDate(rental.end_date)}</Table.Cell>
                                                    <Table.Cell>
                                                        <BadgeWithDot
                                                            color={
                                                                rental.status === RENTAL_STATUSES.ACTIVE
                                                                    ? "success"
                                                                    : rental.status === RENTAL_STATUSES.COMPLETED
                                                                      ? "gray"
                                                                      : rental.status === RENTAL_STATUSES.OVERDUE
                                                                        ? "error"
                                                                        : rental.status === RENTAL_STATUSES.UPCOMING
                                                                          ? "blue"
                                                                          : "warning"
                                                            }
                                                            type="modern"
                                                            size="sm"
                                                            className="capitalize"
                                                        >
                                                            {rental.status}
                                                        </BadgeWithDot>
                                                    </Table.Cell>
                                                    <Table.Cell className="max-md:hidden">{formatCurrency(rental.total_amount || 0)}</Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table>
                                    <PaginationCardMinimal align="right" page={1} total={1} className="bg-primary" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center bg-primary px-5 py-12">
                                    <p className="text-sm text-tertiary">
                                        {searchQuery || selectedTab !== "all" ? "No rentals match your filters" : "No rentals found"}
                                    </p>
                                </div>
                            )}
                        </TableCard.Root>
                    </div>
                </div>
            </main>
        </div>
    );
};
