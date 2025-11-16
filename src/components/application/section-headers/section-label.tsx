"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";

interface SectionLabelRootProps extends ComponentPropsWithRef<"div"> {
    title: string;
    description?: string;
    isRequired?: boolean;
    size?: "sm" | "md";
}

const SectionLabelRoot = ({
    title,
    description,
    isRequired = false,
    size = "md",
    className,
    ...props
}: SectionLabelRootProps) => (
    <div {...props} className={cx("flex flex-col gap-0.5", className)}>
        <div className="flex items-center gap-1">
            <span
                className={cx(
                    "font-medium text-secondary",
                    size === "sm" && "text-sm",
                    size === "md" && "text-md"
                )}
            >
                {title}
            </span>
            {isRequired && <span className="text-error">*</span>}
        </div>
        {description && (
            <p className={cx("text-tertiary", size === "sm" && "text-sm", size === "md" && "text-md")}>
                {description}
            </p>
        )}
    </div>
);

export const SectionLabel = {
    Root: SectionLabelRoot,
};
