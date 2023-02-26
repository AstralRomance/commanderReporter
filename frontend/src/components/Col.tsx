import { clsx } from "clsx";
import { HTMLAttributes, memo, PropsWithChildren } from "react";

interface ColProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  count: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}
const Col = memo<ColProps>(({ count, className, children }) => {
  return (
    <div
      className={clsx("col", className, {
        ["s1"]: count === 1,
        ["s2"]: count === 2,
        ["s3"]: count === 3,
        ["s4"]: count === 4,
        ["s5"]: count === 5,
        ["s6"]: count === 6,
        ["s7"]: count === 7,
        ["s8"]: count === 8,
        ["s9"]: count === 9,
        ["s10"]: count === 10,
        ["s11"]: count === 11,
        ["s12"]: count === 12,
      })}
    >
      {children}
    </div>
  );
});

export default Col;
