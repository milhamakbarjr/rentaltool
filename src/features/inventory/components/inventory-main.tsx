"use client";

import { useMemo, useState } from "react";
import { SearchLg, Plus } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { useRouter } from "next/navigation";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import { MetricsChart04 } from "@/components/application/metrics/metrics";
import { Table, TableCard } from "@/components/application/table/table";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { PaginationCardMinimal } from "@/components/application/pagination/pagination";
import { Select } from "@/components/base/select/select";
import { useInventoryItems, useCategories, useInventoryStats } from "../hooks/use-inventory";
import { formatCurrency } from "@/lib/utils";
import { ROUTES, ITEM_CONDITION_LABELS } from "@/utils/constants";
import type { InventoryFilterData } from "../schemas/inventory-schema";

// Helper to get status badge color
const getStatusColor = (status: string) => {
    switch (status) {
        case "available":
            return "success";
        case "rented":
            return "warning";
        case "maintenance":
            return "error";
        case "retired":
            return "gray";
        default:
            return "gray";
    }
};

// Helper to format date
const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const InventoryMain = () => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    // Build filters based on UI state
    const filters: InventoryFilterData = useMemo(() => {
        const f: InventoryFilterData = {
            search: searchQuery || undefined,
            sort_by: (sortDescriptor?.column as any) || "created_at",
            sort_order: sortDescriptor?.direction === "ascending" ? "asc" : "desc",
        };

        if (selectedCategory) {
            f.category_id = selectedCategory;
        }

        if (selectedTab !== "all") {
            f.status = selectedTab as any;
        }

        return f;
    }, [selectedTab, searchQuery, selectedCategory, sortDescriptor]);

    // Fetch data
    const { data: items, isLoading } = useInventoryItems(filters);
    const { data: categories } = useCategories();
    const { data: stats } = useInventoryStats();

    // Sort items
    const sortedItems = useMemo(() => {
        if (!items) return [];
        return items;
    }, [items]);

    // Generate simple chart data for metrics
    const generateMetricChartData = (points: number) => {
        return Array.from({ length: points }, (_, i) => ({
            value: Math.floor(Math.random() * 5) + 3,
        }));
    };

    // Calculate utilization rate
    const utilizationRate = stats?.total_items
        ? Math.round((stats.rented_items / stats.total_items) * 100)
        : 0;

    return (
        <div className="bg-primary">
            <main className="bg-primary pt-8 pb-12 lg:pt-12 lg:pb-24">
                <div className="flex flex-col gap-8">
                    <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-4 lg:px-8">
                        {/* Page header */}
                        <div className="relative flex flex-col gap-5 bg-primary">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex flex-1 flex-col gap-1">
                                    <h1 className="text-display-sm font-semibold text-primary">Inventory</h1>
                                    <p className="text-md text-tertiary">
                                        Manage your rental items and track performance
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Input
                                        className="md:w-80"
                                        size="sm"
                                        aria-label="Search inventory"
                                        placeholder="Search items..."
                                        icon={SearchLg}
                                        value={searchQuery}
                                        onChange={(value) => setSearchQuery(value)}
                                    />
                                    <Button
                                        size="sm"
                                        icon={Plus}
                                        onPress={() => router.push(`${ROUTES.INVENTORY}/new`)}
                                    >
                                        <span className="max-md:hidden">Add Item</span>
                                        <span className="md:hidden">Add</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Status tabs and category filter */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <Tabs
                                selectedKey={selectedTab}
                                onSelectionChange={(value) => setSelectedTab(value as string)}
                                className="w-auto"
                            >
                                <TabList
                                    type="button-minimal"
                                    items={[
                                        { id: "all", label: "All items" },
                                        { id: "available", label: "Available" },
                                        { id: "rented", label: "Rented" },
                                        { id: "maintenance", label: "Maintenance" },
                                    ]}
                                />
                            </Tabs>

                            {categories && categories.length > 0 && (
                                <Select
                                    size="sm"
                                    placeholder="All Categories"
                                    selectedKey={selectedCategory}
                                    onSelectionChange={(key) => setSelectedCategory(key as string)}
                                    items={[
                                        { id: "", label: "All Categories" },
                                        ...categories.map((cat) => ({
                                            id: cat.id,
                                            label: `${cat.icon || ""} ${cat.name}`,
                                        })),
                                    ]}
                                >
                                    {(item) => (
                                        <Select.Item key={item.id} id={item.id}>
                                            {item.label}
                                        </Select.Item>
                                    )}
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-4 md:flex-row md:flex-wrap lg:gap-6 lg:px-8">
                        <MetricsChart04
                            title={String(stats?.total_items || 0)}
                            subtitle="Total Items"
                            className="flex-1 md:min-w-[280px]"
                            type="simple"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(7)}
                        />
                        <MetricsChart04
                            title={String(stats?.available_items || 0)}
                            subtitle="Available"
                            className="flex-1 md:min-w-[280px]"
                            type="simple"
                            change="12.5%"
                            changeTrend="positive"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(7)}
                        />
                        <MetricsChart04
                            title={`${utilizationRate}%`}
                            subtitle="Utilization Rate"
                            className="flex-1 md:min-w-[280px]"
                            type="simple"
                            change="8.2%"
                            changeTrend="positive"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(7)}
                        />
                        <MetricsChart04
                            title={formatCurrency(stats?.total_value || 0)}
                            subtitle="Total Value"
                            className="flex-1 md:min-w-[280px]"
                            type="simple"
                            chartColor="text-fg-brand-secondary"
                            chartAreaFill="none"
                            chartData={generateMetricChartData(7)}
                        />
                    </div>

                    {/* Inventory Table */}
                    <div className="mx-auto flex w-full max-w-container flex-col gap-6 px-4 lg:px-8">
                        <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-xl">
                            <div className="flex gap-4 px-5 pt-3 pb-2.5">
                                <p className="text-sm font-semibold text-primary">Inventory Items</p>
                            </div>

                            {!isLoading && sortedItems && sortedItems.length > 0 ? (
                                <>
                                    <Table
                                        aria-label="Inventory items"
                                        selectionMode="multiple"
                                        sortDescriptor={sortDescriptor}
                                        onSortChange={setSortDescriptor}
                                        className="bg-primary"
                                    >
                                        <Table.Header className="bg-primary">
                                            <Table.Head id="name" label="Item Name" allowsSorting isRowHeader className="w-full" />
                                            <Table.Head id="category" label="Category" className="max-md:hidden" />
                                            <Table.Head id="status" label="Status" allowsSorting />
                                            <Table.Head id="quantity_total" label="Quantity" allowsSorting className="max-md:hidden" />
                                            <Table.Head id="pricing" label="Daily Rate" allowsSorting className="max-md:hidden" />
                                            <Table.Head id="condition" label="Condition" className="max-lg:hidden" />
                                        </Table.Header>

                                        <Table.Body items={sortedItems}>
                                            {(item) => {
                                                const pricing = item.pricing as any;
                                                const dailyRate = pricing?.daily || 0;

                                                return (
                                                    <Table.Row
                                                        id={item.id}
                                                        href={`${ROUTES.INVENTORY}/${item.id}`}
                                                    >
                                                        <Table.Cell className="font-medium! text-primary">
                                                            {item.name}
                                                        </Table.Cell>
                                                        <Table.Cell className="max-md:hidden">
                                                            {item.category ? (
                                                                <span>
                                                                    {item.category.icon} {item.category.name}
                                                                </span>
                                                            ) : (
                                                                <span className="text-tertiary">Uncategorized</span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <BadgeWithDot
                                                                color={getStatusColor(item.status)}
                                                                type="modern"
                                                                size="sm"
                                                                className="capitalize"
                                                            >
                                                                {item.status}
                                                            </BadgeWithDot>
                                                        </Table.Cell>
                                                        <Table.Cell className="max-md:hidden">
                                                            {item.quantity_total}
                                                        </Table.Cell>
                                                        <Table.Cell className="max-md:hidden">
                                                            {formatCurrency(dailyRate)}
                                                        </Table.Cell>
                                                        <Table.Cell className="max-lg:hidden">
                                                            <span className="text-sm text-tertiary capitalize">
                                                                {ITEM_CONDITION_LABELS[item.condition]}
                                                            </span>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                );
                                            }}
                                        </Table.Body>
                                    </Table>
                                    <PaginationCardMinimal align="right" page={1} total={1} className="bg-primary" />
                                </>
                            ) : isLoading ? (
                                <div className="flex flex-col items-center justify-center bg-primary px-5 py-12">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-utility-brand-600 border-t-transparent" />
                                    <p className="mt-4 text-sm text-tertiary">Loading inventory...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center bg-primary px-5 py-12">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-utility-gray-100">
                                        <svg
                                            className="h-6 w-6 text-utility-gray-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mt-4 text-sm font-medium text-primary">No inventory items</h3>
                                    <p className="mt-2 text-center text-sm text-tertiary">
                                        Get started by adding your first inventory item.
                                    </p>
                                    <Button
                                        size="sm"
                                        icon={Plus}
                                        className="mt-4"
                                        onPress={() => router.push(`${ROUTES.INVENTORY}/new`)}
                                    >
                                        Add Item
                                    </Button>
                                </div>
                            )}
                        </TableCard.Root>
                    </div>
                </div>
            </main>
        </div>
    );
};
