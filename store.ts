import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PostValues = {
    title: string;
    content: string;
    author?: string;
    categories: number[];
    published: boolean;
};

type DraftRecord = {
    values: PostValues;
    savedAt: number;
};

type DraftStore = {
    drafts: Record<string, DraftRecord>;
    saveDraft: (key: string, values: PostValues) => void;
};

export const useDraftStore = create<DraftStore>()(
    persist(
        (set, get) => ({
            drafts: {},
            saveDraft: (key, values) =>
                set((state) => ({
                    drafts: { ...state.drafts, [key]: { values, savedAt: Date.now() } },
                })),
        }),
        { name: "typewriter-drafts" }
    )
);