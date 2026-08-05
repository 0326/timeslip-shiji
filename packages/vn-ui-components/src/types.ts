/**
 * Shared types for vn-ui-components pages/props.
 * Kept minimal — re-exported types used across multiple pages live here.
 */
import type { Storyline } from "vn-content-schemas";

export type StorylineWithLock = Storyline & { unlocked: boolean };
