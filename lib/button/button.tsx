import React, { FC, useCallback, useEffect } from "react";
import "./button.scss";
import classNames from "../common/utils/classNames";
import Wave from "../common/component/wave/wave";
import { addButtonClassNamePrefix, makeButtonTypeClassName } from "./_util";
import { ButtonProps } from "./types";
import useWave from "../common/hooks/useWave";
import Icon from "../icon/icon";

const Button: FC<ButtonProps> = function ({
  children,
  className,
  type = "default",
  defaultType,
  loading,
  ...rest
}) {
  const [waveColor, ref] = useWave();
  const preventLoadingClick = useCallback(
    (e) => {
      if (loading) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [loading]
  );
  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }
    target.addEventListener(
      "click",
      (e: MouseEvent) => {
        preventLoadingClick(e);
      },
      false
    );
  }, []);
  const buttonNode = (
    <button
      ref={ref}
      type={defaultType ? defaultType : "button"}
      className={classNames(
        className,
        addButtonClassNamePrefix(""),
        makeButtonTypeClassName(type),
        loading ? addButtonClassNamePrefix("loading") : ""
      )}
      {...rest}
    >
      {loading ? (
        <span className={addButtonClassNamePrefix("icon")}>
          <Icon
            className={addButtonClassNamePrefix("icon-loading")}
            name="loading"
          />
        </span>
      ) : null}

      {children}
    </button>
  );

  return (
    <Wave waveColor={waveColor} isInline={true}>
      {buttonNode}
    </Wave>
  );
};
export default Button;
