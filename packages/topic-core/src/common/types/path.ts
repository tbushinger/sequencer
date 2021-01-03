import { toPath as _toPath } from "lodash";

export type PathPart = string | number;

export type Path = PathPart | PathPart[];

export function toPath(
    path: Path,
): PathPart[] {
    return _toPath(path);
}