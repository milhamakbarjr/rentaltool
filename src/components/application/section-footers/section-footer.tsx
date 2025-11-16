"use client";

import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";

const SectionFooterRoot = (props: ComponentPropsWithRef<"div">) => (
    <div {...props} className={cx("flex flex-col gap-4 border-t border-secondary pt-5", props.className)}>
        {props.children}
    </div>
);

const SectionFooterActions = (props: ComponentPropsWithRef<"div">) => (
    <div {...props} className={cx("flex justify-end gap-3", props.className)}>
        {props.children}
    </div>
);

export const SectionFooter = {
    Root: SectionFooterRoot,
    Actions: SectionFooterActions,
};
